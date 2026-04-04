# Decoupled Components — Astro

An **Astro** starter template for [Decoupled.io](https://decoupled.io) — headless Drupal with a visual editor. This is the Astro port of [decoupled-components](https://github.com/nextagencyio/decoupled-components) (Next.js).

## Why Astro?

- **Zero JS by default** — Paragraph components ship zero JavaScript to the browser
- **Islands architecture** — Only interactive parts (editor, mobile menu, newsletter form) hydrate
- **Faster page loads** — Static HTML with selective hydration
- **Same Drupal backend** — Works with the exact same Decoupled.io CMS

## Quick Start

```bash
npm install
npm run setup      # Interactive wizard — creates Drupal space + imports content
npm run dev        # Start dev server at localhost:4321
```

Or run in **demo mode** (no Drupal needed):

```bash
npm install
npm run dev        # Uses mock data automatically
```

## Architecture

```
src/
├── components/
│   ├── paragraphs/          # Astro components (zero JS)
│   │   ├── ParagraphHero.astro
│   │   ├── ParagraphCardGroup.astro
│   │   ├── ParagraphSidebyside.astro
│   │   ├── ParagraphAccordion.astro    # Uses <details> for interactivity
│   │   ├── ParagraphQuote.astro
│   │   ├── ParagraphPricing.astro
│   │   ├── ParagraphLogoCollection.astro
│   │   ├── ParagraphStats.astro
│   │   ├── ParagraphNewsletter.astro   # Inline script for form
│   │   ├── ParagraphText.astro
│   │   ├── ParagraphRenderer.astro     # Switch/router
│   │   └── react/                      # React versions (for Puck editor only)
│   ├── ui/                  # Astro UI primitives
│   ├── editor/              # React islands for Puck editor
│   ├── Header.astro         # Inline script for mobile menu
│   └── Footer.astro
├── layouts/
│   ├── BaseLayout.astro     # Root HTML
│   ├── SiteLayout.astro     # Header + Footer wrapper
│   └── EditorLayout.astro   # Puck CSS
├── pages/
│   ├── index.astro          # Homepage
│   ├── [...slug].astro      # Dynamic pages
│   ├── node/[nid].astro     # Puck preview
│   ├── editor/[nid].astro   # Visual editor (React island)
│   ├── 404.astro
│   └── api/                 # API endpoints
│       ├── revalidate.ts
│       ├── drupal-puck/
│       ├���─ auth/validate.ts
│       ├── graphql.ts
│       ├── jsonapi/
│       ├── upload.ts
│       ├─��� editor-presence.ts
│       ├── ai/generate.ts
│       └── puck/
lib/                         # Shared utilities
├── drupal-client.ts         # TypedClient factory
├── mock-client.ts           # Demo mode client
├── types.ts                 # Paragraph type definitions
├── puck-config.tsx          # Auto-generated editor config
└── puck-auth.ts             # Session management
schema/                      # Auto-generated (do not edit)
data/
├── components-content.json  # Content model (single source of truth)
└── mock/                    # Demo mode data
```

## Key Differences from Next.js Version

| Feature | Next.js | Astro |
|---------|---------|-------|
| Rendering | React Server Components | Astro components (zero JS) |
| Interactivity | `'use client'` on every component | Islands (`client:load`, `client:only`) |
| Accordion | React `useState` | Native `<details>` element |
| Mobile menu | React `useState` | Inline `<script>` |
| Newsletter form | React `useState` | Inline `<script>` |
| API routes | `app/api/*/route.ts` | `src/pages/api/*.ts` |
| Env vars | `NEXT_PUBLIC_*` | `PUBLIC_*` |
| CSS loading | `next/font` | `<link>` tag |
| Image optimization | `next/image` | Native `<img>` |

## 10 Component Sections

All built as zero-JS Astro components:

1. **Hero** ��� Title, subtitle, CTAs, gradient/dark/image backgrounds
2. **Card Group** — Feature cards in 2-4 column grid with icons
3. **Side by Side** — Image + content with feature list
4. **Accordion** — Collapsible FAQ using `<details>` (no JS)
5. **Testimonials** — Quote cards with star ratings
6. **Pricing** — Tier comparison with featured highlighting
7. **Logo Collection** — Partner/tech logos with hover effects
8. **Stats** — Key metrics grid
9. **Newsletter** — Email signup with progressive enhancement
10. **Text Block** — Rich HTML content with CTA

## Environment Variables

```env
# Drupal Backend
DRUPAL_BASE_URL=https://your-space.decoupled.website
DRUPAL_CLIENT_ID=your-client-id
DRUPAL_CLIENT_SECRET=your-client-secret
DRUPAL_REVALIDATE_SECRET=random-secret

# Demo Mode (default: true)
PUBLIC_DEMO_MODE=true

# AI (optional)
GROQ_API_KEY=your-groq-key
PUCK_API_KEY=your-puck-cloud-key
PUBLIC_PUCK_AI_PROVIDER=groq

# Cloudinary (optional, for image uploads in editor)
PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
PUBLIC_CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## Scripts

```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run preview        # Preview production build
npm run setup          # Interactive setup wizard
npm run setup-content  # Import content model to Drupal
npm run sync-schema    # Regenerate TypeScript types from Drupal
```

## Deployment

Astro with the Node adapter runs on any Node.js host:

- **Vercel** — `npx astro add vercel` and deploy
- **Netlify** — `npx astro add netlify` and deploy
- **Docker/VPS** — `npm run build && node dist/server/entry.mjs`

## Resources

- [Decoupled.io](https://decoupled.io) — Headless Drupal platform
- [Astro Docs](https://docs.astro.build)
- [Puck Editor](https://puckeditor.com) — Visual page builder
