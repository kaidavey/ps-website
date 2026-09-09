# Product Space at UCLA

Marketing site for Product Space at UCLA. React 19, TypeScript, Vite, and plain CSS Modules; no UI or styling libraries.

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server                |
| `npm run build`     | Production build to `dist/`         |
| `npm run preview`   | Serve the production build locally  |
| `npm run typecheck` | Type-check without emitting         |
| `npm run lint`      | Lint with oxlint                    |

## How the code is organised

```
src/
  styles/      type-scale.css (all font sizes), layout-scale.css (text-block widths and
               image sizes), tokens.css (colour, spacing, layout),
               typography.css (wires the roles to classes), base.css (reset)
  components/  Shared building blocks: Container, Button, Header, Footer, Calendar, EventList, form fields
  content/     All copy, links, and image references, typed per page
  pages/       One folder per route; each section is its own component + CSS module
  lib/         Small helpers (class names, dates, page title)
  assets/      Optimised images and the self-hosted Inter fallback font
```

## Changing the design

- **Typography.** `styles/type-scale.css` is the single file to edit for text. It defines nine roles
  (display, title, lead, heading, subtitle, body, body-strong, label, stat), each with a size, line
  height, weight, and letter spacing, plus the step-downs the four largest roles take on narrow
  screens. Every text element on the site carries exactly one matching `type-*` class, so changing a
  value there applies everywhere that role appears. Sizes are fixed rather than fluid: text reads the
  same on a phone and a large monitor, and only the layout reflows.
- **Fonts.** The stack is Helvetica Neue (Apple platforms) with a self-hosted Inter fallback. To use a
  licensed Helvetica Neue webfont, add an `@font-face` in `base.css` and update `--font-sans`.
- **Line wrapping.** `base.css` sets `text-wrap: pretty` on `body`, so every block inherits it and no
  lone word is stranded on a last line. Short, display-like roles (display, title, lead, heading,
  subtitle, stat) opt up to `text-wrap: balance` in `typography.css`, which evens out every line
  rather than only fixing the last. A few short body blocks balance too, marked in their own CSS.
  Note that `pretty` must be set on an inherited property rather than on `p`, or an element selector
  would beat a `type-*` class sitting on a wrapper and stop it reaching its children.
- **Block widths and image sizes.** `styles/layout-scale.css` holds the values you tune by eye: the
  width of each bio paragraph, the height of the photos in the scrolling strip, and the width of the
  hero photo. Column widths are in `em`, so they stay in proportion when the lead size changes.
- **Layout.** Content is centred at `--container-max` (1120px) with fluid gutters, so margins grow
  beyond that width rather than the content. Two elements opt out and span the full page by setting
  `--container-outer: 100%` on themselves: the home page hero, and the header that sits over it.
- **Header.** Fixed to the top. It slides out of view as the reader scrolls down and returns on the
  first upward scroll (`lib/useHeaderVisibility.ts`), staying transparent over the hero and taking a
  translucent surface once scrolled.
- **Copy and links.** Edit the files in `src/content/`. Form endpoints and the application link live in
  `content/site.ts`; events for the calendar live in `content/events.ts`.

## Scroll behaviour on the home page

The bio section is a pinned panel. Its outer element is a scroll track a viewport tall plus
`--reveal-distance` (set in `pages/home/Intro.module.css`); inside it a sticky panel one viewport
tall holds the copy and the photo marquee. `lib/useScrollProgress.ts` measures how far the track has
been scrolled and writes `--progress` (0 → 1) onto it, without re-rendering React. `RevealText`
gives each word its position in the passage, and the CSS compares that to `--progress` so words
darken in sequence. Lengthen or shorten the pinned stretch with `--reveal-distance`; change how many
words fade at once with `--reveal-window` in `components/RevealText.module.css`.

Both the reveal and the marquee stop under `prefers-reduced-motion`, and the copy renders at full
contrast when scripting is unavailable.
