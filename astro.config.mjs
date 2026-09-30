import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import canvas from '@drupal-canvas/headless-astro/integration'

/**
 * Auto-detect deployment platform and select the right adapter.
 *
 * - Netlify sets NETLIFY=true
 * - Vercel sets VERCEL=1
 * - Cloudflare sets CF_PAGES=1 (Pages) or WORKERS_CI=1 (Workers Builds);
 *   set DEPLOY_TARGET=cloudflare to build for it anywhere else
 * - Otherwise, fall back to Node.js standalone server
 */
async function getAdapter() {
  if (process.env.DEPLOY_TARGET === 'cloudflare' || process.env.CF_PAGES || process.env.WORKERS_CI) {
    const cloudflare = (await import('@astrojs/cloudflare')).default
    return cloudflare()
  }
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

/**
 * Mounts the Canvas SDK's draft routes plus this app's own component
 * metadata route (src/canvas-components-route.ts), which, unlike the SDK's,
 * bundles for edge runtimes.
 */
const canvasRoutes = {
  name: 'canvas-routes',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      const sdk = '@drupal-canvas/headless-astro/routes'
      injectRoute({ pattern: '/api/draft', entrypoint: `${sdk}/draft` })
      injectRoute({ pattern: '/api/draft/renew', entrypoint: `${sdk}/draft-renew` })
      injectRoute({ pattern: '/api/disable-draft', entrypoint: `${sdk}/disable-draft` })
      injectRoute({ pattern: '/api/canvas/jsonapi/[...path]', entrypoint: `${sdk}/jsonapi-proxy` })
      injectRoute({ pattern: '/api/canvas/components', entrypoint: './src/canvas-components-route.ts' })
    },
  },
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
    canvas({ injectRoutes: false }),
    canvasRoutes,
  ],
  vite: {
    optimizeDeps: {
      include: ['decoupled-client'],
    },
  },
})
