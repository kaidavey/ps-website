/**
 * The application's read API for CMS content.
 *
 * Pages and components import from here and nowhere else. The generated JSON
 * is an implementation detail, and keeping it behind these accessors means a
 * later move to a different fetch strategy (a serverless proxy, a different
 * CMS) touches this file only.
 *
 * The JSON is bundled at build time, so reads are synchronous — no loading
 * states, no spinners, no request waterfalls on any CMS-backed page.
 */
import type { EventItem, GalleryPhoto, Pillar } from './schema'
import eventsData from './generated/events.json'
import galleryData from './generated/gallery.json'
import pillarsData from './generated/pillars.json'

/**
 * The generated files are plain JSON, so TypeScript infers structural types
 * that are wider than the models. Asserting once here is the single point
 * where the two are reconciled; `npm run content:fetch` is what guarantees the
 * assertion holds, because the mappers are type-checked against the models.
 */
const gallery = galleryData as GalleryPhoto[]
const pillars = pillarsData as Pillar[]
const events = eventsData as EventItem[]

export function getGallery(): readonly GalleryPhoto[] {
  return gallery
}

export function getPillars(): readonly Pillar[] {
  return pillars
}

/** Events on or after `from`, soonest first. */
export function getUpcomingEvents(from: Date = new Date()): readonly EventItem[] {
  const today = toISODate(from)
  return events.filter((event) => event.date >= today).sort(byDate)
}

export function getEventsInMonth(year: number, month: number): readonly EventItem[] {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
  return events.filter((event) => event.date.startsWith(prefix)).sort(byDate)
}

function byDate(a: EventItem, b: EventItem): number {
  return a.date.localeCompare(b.date)
}

/**
 * Formats a Date as YYYY-MM-DD in the *local* timezone.
 *
 * `toISOString()` would convert to UTC first, which shifts the date by a day
 * for anyone west of Greenwich for part of every day — including Los Angeles,
 * where this site's readers are.
 */
export function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
