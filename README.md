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
  styles/      tokens.css (every design constant), typography.css (type roles), base.css (reset)
  components/  Shared building blocks: Container, Button, Header, Footer, Calendar, EventList, form fields
  content/     All copy, links, and image references, typed per page
  pages/       One folder per route; each section is its own component + CSS module
  lib/         Small helpers (class names, dates, page title)
  assets/      Optimised images and the self-hosted Inter fallback font
```

## Changing the design

- **Typography.** Every text element uses one `type-*` class from `styles/typography.css`. The size,
  weight, leading, and tracking for each role are tokens in `styles/tokens.css`; edit them there and the
  change applies site-wide. Sizes are fluid `clamp()` values that scale between phone and desktop.
- **Fonts.** The stack is Helvetica Neue (Apple platforms) with a self-hosted Inter fallback. To use a
  licensed Helvetica Neue webfont, add an `@font-face` in `base.css` and update `--font-sans`.
- **Layout.** Content is centred at `--container-max` (1400px) with fluid gutters; margins grow beyond that.
- **Copy and links.** Edit the files in `src/content/`. Form endpoints and the application link live in
  `content/site.ts`; events for the calendar live in `content/events.ts`.
