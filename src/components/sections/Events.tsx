import { useMemo, useState } from 'react'
import { Calendar } from '@/components/ui/Calendar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getUpcomingEvents, toISODate } from '@/content'
import { formatFullDate } from '@/lib/calendar'
import { cx } from '@/lib/cx'
import styles from './Events.module.css'

/**
 * "Upcoming Events" — calendar plus the list of what is on.
 *
 * In the design the right-hand panel is a screenshot labelled "Luma API
 * Placeholder". It is rendered here from the events collection instead, so
 * the panel is real content today and swapping in a Luma feed later means
 * changing where `getUpcomingEvents` reads from, not this component.
 */
export function Events() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Recomputed once per mount rather than per render: "today" must not change
  // mid-session, and a new Date() in the render body would break memoisation.
  const today = useMemo(() => toISODate(new Date()), [])
  const upcoming = useMemo(() => getUpcomingEvents(new Date()), [])
  const eventDates = useMemo(() => upcoming.map((event) => event.date), [upcoming])

  const visible = selectedDate
    ? upcoming.filter((event) => event.date === selectedDate)
    : upcoming

  const initialMonth = useMemo((): [number, number] | undefined => {
    // Open on the month of the next event, so the calendar is never empty.
    const next = upcoming[0]?.date
    return next ? [Number(next.slice(0, 4)), Number(next.slice(5, 7)) - 1] : undefined
  }, [upcoming])

  return (
    <section className={cx(styles.section)} aria-labelledby="events-title">
      <SectionHeading
        id="events-title"
        title="Upcoming Events"
        subtitle="Curious to learn more? Join us for our external events."
      />

      <div className={cx(styles.layout)}>
        <Calendar
          eventDates={eventDates}
          selectedDate={selectedDate}
          onSelectDate={(date) =>
            setSelectedDate((current) => (current === date ? null : date))
          }
          today={today}
          {...(initialMonth ? { initialMonth } : {})}
        />

        <div className={cx(styles.panel)}>
          <h3 className={cx(styles.panelTitle)}>
            {selectedDate ? formatFullDate(selectedDate) : 'Next up'}
          </h3>

          {visible.length === 0 ? (
            <p className={cx(styles.empty)}>Nothing scheduled yet — check back soon.</p>
          ) : (
            <ul role="list" className={cx(styles.list)}>
              {visible.map((event) => (
                <li key={event.id} className={cx(styles.event)}>
                  <p className={cx(styles.eventTitle)}>{event.title}</p>
                  <p className={cx(styles.eventMeta)}>
                    {[formatFullDate(event.date), event.time, event.location]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  {event.url && (
                    <a
                      className={cx(styles.eventLink)}
                      href={event.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Register
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
