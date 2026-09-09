import type { SiteEvent } from '@/content/events'
import { cx } from '@/lib/cx'
import { formatDay, formatTime, formatWeekday, toDayKey } from '@/lib/date'
import styles from './EventList.module.css'

interface EventListProps {
  events: readonly SiteEvent[]
  emptyMessage: string
  /** When set, a caption with a control to clear the active day filter is shown. */
  filterLabel?: string
  onClearFilter?: () => void
}

/** Events grouped by day, in the style of a Luma calendar feed. */
export function EventList({ events, emptyMessage, filterLabel, onClearFilter }: EventListProps) {
  const days = groupByDay(events)

  return (
    <div className={styles.panel}>
      {filterLabel && (
        <p className={cx('type-label', styles.filter)}>
          {filterLabel}
          <button type="button" className={styles.clear} onClick={onClearFilter}>
            Show all
          </button>
        </p>
      )}

      {days.length === 0 ? (
        <p className={cx('type-body', styles.empty)}>{emptyMessage}</p>
      ) : (
        <ol className={styles.days}>
          {days.map(([date, dayEvents]) => (
            <li key={toDayKey(date)} className={styles.day}>
              <div className={styles.date}>
                <span className="type-body-strong">{formatDay(date)}</span>
                <span className={cx('type-body', styles.muted)}>{formatWeekday(date)}</span>
              </div>
              <ul className={styles.cards}>
                {dayEvents.map((event) => (
                  <li key={event.id}>
                    <a href={event.url} target="_blank" rel="noreferrer" className={styles.card}>
                      <div className={styles.details}>
                        <p className={cx('type-label', styles.muted)}>{formatTime(new Date(event.start))}</p>
                        <h3 className="type-body-strong">{event.title}</h3>
                        <p className={cx('type-body', styles.muted)}>By {event.host}</p>
                        <p className={cx('type-body', styles.muted)}>{event.location}</p>
                      </div>
                      {event.image && <img src={event.image} alt="" className={styles.thumb} loading="lazy" />}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function groupByDay(events: readonly SiteEvent[]): Array<[Date, SiteEvent[]]> {
  const groups = new Map<string, [Date, SiteEvent[]]>()
  for (const event of events) {
    const start = new Date(event.start)
    const key = toDayKey(start)
    const group = groups.get(key)
    if (group) group[1].push(event)
    else groups.set(key, [start, [event]])
  }
  return [...groups.values()]
}
