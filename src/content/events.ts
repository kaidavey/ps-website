export interface SiteEvent {
  id: string
  title: string
  /** ISO 8601 start time, with offset. */
  start: string
  host: string
  location: string
  url: string
  /** Square artwork, if any. */
  image?: string
}

/**
 * Upcoming events. This is the integration point for a Luma feed: swap the static list for a
 * fetch of the calendar's events mapped onto SiteEvent, and the calendar + list update on their own.
 */
export const events: SiteEvent[] = [
  {
    id: 'fall-info-session',
    title: 'Fall Info Session',
    start: '2026-09-15T18:00:00-07:00',
    host: 'Product Space at UCLA',
    location: 'Boelter Hall 3400',
    url: 'https://lu.ma/',
  },
  {
    id: 'pm-panel',
    title: 'Breaking into Product: PM Panel',
    start: '2026-09-18T19:00:00-07:00',
    host: 'Product Space at UCLA',
    location: 'Anderson School of Management',
    url: 'https://lu.ma/',
  },
  {
    id: 'open-house',
    title: 'Open House & Mixer',
    start: '2026-09-22T17:30:00-07:00',
    host: 'Product Space at UCLA',
    location: 'Kerckhoff Grand Salon',
    url: 'https://lu.ma/',
  },
]

/** Events starting today or later, soonest first. */
export function getUpcomingEvents(all: readonly SiteEvent[], now = new Date()): SiteEvent[] {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return all
    .filter((event) => new Date(event.start).getTime() >= startOfToday)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}
