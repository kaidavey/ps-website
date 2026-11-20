/**
 * Server-side handler for the For Companies "Let's Chat" form.
 *
 * The browser posts application/x-www-form-urlencoded to /api/contact. This
 * function checks the submission and forwards it to a Google Apps Script web
 * app. Posting to script.google.com from the browser is unreliable (the web
 * app answers with a redirect that breaks CORS), so only the server talks to it.
 *
 * The script URL comes from CONTACT_GAS_URL, which is not a VITE_ variable and
 * never ships in the client bundle. When it is missing, the response is a
 * non-2xx status so the form shows its existing error state.
 */

const FIELD_LIMITS = {
  name: 120,
  email: 254,
  company: 160,
  partnership: 80,
  message: 5000,
} as const

/** Off-screen field in Contact.tsx. Must stay in sync with that input's name. */
const HONEYPOT_FIELD = 'ps_leave_blank'

export const CONTACT_MAX_BODY_BYTES = 20_000

const UPSTREAM_TIMEOUT_MS = 10_000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactSubmission {
  name: string
  email: string
  company: string
  partnership: string
  message: string
}

export interface ContactHandlerDeps {
  /** Defaults to process.env. Tests pass a stub so they don't depend on the machine env. */
  env?: { CONTACT_GAS_URL?: string }
  fetch?: typeof fetch
}

export async function handleContactRequest(request: Request, deps: ContactHandlerDeps = {}): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' })
  }
  if (!originAllowed(request)) return json({ ok: false, error: 'Forbidden.' }, 403)

  const params = await readForm(request)
  if (params instanceof Response) return params
  // A filled honeypot is a bot. Respond as if it worked so the bot learns nothing.
  if (params.getAll(HONEYPOT_FIELD).some((value) => value.trim() !== '')) return json({ ok: true }, 200)

  const submission = validate(params)
  if (submission instanceof Response) return submission

  const gasUrl = (deps.env ?? process.env).CONTACT_GAS_URL?.trim() ?? ''
  if (!isGoogleAppsScriptUrl(gasUrl)) {
    return json({ ok: false, error: 'Contact form is not configured.' }, 503)
  }

  return forward(gasUrl, submission, deps.fetch ?? fetch)
}

const GAS_HOSTS = new Set(['script.google.com', 'script.googleusercontent.com'])

function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

async function readForm(request: Request): Promise<URLSearchParams | Response> {
  const declared = request.headers.get('content-length')
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > CONTACT_MAX_BODY_BYTES)) {
    return json({ ok: false, error: 'Submission is too large.' }, 413)
  }

  let raw: string
  try {
    raw = await request.text()
  } catch {
    return json({ ok: false, error: 'Submission could not be read.' }, 400)
  }
  if (new TextEncoder().encode(raw).byteLength > CONTACT_MAX_BODY_BYTES) {
    return json({ ok: false, error: 'Submission is too large.' }, 413)
  }
  return new URLSearchParams(raw)
}

function validate(params: URLSearchParams): ContactSubmission | Response {
  const name = params.get('name')?.trim() ?? ''
  const email = params.get('email')?.trim() ?? ''
  const company = params.get('company')?.trim() ?? ''
  const partnership = params.get('partnership')?.trim() ?? ''
  const message = params.get('message')?.trim() ?? ''

  if (!name) return json({ ok: false, error: 'Name is required.' }, 400)
  if (name.length > FIELD_LIMITS.name) return json({ ok: false, error: 'Name is too long.' }, 400)
  if (!email) return json({ ok: false, error: 'Email is required.' }, 400)
  if (email.length > FIELD_LIMITS.email) return json({ ok: false, error: 'Email is too long.' }, 400)
  if (!EMAIL_PATTERN.test(email)) return json({ ok: false, error: 'Enter a valid email address.' }, 400)
  if (!company) return json({ ok: false, error: 'Company is required.' }, 400)
  if (company.length > FIELD_LIMITS.company) return json({ ok: false, error: 'Company is too long.' }, 400)
  if (!partnership) return json({ ok: false, error: 'Partnership is required.' }, 400)
  if (partnership.length > FIELD_LIMITS.partnership) return json({ ok: false, error: 'Partnership is too long.' }, 400)
  if (message.length > FIELD_LIMITS.message) return json({ ok: false, error: 'Message is too long.' }, 400)

  return { name, email, company, partnership, message }
}

/** Only the Apps Script web-app host. Stops a bad env value from becoming an open proxy. */
function isGoogleAppsScriptUrl(value: string): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'script.google.com' && url.pathname.includes('/macros/')
  } catch {
    return false
  }
}

function isGasHost(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && GAS_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

/**
 * Apps Script answers the POST with a redirect to script.googleusercontent.com.
 * Follow only that hop, and only by hand, so a redirect cannot send the server
 * somewhere else. A 302/303 becomes a GET, which is what returns the JSON body.
 */
async function postToGas(gasUrl: string, body: URLSearchParams, fetchImpl: typeof fetch, signal: AbortSignal): Promise<Response> {
  let current = gasUrl
  let method: 'POST' | 'GET' = 'POST'
  let payload: URLSearchParams | undefined = body
  for (let hop = 0; hop < 5; hop++) {
    const response = await fetchImpl(current, {
      method,
      headers: payload
        ? { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' }
        : { accept: 'application/json' },
      body: payload,
      redirect: 'manual',
      signal,
    })
    if (response.status < 300 || response.status >= 400) return response
    const location = response.headers.get('location')
    await response.body?.cancel()
    if (!location) return response
    const next = new URL(location, current).href
    if (!isGasHost(next)) {
      console.error('[contact] refused upstream redirect')
      return new Response(null, { status: 502 })
    }
    current = next
    if (response.status !== 307 && response.status !== 308) {
      method = 'GET'
      payload = undefined
    }
  }
  console.error('[contact] too many upstream redirects')
  return new Response(null, { status: 502 })
}

async function forward(gasUrl: string, submission: ContactSubmission, fetchImpl: typeof fetch): Promise<Response> {
  const signal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
  let upstream: Response
  try {
    upstream = await postToGas(
      gasUrl,
      new URLSearchParams({
        name: submission.name,
        email: submission.email,
        company: submission.company,
        partnership: submission.partnership,
        message: submission.message,
      }),
      fetchImpl,
      signal,
    )
  } catch (error) {
    console.error('[contact] upstream request failed', error instanceof Error ? error.name : 'error')
    return json({ ok: false, error: 'Could not save your message.' }, 502)
  }

  if (!upstream.ok) {
    console.error('[contact] upstream status', upstream.status)
    return json({ ok: false, error: 'Could not save your message.' }, 502)
  }

  let body: unknown
  try {
    body = JSON.parse(await upstream.text())
  } catch {
    console.error('[contact] upstream returned a non-JSON body')
    return json({ ok: false, error: 'Could not save your message.' }, 502)
  }
  if (!body || typeof body !== 'object' || !('ok' in body) || body.ok !== true) {
    console.error('[contact] upstream rejected the submission')
    return json({ ok: false, error: 'Could not save your message.' }, 502)
  }

  return json({ ok: true }, 200)
}

/** Vercel serves a named POST export at /api/contact. */
export function POST(request: Request) {
  return handleContactRequest(request)
}

function json(body: { ok: boolean; error?: string }, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  })
}
