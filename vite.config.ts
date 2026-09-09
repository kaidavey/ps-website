import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
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

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), notionMembersPlugin()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      // Shown in the footer as "Last updated".
      __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
  }
})
