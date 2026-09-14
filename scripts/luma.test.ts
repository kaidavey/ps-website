import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseLumaCalendar } from '../src/lib/luma.ts'
import { getUpcomingEvents } from '../src/content/events.ts'
import { isSameDay } from '../src/lib/date.ts'

const event = (extra = '') => `BEGIN:VEVENT
UID:test-1
DTSTART:20260921T230000Z
SUMMARY:Info Session\\, Fall
DESCRIPTION:Get up-to-date information at: https://luma.com/src52u79\\nLong
  folded description
ORGANIZER;CN="Kai Davey":MAILTO:calendar-invite@lu.ma
LOCATION:https://luma.com/event/evt-example
${extra}END:VEVENT`
const feed = (body: string) => `BEGIN:VCALENDAR\nVERSION:2.0\n${body}\nEND:VCALENDAR`

test('reads UTC dates, folded lines, escaped text, organizer, and event links', () => {
  const [parsed] = parseLumaCalendar(feed(event()))
  assert.equal(parsed.start, '2026-09-21T23:00:00.000Z')
  assert.equal(parsed.title, 'Info Session, Fall')
  assert.equal(parsed.host, 'Kai Davey')
  assert.equal(parsed.url, 'https://luma.com/src52u79')
  assert.equal(parsed.location, 'See Luma for location details')
  assert.ok(isSameDay(new Date(parsed.start), new Date('2026-09-21T23:00:00Z')))
  assert.equal(getUpcomingEvents([parsed], new Date('2026-09-23T12:00:00Z')).length, 0)
})
test('excludes cancelled events and rejects invalid feed responses', () => {
  assert.deepEqual(parseLumaCalendar(feed(event('STATUS:CANCELLED\n'))), [])
  assert.throws(() => parseLumaCalendar('<html>error</html>'))
})
test('ignores event links outside Luma and supports an empty calendar', () => {
  assert.deepEqual(parseLumaCalendar(feed(event().replace('https://luma.com/src52u79', 'https://example.com'))), [])
  assert.deepEqual(parseLumaCalendar(feed('')), [])
})
