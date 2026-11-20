import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONTACT_MAX_BODY_BYTES, POST, handleContactRequest, type ContactHandlerDeps } from '../api/contact.ts'

const GAS_URL = 'https://script.google.com/macros/s/example/exec'
const PAGE = 'https://www.productspaceatucla.org/api/contact'

const validFields = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  partnership: 'Client Project',
  message: 'We would like to scope a project.',
}

function post(fields: Record<string, string>, extra?: { origin?: string | null; url?: string; method?: string }) {
  const headers = new Headers({ 'content-type': 'application/x-www-form-urlencoded' })
  if (extra?.origin) headers.set('origin', extra.origin)
  return new Request(extra?.url ?? PAGE, {
    method: extra?.method ?? 'POST',
    headers,
    body: extra?.method === 'GET' ? undefined : new URLSearchParams(fields),
  })
}

function recordedFetch(status = 200, payload: unknown = { ok: true }, rawBody?: string) {
  const calls: Array<{ url: string; init: RequestInit }> = []
  const fetchImpl: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init: init ?? {} })
    return new Response(rawBody ?? JSON.stringify(payload), {
      status,
      headers: { 'content-type': rawBody === undefined ? 'application/json' : 'text/html' },
    })
  }
  return { calls, fetchImpl }
}

function deps(fetchImpl: typeof fetch, env: ContactHandlerDeps['env'] = { CONTACT_GAS_URL: GAS_URL }): ContactHandlerDeps {
  return { env, fetch: fetchImpl }
}

test('missing CONTACT_GAS_URL returns 503 and does not call Google', async () => {
  const { calls, fetchImpl } = recordedFetch()
  const response = await handleContactRequest(post(validFields), deps(fetchImpl, {}))
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { ok: false, error: 'Contact form is not configured.' })
  assert.equal(calls.length, 0)
})

test('a non-Apps-Script URL is rejected before any request is sent', async () => {
  const { calls, fetchImpl } = recordedFetch()
  const response = await handleContactRequest(
    post(validFields),
    deps(fetchImpl, { CONTACT_GAS_URL: 'https://example.com/macros/s/example/exec' }),
  )
  assert.equal(response.status, 503)
  assert.equal(calls.length, 0)
})

test('the default env is process.env, so an unset variable fails cleanly', async () => {
  const previous = process.env.CONTACT_GAS_URL
  delete process.env.CONTACT_GAS_URL
  try {
    const response = await POST(post(validFields))
    assert.equal(response.status, 503)
    assert.equal((await response.json()).ok, false)
  } finally {
    if (previous === undefined) delete process.env.CONTACT_GAS_URL
    else process.env.CONTACT_GAS_URL = previous
  }
})

test('required fields, email format, and length caps are enforced', async () => {
  const { calls, fetchImpl } = recordedFetch()
  const cases: Array<{ fields: Record<string, string>; error: string }> = [
    { fields: { ...validFields, name: '   ' }, error: 'Name is required.' },
    { fields: { ...validFields, email: '' }, error: 'Email is required.' },
    { fields: { ...validFields, email: 'ada@example' }, error: 'Enter a valid email address.' },
    { fields: { ...validFields, email: `${'a'.repeat(250)}@b.co` }, error: 'Email is too long.' },
    { fields: { ...validFields, company: '' }, error: 'Company is required.' },
    { fields: { ...validFields, partnership: '' }, error: 'Partnership is required.' },
    { fields: { ...validFields, name: 'A'.repeat(121) }, error: 'Name is too long.' },
    { fields: { ...validFields, message: 'M'.repeat(5001) }, error: 'Message is too long.' },
  ]
  for (const { fields, error } of cases) {
    const response = await handleContactRequest(post(fields), deps(fetchImpl))
    assert.equal(response.status, 400, error)
    assert.deepEqual(await response.json(), { ok: false, error })
  }
  assert.equal(calls.length, 0)
})

