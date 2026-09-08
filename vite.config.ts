import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  css: {
    modules: {
      // Readable in devtools, hashed for safety. Collisions become impossible.
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
  build: {
    // Surface regressions early rather than at 500 kB.
    chunkSizeWarningLimit: 300,
  },
})
