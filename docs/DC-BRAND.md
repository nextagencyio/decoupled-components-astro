# dc_brand — local test loop

The Astro starter fetches brand tokens (fonts, colors, logos) from the Drupal
`dc_brand` module at build time and injects them as CSS custom properties.
This doc is the punch-list to take it through end-to-end locally.

## Prerequisites

- A Drupal space with the `dc_brand` module available on disk (branch
  `feat/dc-brand` in `nextagencyio/decoupled-project`).
- `DRUPAL_BASE_URL` set in `.env` pointing at your DDEV site, e.g.
  `https://decoupled-project.ddev.site`.

## 1. Enable and configure the module

```bash
cd ~/ddev/decoupled-project
ddev drush en dc_brand -y
ddev drush cr
```

Visit `/admin/config/brand`. You should see three open field groups:
**Typography**, **Colors**, **Logos**, plus a collapsed **Build hook** section.

- Pick a heading font and a body font from the dropdown.
- Enter 6-digit hex colors for primary / secondary / accent / neutral / background.
- Upload a light-mode logo (PNG/SVG/WebP) and optionally a dark-mode one.
- Leave **Build hook URL** empty for local dev (Astro dev server already
  hot-reloads on file change).

Save. Drupal fires a `ConfigCrudEvent` — the change subscriber schedules a
debounced build. With no URL configured, it clears itself without dispatching.

## 2. Verify the JSON endpoint

```bash
curl -s https://decoupled-project.ddev.site/api/dc-brand/settings | jq
```

You should see the resolved payload — fonts with `href` pointing at Google
Fonts, colors with full 9-stop HSL ramps (`css: "221 83% 53%"`), and logo
URLs as absolute paths.

## 3. Render it in Astro

```bash
cd ~/nodejs/decoupled-components-astro
DRUPAL_BASE_URL=https://decoupled-project.ddev.site npm run dev
```

Open `http://localhost:4321/brand-preview`. The page shows every resolved
token: font samples, 9-stop color swatches, logos on light + dark backgrounds,
and a row of real Tailwind classes (`bg-primary-500`, `border-accent-500`,
etc.) using the values.

## 4. Round-trip

- Change a color in Drupal → save
- Reload `/brand-preview` in Astro
- The page re-renders with the new values (Astro dev fetches fresh on every
  request during dev)

In production build:

```bash
npm run build
```

The fetch runs once at build time; the payload is cached for the build; the
static output has the resolved values baked in. Change brand in Drupal →
Netlify/Vercel build hook fires after the 60s debounce → fresh static HTML.

## Env vars

| Var | Purpose | Example |
| --- | --- | --- |
| `DRUPAL_BASE_URL` | Where to fetch brand JSON | `https://decoupled-project.ddev.site` |
| `PUBLIC_DRUPAL_URL` | Fallback if `DRUPAL_BASE_URL` unset | same |

If neither is set, `lib/brand.ts` returns its fallback payload so the build
doesn't fail — useful for the starter's default appearance before a Drupal
space is wired up.

## Troubleshooting

- **`[dc_brand] fetch failed (fetch failed); using fallback` in the Astro console**:
  Node's `fetch()` can't verify DDEV's self-signed cert. Either point
  `DRUPAL_BASE_URL` at `http://…` (DDEV serves both schemes) or prefix your
  dev command with `NODE_TLS_REJECT_UNAUTHORIZED=0`. Do **not** set that
  flag in production.
- **First `drush en dc_brand` fails with an assertion error about
  `dc_admin.info.yml`**: a pre-existing cache-registry staleness unrelated to
  this module. Run `ddev drush cr`, then `drush en dc_brand -y` again.
- **CORS error in dev**: the endpoint already sends `Access-Control-Allow-Origin: *`.
  If you still see one, confirm the request URL matches `DRUPAL_BASE_URL`.
- **Fonts not loading**: check Network tab for the `fonts.googleapis.com`
  stylesheet requests. If they're missing, the heading/body family isn't in
  the registry — only curated families have `href` values.
- **Logo 404s**: Drupal's public file scheme needs to serve `/sites/default/files/brand/*`
  publicly. Default config allows this.
- **Debounce never fires**: the subscriber piggybacks on request termination.
  Hit any URL on the Drupal site after the window elapses.
