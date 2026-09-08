# Architecture

The conventions here exist so the codebase stays predictable as pages are
added. They are short on purpose. Follow them; propose a change if one stops
making sense.

## Layout

```
src/
  components/
    layout/     Page chrome: Container, Section, Header, Footer, SiteLayout
    sections/   One component per band of a page (Hero, Pillars, Events, ...)
    ui/         Reusable pieces: Button, Calendar, SectionHeading
  config/       Site-wide constants (navigation, metadata)
  content/      CMS read API + generated JSON + content models
  lib/          Framework-free utilities (cx, calendar maths, breakpoints)
  pages/        One component per route, composed from sections/
  routes/       The route table
  styles/       tokens.css, reset.css, global.css
scripts/        Build-time tooling (the Notion fetch). Node only, never bundled.
public/img/     Photographic assets referenced by the content JSON
```

A page component composes sections and nothing else; a section owns its own
layout and pulls its own content. That keeps pages readable and means a
section can move between pages without carrying layout assumptions with it.

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

Each ramp's **maximum is the literal Figma value**, so the desktop rendering
matches the design; the minimum is the small-screen value. To add a token:

```
slope   = (max - min) / (1440 - 360)          # px per px of viewport
inter   = (min - slope * 360) / 16            # rem
token   = clamp(min/16 rem, inter rem + slope*100 vw, max/16 rem)
```

Two rules that are easy to break and expensive to debug:

- **Keep the `rem +` term.** A pure-`vw` middle term stops responding to the
  user's browser font-size setting and fails WCAG 1.4.4.
- **Never set `font-size` on `:root`.** Every clamp above is calibrated
  against a 16px root, and `rem` is defined by the root font size — so setting
  one rescales the entire token system at once. Body text size goes on `body`.

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

## Fonts

The design specifies Helvetica Neue. No web font is loaded: it is present on
macOS and iOS, and on Windows and Android the stack falls back to Helvetica
and Arial, which are metrically close enough that the fluid scale still holds.
A render-blocking font request for that difference is not a good trade on a
page whose largest element is a wordmark.

If cross-platform consistency later matters more, self-host one weight pair
from `public/` and add it ahead of Helvetica in `--font-sans`; do not add a
Google Fonts `<link>`, which costs a third-party connection on first paint.

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

The home page reads three collections — `gallery`, `pillars` and `events`.
None of the Notion databases exists yet, so the committed JSON carries the
copy from the design and the site builds and renders today. Once the databases
are created, `npm run content:fetch` overwrites it.

**Adding a collection**

1. Add the model to `src/content/schema.ts` — JSON-serialisable fields only,
   optional CMS values typed `| null` rather than optional, so consumers must
   handle an empty cell.
2. Add a `Collection` entry in `scripts/notion/collections.ts` mapping Notion
   column names to that model. Throw in the mapper for fields the page cannot
   render without; a failed build beats a broken page.
3. Add an accessor to `src/content/index.ts`.

**Dates**

Event dates are handled as local `YYYY-MM-DD` strings, never `Date` objects,
and compared as strings. `toISOString()` converts to UTC first, which shifts
the date by a day for anyone west of Greenwich — including Los Angeles, for
part of every day. `toISODate()` in `src/content/index.ts` is the only
conversion from `Date`.

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

Before adding a package, check whether the platform already does it. The menu
is a native `<dialog>` opened with `showModal()`, which supplies focus
trapping, Escape-to-close, background inertness and top-layer stacking — the
things a modal library would be brought in for. The carousel is `overflow-x`
plus `scroll-snap`. `cx` and the calendar maths are a few dozen lines each
because they would otherwise have been dependencies.
