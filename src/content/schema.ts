/**
 * Content models — the shapes the UI is allowed to see.
 *
 * These are deliberately plain and Notion-free. Nothing in src/components or
 * src/pages should ever import a Notion type; the mapper in
 * scripts/notion/collections.ts is the only place the two worlds meet. That
 * boundary is what makes a Notion column rename a build error rather than a
 * blank section on the live site.
 *
 * Rules for anything added here:
 *   - Fields are JSON-serialisable only (no Date, Map, undefined).
 *   - Optional CMS fields are typed `| null`, never optional, so consumers
 *     are forced to handle an empty cell.
 *   - Every record carries `id` (the Notion page ID) for stable React keys.
 */

/** Fields present on every record mapped from a Notion page. */
export type ContentRecord = {
  id: string
  /** URL-safe identifier derived from the record's title. */
  slug: string
}

/**
 * EXAMPLE MODEL — replace with the real databases once they exist in Notion.
 * Kept as the reference implementation for how a collection is shaped.
 */
export type TeamMember = ContentRecord & {
  name: string
  role: string
  bio: string
  /** Site-relative path after build-time download, or an external URL. */
  photo: string | null
  linkedIn: string | null
  order: number | null
}
