/**
 * Drupal Canvas page loading.
 *
 * Canvas pages are resolved by Drupal routing through the Canvas content
 * API and are draft-aware: inside the Canvas editor iframe (or after
 * /api/draft) the editor's unsaved changes are returned. Paths Drupal
 * resolves but Canvas does not manage (e.g. paragraph-based landing pages)
 * return null here so callers can fall back to the GraphQL client.
 */
import type { AstroGlobal } from 'astro'
import { fetchPage, isPageRedirect } from '@drupal-canvas/headless-astro'
import { isDemoMode } from './demo-mode'

export type CanvasPage = NonNullable<Awaited<ReturnType<typeof fetchPage>>>

export async function loadCanvasPage(Astro: AstroGlobal, path: string) {
  if (isDemoMode() || !process.env.CANVAS_SITE_URL) return null
  try {
    const result = await fetchPage(Astro, path)
    if (!result) return null
    if (isPageRedirect(result)) return result
    return result.content ? result : null
  } catch (error) {
    console.error(`Canvas: failed to load ${path}:`, error)
    return null
  }
}

export { isPageRedirect }
