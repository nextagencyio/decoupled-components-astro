import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

/**
 * Auto-detect deployment platform and select the right adapter.
 *
 * - Netlify sets NETLIFY=true
 * - Vercel sets VERCEL=1
 * - Otherwise, fall back to Node.js standalone server
 */
async function getAdapter() {
  if (process.env.NETLIFY) {
    const netlify = (await import('@astrojs/netlify')).default
    return netlify()
  }
  if (process.env.VERCEL) {
    const vercel = (await import('@astrojs/vercel')).default
    return vercel()
  }
  const node = (await import('@astrojs/node')).default
  return node({ mode: 'standalone' })
}

export default defineConfig({
  output: 'server',
  adapter: await getAdapter(),
  integrations: [
    react(),
    tailwind(),
  ],
  vite: {
    optimizeDeps: {
      include: ['decoupled-client'],
    },
  },
})
