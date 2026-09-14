export interface SiteEvent {
  id: string
  title: string
  /** ISO 8601 start time, with offset. */
  start: string
  allDay?: boolean
  host: string
  location: string
  url: string
  /** Square artwork, if any. */
  image?: string
}

/** Events starting today or later, soonest first. */
export function getUpcomingEvents(all: readonly SiteEvent[], now = new Date()): SiteEvent[] {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return all
    .filter((event) => new Date(event.start).getTime() >= startOfToday)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}
