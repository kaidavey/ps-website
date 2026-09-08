# Architecture

The conventions here exist so the codebase stays predictable as pages are
added. They are short on purpose. Follow them; propose a change if one stops
making sense.

## Layout

```
src/
  components/
    layout/     Structural: Container, Section, Header, Footer, SiteLayout
    ui/         Reusable presentational pieces: Button, ...
  config/       Site-wide constants (navigation, metadata)
  content/      CMS read API + generated JSON + content models
  hooks/        Reusable React hooks
  lib/          Framework-free utilities
  pages/        One component per route, composed from components/
  routes/       The route table
  styles/       tokens.css, reset.css, global.css
scripts/        Build-time tooling (the Notion fetch). Node only, never bundled.
```

Imports use the `@/` alias for anything outside the current folder. Relative
imports are for siblings only.

## Responsive strategy

The site must be correct at every width, not at five widths. Three rules
deliver that:

**1. Size fluidly, rearrange at breakpoints.** Every type and space token in
`tokens.css` is a `clamp()` that interpolates continuously between a 360px and
1440px viewport. Nothing needs a media query to _resize_. Media queries are
reserved for genuine rearrangement — a row becoming a column, a menu becoming
a disclosure.

To add a fluid token, compute it as:

```
slope   = (max - min) / (1440 - 360)          # px per px of viewport
inter   = (min - slope * 360) / 16            # rem
token   = clamp(min/16 rem, inter rem + slope*100 vw, max/16 rem)
```

Keep the `rem +` term. A pure-`vw` middle term stops responding to the user's
browser font-size setting and fails WCAG 1.4.4.

**2. Prefer intrinsic layout to breakpoints.** `grid-template-columns:
repeat(auto-fit, minmax(min(20rem, 100%), 1fr))` reflows on content width,
which is right inside any container, at any zoom level. The inner `min(…, 100%)`
is what stops it overflowing below 20rem. Reach for a media query only when
intrinsic sizing genuinely cannot express the change.

**3. Nothing may overflow horizontally.** `body { overflow-x: clip }` in
`global.css` is a backstop, not a licence. Media is capped at `max-width: 100%`
by the reset, and CMS text uses `overflow-wrap: break-word` because content
length is not under our control.

Breakpoints (`src/lib/breakpoints.ts`): sm 480 · md 768 · lg 1024 · xl 1280 ·
2xl 1536. CSS cannot read custom properties inside `@media`, so those numbers
are written literally in stylesheets — keep the two in sync.

## Styling

CSS Modules, one `Foo.module.css` beside each `Foo.tsx`. No global classes
beyond `.visually-hidden`.

Components reference **semantic** tokens only (`--color-accent`,
`--space-md`), never primitives (`--purple-600`) and never raw values. A
rebrand should be an edit to the semantic block in `tokens.css`.

Class names are always composed through `cx()` (`src/lib/cx.ts`). CSS Module
lookups are `string | undefined` under `noUncheckedIndexedAccess`, and `cx`
resolves that in one place.

Spacing belongs to the parent. `<Section>` owns block padding, `<Container>`
owns inline gutters and max-width; children set neither.

## Content and the CMS

```
Notion ──► scripts/notion/collections.ts ──► src/content/generated/*.json
                     (mapper)                          │
                                                       ▼
                                            src/content/index.ts
                                                  (read API)
                                                       │
                                                       ▼
                                              pages / components
```

The mapper is the **only** place Notion types exist. Nothing under
`src/components` or `src/pages` may import from `@notionhq/client`. That
boundary is what turns a renamed Notion column into a build error instead of a
blank section on the live site.

**Adding a collection**

1. Add the model to `src/content/schema.ts` — JSON-serialisable fields only,
   optional CMS values typed `| null` rather than optional, so consumers must
   handle an empty cell.
2. Add a `Collection` entry in `scripts/notion/collections.ts` mapping Notion
   column names to that model. Throw in the mapper for fields the page cannot
   render without; a failed build beats a broken page.
3. Add an accessor to `src/content/index.ts`.

**Two Notion behaviours worth knowing**

- Since API version 2025-09-03 a database is a container for one or more _data
  sources_, and rows are queried from the data source. `resolveDataSourceId`
  handles the common single-source case automatically.
- URLs for Notion-hosted files expire about an hour after they are issued.
  `localizeAsset` downloads them into `public/content/` at build time. Never
  write a raw Notion file URL into the site.

## Dependencies

Runtime dependencies are `react`, `react-dom`, `react-router`. Nothing else
ships to the browser. `@notionhq/client` is a devDependency because it runs
only in the build script.

Before adding a package, check whether a dozen lines would do — `cx` and
`useMediaQuery` are both there because they would have been dependencies
otherwise.
