/**
 * Chrome config fetcher — pulls the header/footer preset from Drupal's
 * /api/dc-chrome/settings endpoint at build time.
 *
 * Cached per build; falls back to the default preset if Drupal is
 * unreachable so local dev / build-time outages don't break the site.
 */

const DEFAULT_BASE_URL = 'http://localhost'

export type HeaderPreset =
  | 'logo_nav_cta_right'
  | 'centered_logo'
  | 'logo_left_nav_right'
  | 'minimal_cta'

export interface ChromeConfig {
  header: {
    preset: HeaderPreset
  }
}

const FALLBACK: ChromeConfig = {
  header: { preset: 'logo_nav_cta_right' },
}

const KNOWN_PRESETS: readonly HeaderPreset[] = [
  'logo_nav_cta_right',
  'centered_logo',
  'logo_left_nav_right',
  'minimal_cta',
]

let _cache: Promise<ChromeConfig> | null = null
let _warnedOnce = false

export async function getChromeConfig(): Promise<ChromeConfig> {
  if (import.meta.env.DEV) {
    return fetchChrome()
  }
  if (_cache) return _cache
  _cache = fetchChrome()
  return _cache
}

async function fetchChrome(): Promise<ChromeConfig> {
  const base =
    import.meta.env.PUBLIC_DRUPAL_BASE_URL ||
    import.meta.env.DRUPAL_BASE_URL ||
    DEFAULT_BASE_URL
  const url = `${base.replace(/\/$/, '')}/api/dc-chrome/settings`

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) {
      if (!_warnedOnce) {
        console.warn(`[chrome] dc-chrome endpoint returned ${res.status} — using fallback`)
        _warnedOnce = true
      }
      return FALLBACK
    }
    const data = (await res.json()) as Partial<ChromeConfig> | null
    const raw = data?.header?.preset
    const preset: HeaderPreset = (KNOWN_PRESETS as readonly string[]).includes(raw ?? '')
      ? (raw as HeaderPreset)
      : FALLBACK.header.preset
    return { header: { preset } }
  } catch (err) {
    if (!_warnedOnce) {
      console.warn(`[chrome] failed to fetch ${url} — using fallback:`, (err as Error).message)
      _warnedOnce = true
    }
    return FALLBACK
  }
}
