# Working in this repository

Read `docs/ARCHITECTURE.md` before making changes. The short version:

- **Stack:** React 19 + TypeScript + Vite. CSS Modules. react-router. Nothing else
  ships to the browser — check whether a small utility would do before adding a
  dependency.
- **Responsive:** size fluidly with the `clamp()` tokens in
  `src/styles/tokens.css`; use media queries only to _rearrange_ layout, not to
  resize. Prefer intrinsic CSS grid (`auto-fit` + `minmax`) over breakpoints.
  Nothing may overflow horizontally at any width.
- **Styling:** components use semantic tokens (`--color-accent`, `--space-md`),
  never primitives or raw values. Compose class names with `cx()`.
- **Spacing:** `<Section>` owns block padding, `<Container>` owns inline
  gutters and max-width. Children set neither.
- **Content:** Notion types live only in `scripts/notion/`. Pages read content
  through `src/content/index.ts`.
- **Before committing:** `npm run typecheck && npm run lint && npm run build`.
