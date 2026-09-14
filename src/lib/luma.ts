import ICAL from 'ical.js'
import type { SiteEvent } from '../content/events.ts'

/** Parse the public calendar feed; never turn feed text into HTML. */
export function parseLumaCalendar(source: string): SiteEvent[] {
  if (!source.trimStart().startsWith('BEGIN:VCALENDAR')) throw new Error('Invalid calendar response')
  const calendar = new ICAL.Component(ICAL.parse(source))
  for (const zone of calendar.getAllSubcomponents('vtimezone')) {
    ICAL.TimezoneService.register(new ICAL.Timezone(zone))
  }
  const events = new Map<string, SiteEvent>()
  for (const component of calendar.getAllSubcomponents('vevent')) {
    if (String(component.getFirstPropertyValue('status')).toUpperCase() === 'CANCELLED') continue
    const event = new ICAL.Event(component)
    if (!event.startDate || !event.summary || !event.uid) continue
    const start = event.startDate.toJSDate()
    if (!Number.isFinite(start.getTime())) continue
    const description = event.description || ''
    const candidates = [String(component.getFirstPropertyValue('url') || ''), ...description.matchAll(/https:\/\/(?:luma\.com|lu\.ma)\/[^\s<>]+/g)].map(String)
    const url = candidates.find((candidate) => {
      try { const parsed = new URL(candidate); return parsed.protocol === 'https:' && ['luma.com', 'lu.ma'].includes(parsed.hostname) } catch { return false }
    })
    if (!url) continue
    const location = event.location || ''
    events.set(event.uid, {
      id: event.uid,
      title: event.summary,
      start: start.toISOString(),
      allDay: event.startDate.isDate,
      host: String(component.getFirstProperty('organizer')?.getParameter('cn') || 'Product Space UCLA'),
      location: !location || /^https?:\/\//i.test(location) ? 'See Luma for location details' : location,
      url,
    })
  }
  return [...events.values()].sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
}
