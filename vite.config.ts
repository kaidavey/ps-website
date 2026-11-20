import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fetchAndWriteMembers } from './scripts/lib/fetch-members-data.ts'

const NOTION_REFRESH_INTERVAL_MS = 45_000

/** Dev-only: periodically re-fetches Notion so the roster stays current without restarting the server. */
function notionMembersPlugin(): Plugin {
  return {
    name: 'notion-members-refresh',
    apply: 'serve',
    configureServer(server) {
      const interval = setInterval(() => {
        fetchAndWriteMembers().catch((error: unknown) => {
          server.config.logger.warn(`[notion] refresh failed: ${error instanceof Error ? error.message : error}`)
        })
      }, NOTION_REFRESH_INTERVAL_MS)
      server.httpServer?.on('close', () => clearInterval(interval))
    },
  }
}

interface ContactRouteModule {
  CONTACT_MAX_BODY_BYTES: number
  handleContactRequest: (request: Request) => Promise<Response>
}

/**
 * Dev and preview stand-in for the Vercel function. The module is loaded by file
 * URL so this config's TypeScript project does not have to own api/contact.ts
 * (the root tsconfig typechecks that file).
 */
function contactFormPlugin(): Plugin {
  let route: ContactRouteModule | undefined
  const loadRoute = async () => {
    route ??= (await import(new URL('./api/contact.ts', import.meta.url).href)) as ContactRouteModule
    return route
  }
  const attach = (middlewares: Connect.Server) => {
    middlewares.use(async (req, res, next) => {
      const path = (req.url ?? '').split('?')[0]
      if (path !== '/api/contact') {
        next()
        return
      }
      try {
        const { CONTACT_MAX_BODY_BYTES, handleContactRequest } = await loadRoute()
        const method = req.method ?? 'GET'
        const chunks: Buffer[] = []
        let received = 0
        for await (const chunk of req) {
          const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
          received += buffer.length
          if (received > CONTACT_MAX_BODY_BYTES) {
            req.resume()
            res.statusCode = 413
            res.setHeader('content-type', 'application/json; charset=utf-8')
            res.setHeader('cache-control', 'no-store')
            res.end(JSON.stringify({ ok: false, error: 'Submission is too large.' }))
            return
          }
          chunks.push(buffer)
        }
        const host = req.headers.host ?? 'localhost'
        const forwarded = req.headers['x-forwarded-proto']
        const proto = (Array.isArray(forwarded) ? forwarded[0] : forwarded) || 'http'
        const headers = new Headers()
        if (typeof req.headers['content-type'] === 'string') headers.set('content-type', req.headers['content-type'])
        if (typeof req.headers.origin === 'string') headers.set('origin', req.headers.origin)
        const hasBody = method !== 'GET' && method !== 'HEAD'
        const request = new Request(`${proto}://${host}${req.url}`, {
          method,
          headers,
          body: hasBody ? new Uint8Array(Buffer.concat(chunks)) : undefined,
        })
        const response = await handleContactRequest(request)
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(Buffer.from(await response.arrayBuffer()))
      } catch (error) {
        next(error instanceof Error ? error : new Error('Contact form failed'))
      }
    })
  }
  return {
    name: 'contact-form-api',
    configureServer(server) {
      attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}

// Same public-feed route as the production Vercel rewrite; no credentials required.
const lumaProxy = {
  '/api/luma-calendar': {
    target: 'https://api.luma.com',
    changeOrigin: true,
    rewrite: () => '/ics/get?entity=calendar&id=cal-TH7D6gDn85lzYyk',
  },
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), notionMembersPlugin(), contactFormPlugin()],
    server: { proxy: lumaProxy },
    preview: { proxy: lumaProxy },
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      // Shown in the footer as "Last updated".
      __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
  }
})
