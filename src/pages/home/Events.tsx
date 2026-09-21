import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { home } from '@/content/home'
import { site } from '@/content/site'
import { formatDay, isSameDay, toDayKey } from '@/lib/date'
import { useLumaEvents } from '@/lib/useLumaEvents'
import styles from './Events.module.css'

export function Events() {
  const { events, loading, error, retry } = useLumaEvents()
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const shown = selectedDay ? events.filter((event) => isSameDay(new Date(event.start), selectedDay)) : []
  const eventDays = new Set(events.map((event) => toDayKey(new Date(event.start))))
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')

  return (
    <Section id="upcoming-events" aria-labelledby="events-title">
      <div className={styles.header}>
        <SectionHeader id="events-title" title={home.events.title} subtitle={home.events.subtitle} />
        <a className={styles.link} href={site.events.calendarUrl} target="_blank" rel="noreferrer">
          View on Luma <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Calendar eventDays={eventDays} selected={selectedDay} onSelect={(day) => setSelectedDay((current) => current && isSameDay(current, day) ? null : day)} />
          <p className={styles.note}>Event dates in {timezone}. Select a date for details below.</p>
          {loading && <p role="status" className={styles.note}>Loading calendar dates…</p>}
          {error && <p role="status" className={styles.note}>
            Calendar dates couldn’t refresh. You can still browse the Luma events.
            {' '}<button type="button" onClick={retry} className={styles.retry}>Try again</button>
          </p>}
          {selectedDay && !loading && (!error || events.length > 0) && (
            <div className={styles.selection}>
              <p role="status">{formatDay(selectedDay)} · {shown.length} {shown.length === 1 ? 'event' : 'events'}</p>
              {shown.length > 0 && <ul>
                {shown.map((event) => <li key={event.id}>
                  <a href={event.url} target="_blank" rel="noreferrer">{event.title} ↗</a>
                </li>)}
              </ul>}
              <button type="button" className={styles.retry} onClick={() => setSelectedDay(null)}>Clear date</button>
            </div>
          )}
        </div>
        <div className={styles.results}>
          <iframe
            src={site.events.embedUrl}
            title="Product Space UCLA upcoming events on Luma"
            className={styles.embed}
            allow="fullscreen; payment"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </Section>
  )
}
