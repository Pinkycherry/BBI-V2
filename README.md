# BBI V2

A rebuild of [businessidea.io](https://businessidea.io) — the free library of
researched business ideas — on a new layout.

The content is unchanged: this app reads the same live Supabase `ideas` table as
the current site, through the same query layer. What is new is everything above
the data: the design system, the page composition, and the chrome.

## Stack

Same as the existing site, deliberately — every server function and Supabase
query ported across unmodified, so no content had to be re-entered or re-typed.

- TanStack Start (React 19, file-based routing, SSR)
- Supabase (read-only; the app never writes to `ideas`)
- Tailwind CSS v4
- Deployed to Vercel

## Running it

```sh
npm install
npm run dev
```

The app needs the database credentials in the environment:

```sh
IDEAVAULT_DB_URL=...        # Supabase project URL
IDEAVAULT_DB_ANON_KEY=...   # Supabase anon key
```

Put them in a `.env` file (gitignored) or set them in the shell. `VITE_`-prefixed
copies of both are also read.

### Offline rendering

Some environments block `*.supabase.co`, which makes every SSR loader fail. For
those, `.localdev/` holds a small PostgREST stand-in serving a real snapshot of
the data, so the whole site renders locally with no application code changed:

```sh
node .localdev/supabase-stand-in.mjs &
IDEAVAULT_DB_URL=http://127.0.0.1:54321 IDEAVAULT_DB_ANON_KEY=local npm run dev
```

`.localdev/` is gitignored — it is local scaffolding, never imported by the app
and never deployed.

## What is built

| Route | Page |
|---|---|
| `/` | Homepage |
| `/browse` | Every category |
| `/category/$categorySlug` | One category's blueprints |
| `/idea/$slug` | One blueprint |
| `/search` | Keyword search |

Still to port from the previous site: blog, calculators, FAQ hub, listicles,
validate pages, pricing, and the static/legal pages.

## House rules this repo inherits

- **Zero fabricated numbers.** Every figure traces to a real source. The three
  homepage statistics are the live blueprint count, the live category count, and
  the 967-person pre-launch review group — which is labelled on the page as a
  one-time count rather than a live metric.
- **Never invent a category slug, an idea title, or a statistic.** Category
  slugs are never hand-typed; they come from the database, and imagery is
  matched by whole-word rules in `src/config/category-imagery.ts`.
- **Never name an AI vendor in public copy.**
- **Never mutate the live Supabase rows.** This app only reads them.
- Images follow the naming and alt-text contract the previous repo set out in
  `IMAGE_SEO.md`.
