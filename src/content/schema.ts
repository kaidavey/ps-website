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
 *   - Every record carries `id` for stable React keys.
 *   - Images are site-relative paths or absolute URLs — the same shape
 *     `localizeAsset` produces when it downloads a Notion-hosted file.
 */

/** Fields present on every record mapped from a Notion page. */
export type ContentRecord = {
  id: string
  /** URL-safe identifier derived from the record's title. */
  slug: string
}

export type Image = {
  src: string
  /** Empty string marks the image as decorative. */
  alt: string
  /** Intrinsic pixel size — required, so the browser can reserve space and
      the page never shifts as images load. */
  width: number
  height: number
}

/** A photo in the home page carousel. */
export type GalleryPhoto = ContentRecord & {
  image: Image
}

/** One of the three "How It Works" pillars. */
export type Pillar = ContentRecord & {
  title: string
  description: string
  image: Image
}

/** An event shown on the home page calendar and event list. */
export type EventItem = ContentRecord & {
  title: string
  /** ISO-8601 date (YYYY-MM-DD). Local to the event, not UTC. */
  date: string
  /** Free text, e.g. "6:00 PM" — Notion date times are unreliable across
      timezones, so the display string is authored rather than derived. */
  time: string | null
  location: string | null
  url: string | null
}
