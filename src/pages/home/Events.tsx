import { useMemo, useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { EventList } from '@/components/EventList'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { events, getUpcomingEvents } from '@/content/events'
import { home } from '@/content/home'
import { formatDay, isSameDay, toDayKey } from '@/lib/date'
import styles from './Events.module.css'

export function Events() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const upcoming = useMemo(() => getUpcomingEvents(events), [])
  const eventDays = useMemo(() => new Set(events.map((event) => toDayKey(new Date(event.start)))), [])

  const shown = selectedDay ? events.filter((event) => isSameDay(new Date(event.start), selectedDay)) : upcoming

  return (
    <Section aria-labelledby="events-title">
      <SectionHeader id="events-title" title={home.events.title} subtitle={home.events.subtitle} />
      <div className={styles.layout}>
        <Calendar
          className={styles.calendar}
          eventDays={eventDays}
          selected={selectedDay}
          onSelect={(day) => setSelectedDay((current) => (current && isSameDay(current, day) ? null : day))}
        />
        <EventList
          events={shown}
          emptyMessage={selectedDay ? `No events on ${formatDay(selectedDay)}.` : home.events.empty}
          filterLabel={selectedDay ? `Events on ${formatDay(selectedDay)}` : undefined}
          onClearFilter={() => setSelectedDay(null)}
        />
      </div>
    </Section>
  )
}
