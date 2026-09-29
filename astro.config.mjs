import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import canvas from '@drupal-canvas/headless-astro/integration'

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
  // Canvas draft preview needs per-request rendering.
  output: 'server',
  adapter: await getAdapter(),
  integrations: [
    tailwind(),
    // Drupal Canvas headless: draft preview routes, the component metadata
    // endpoint Canvas syncs the library from, and CSP frame-ancestors for
    // the editor iframe. Components live in src/canvas (canvas.config.json).
    canvas(),
  ],
  vite: {
    optimizeDeps: {
      include: ['decoupled-client'],
    },
  },
})
