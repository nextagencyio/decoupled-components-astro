import { defineMiddleware } from 'astro:middleware'

// The Canvas SDK reads its Drupal origin from CANVAS_SITE_URL; decoupled.io
// frontends are configured with DRUPAL_BASE_URL, so derive one from the other.
process.env.CANVAS_SITE_URL ||= process.env.DRUPAL_BASE_URL || import.meta.env.DRUPAL_BASE_URL

// Node does not trust system CAs by default; local DDEV HTTPS (mkcert) needs them.
// Imported on demand so the Node-only helper (node:tls) is never bundled
// into edge runtimes such as Cloudflare Workers.
if (import.meta.env.DEV) {
  const { trustSystemCertificates } = await import('@drupal-canvas/headless/node')
  trustSystemCertificates()
}

export const onRequest = defineMiddleware((_context, next) => next())
