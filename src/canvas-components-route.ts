/**
 * Component metadata endpoint (/api/canvas/components) that Drupal Canvas
 * syncs the component library from.
 *
 * Replaces the SDK's own route so the app also runs on edge runtimes such as
 * Cloudflare Workers: the SDK route statically imports the component
 * discovery pipeline, which needs a Node filesystem. Production only serves
 * the manifest inlined at build time, so discovery is loaded on demand in
 * development and left out of production bundles.
 */
// The virtual manifest module is provided by the canvas() integration.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@drupal-canvas/headless-astro/src/virtual.d.ts" />
import manifest from 'virtual:@drupal-canvas/headless-astro/manifest'
import { createComponentMetadataHandler } from '@drupal-canvas/headless/components-endpoint/handler'
import type { APIRoute } from 'astro'

export const prerender = false

const handler = createComponentMetadataHandler({
  isProduction: import.meta.env.PROD,
  loadManifest: async () => manifest,
  scanComponents: import.meta.env.DEV
    ? async () => (await import('@drupal-canvas/headless/components-endpoint')).buildComponentMetadataPayload()
    : undefined,
})

export const GET: APIRoute = ({ request }) => handler.GET(request)
export const OPTIONS: APIRoute = ({ request }) => handler.OPTIONS(request)
