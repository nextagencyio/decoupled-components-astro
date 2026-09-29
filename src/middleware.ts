import { defineMiddleware } from 'astro:middleware'
import { trustSystemCertificates } from '@drupal-canvas/headless/node'

// The Canvas SDK reads its Drupal origin from CANVAS_SITE_URL; decoupled.io
// frontends are configured with DRUPAL_BASE_URL, so derive one from the other.
process.env.CANVAS_SITE_URL ||= process.env.DRUPAL_BASE_URL || import.meta.env.DRUPAL_BASE_URL

// Node does not trust system CAs by default; local DDEV HTTPS (mkcert) needs them.
if (import.meta.env.DEV) {
  trustSystemCertificates()
}

export const onRequest = defineMiddleware((_context, next) => next())
