# Product Space at UCLA — website

React + TypeScript + Vite. No UI framework, no CSS framework, no state library.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command                 | What it does                                           |
| ----------------------- | ------------------------------------------------------ |
| `npm run dev`           | Dev server with HMR                                    |
| `npm run build`         | Typecheck, then production build to `dist/`            |
| `npm run preview`       | Serve the production build locally                     |
| `npm run typecheck`     | `tsc --build`, no emit                                 |
| `npm run lint`          | oxlint                                                 |
| `npm run format`        | Prettier, write                                        |
| `npm run content:fetch` | Pull content from Notion into `src/content/generated/` |

## Content (Notion)

Content is fetched from Notion **at build time** and committed as JSON. The
site itself is fully static and makes no runtime API calls.

This is not a preference — the Notion API requires a secret integration token
and sends no CORS headers, so a browser cannot call it. Any client-side
integration would both fail and leak the token.

**One-time setup**

1. Create an internal integration at <https://www.notion.so/profile/integrations>
   and copy its secret.
2. `cp .env.example .env` and paste the token into `NOTION_TOKEN`.
3. For each database: open it in Notion, use ••• → **Connections** to share it
   with the integration, then copy the 32-character ID from its URL into the
   matching `NOTION_*_DATABASE_ID` variable.

The home page reads three collections — `gallery`, `pillars` and `events`.
`scripts/notion/collections.ts` lists the columns each database needs. Until
they exist the committed JSON carries the copy from the Figma design, so the
site builds and renders as designed.

**Publishing a content change**

```bash
npm run content:fetch   # writes src/content/generated/*.json
git add -A && git commit -m "content: refresh from Notion"
```

Committing the JSON means the site builds even when Notion is down, `npm run
dev` works offline, and every content change arrives as a reviewable diff.
Automate the refresh later with a scheduled CI job or a Notion webhook.

Adding a collection is three edits — see `docs/ARCHITECTURE.md`.

## Deploying

The build output in `dist/` is a static site.

**Important:** the app uses history-based routing, so the host must serve
`index.html` for unknown paths or deep links like `/about` will 404 on refresh.

- Netlify / Cloudflare Pages — add `public/_redirects` containing `/* /index.html 200`
- Vercel — add a `vercel.json` rewrite of `/(.*)` to `/index.html`
- GitHub Pages — no rewrite support; use a hash router or another host

If the Notion fetch should run in CI, set `NOTION_TOKEN` and the database IDs
as build-environment secrets and run `npm run content:fetch` before `npm run build`.