test('an empty message is allowed and fields are trimmed before forwarding', async () => {
  const { calls, fetchImpl } = recordedFetch()
  const response = await handleContactRequest(
    post({ ...validFields, name: '  Ada Lovelace  ', email: ' ada@example.com ', message: '   ' }),
    deps(fetchImpl),
  )
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, GAS_URL)
  assert.equal(calls[0].init.method, 'POST')
  assert.equal(calls[0].init.redirect, 'manual')
  assert.ok(calls[0].init.signal instanceof AbortSignal)
  assert.equal(
    String(calls[0].init.body),
    new URLSearchParams({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical Engines',
      partnership: 'Client Project',
      message: '',
    }).toString(),
  )
})

test('a filled honeypot reports success and is not saved', async () => {
  const { calls, fetchImpl } = recordedFetch()
  const response = await handleContactRequest(post({ ...validFields, ps_leave_blank: 'https://spam.example' }), deps(fetchImpl))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(calls.length, 0)
})

test('cross-origin posts are rejected and same-origin posts are not', async () => {
  const { calls, fetchImpl } = recordedFetch()
  const blocked = await handleContactRequest(post(validFields, { origin: 'https://evil.example' }), deps(fetchImpl))
  assert.equal(blocked.status, 403)
  const allowed = await handleContactRequest(
    post(validFields, { origin: 'https://www.productspaceatucla.org' }),
    deps(fetchImpl),
  )
  assert.equal(allowed.status, 200)
  assert.equal(calls.length, 1)
})

test('oversized bodies are rejected', async () => {
  const response = await handleContactRequest(
    post({ ...validFields, message: 'M'.repeat(CONTACT_MAX_BODY_BYTES) }),
    deps(recordedFetch().fetchImpl),
  )
  assert.equal(response.status, 413)
})

test('only POST is accepted', async () => {
  const response = await handleContactRequest(new Request(PAGE, { method: 'GET' }), deps(recordedFetch().fetchImpl))
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('allow'), 'POST')
})

test('an upstream failure or a body that is not { ok: true } becomes 502', async () => {
  const httpError = recordedFetch(500, { ok: false })
  const failed = await handleContactRequest(post(validFields), deps(httpError.fetchImpl))
  assert.equal(failed.status, 502)

  const html = recordedFetch(200, null, '<html>sign in</html>')
  const unreadable = await handleContactRequest(post(validFields), deps(html.fetchImpl))
  assert.equal(unreadable.status, 502)

  const rejected = recordedFetch(200, { ok: false })
  const declined = await handleContactRequest(post(validFields), deps(rejected.fetchImpl))
  assert.equal(declined.status, 502)
})

test('the Apps Script redirect is followed only onto Google, as a GET', async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const fetchImpl: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), method: init?.method ?? '', body: init?.body ? String(init.body) : '' })
    if (calls.length === 1) {
      return new Response(null, {
        status: 302,
        headers: { location: 'https://script.googleusercontent.com/macros/echo?user_content_key=abc' },
      })
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }
  const response = await handleContactRequest(post(validFields), deps(fetchImpl))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(calls[0].method, 'POST')
  assert.match(calls[0].body, /name=Ada\+Lovelace/)
  assert.equal(calls[1].method, 'GET')
  assert.equal(calls[1].body, '')
  assert.equal(calls[1].url, 'https://script.googleusercontent.com/macros/echo?user_content_key=abc')
})

test('a redirect away from Google is not followed', async () => {
  let calls = 0
  const fetchImpl: typeof fetch = async () => {
    calls += 1
    return new Response(null, { status: 302, headers: { location: 'https://evil.example/steal' } })
  }
  const response = await handleContactRequest(post(validFields), deps(fetchImpl))
  assert.equal(response.status, 502)
  assert.equal(calls, 1)
})

test('a thrown upstream fetch becomes 502', async () => {
  const fetchImpl: typeof fetch = async () => {
    throw new Error('network down')
  }
  const response = await handleContactRequest(post(validFields), deps(fetchImpl))
  assert.equal(response.status, 502)
  assert.deepEqual(await response.json(), { ok: false, error: 'Could not save your message.' })
})
