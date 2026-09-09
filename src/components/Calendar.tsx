import { useState } from 'react'
import { cx } from '@/lib/cx'
import { addMonths, formatFullDate, formatMonth, isSameDay, isSameMonth, monthGrid, toDayKey } from '@/lib/date'
import styles from './Calendar.module.css'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface CalendarProps {
  /** Day keys (see toDayKey) that should show an event marker. */
  eventDays: ReadonlySet<string>
  selected: Date | null
  onSelect: (day: Date) => void
  initialMonth?: Date
}

/** Month calendar with event markers and a selectable day. */
export function Calendar({ eventDays, selected, onSelect, initialMonth = new Date() }: CalendarProps) {
  const [month, setMonth] = useState(() => addMonths(initialMonth, 0))
  const today = new Date()

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button type="button" className={styles.nav} onClick={() => setMonth(addMonths(month, -1))} aria-label="Previous month">
          <Chevron />
        </button>
        <p className="type-body" aria-live="polite">
          {formatMonth(month)}
        </p>
        <button type="button" className={styles.nav} onClick={() => setMonth(addMonths(month, 1))} aria-label="Next month">
          <Chevron className={styles.flipped} />
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.row} aria-hidden="true">
          {WEEKDAYS.map((day) => (
            <span key={day} className={cx('type-label', styles.weekday)}>
              {day}
            </span>
          ))}
        </div>
        <div className={styles.weeks}>
          {monthGrid(month).map((week) => (
            <div key={toDayKey(week[0])} className={styles.row}>
              {week.map((day) => {
                const hasEvent = eventDays.has(toDayKey(day))
                const isSelected = selected !== null && isSameDay(day, selected)
                return (
                  <button
                    key={toDayKey(day)}
                    type="button"
                    className={cx(
                      'type-label',
                      styles.day,
                      !isSameMonth(day, month) && styles.outside,
                      isSameDay(day, today) && styles.today,
                      isSelected && styles.selected,
                    )}
                    aria-pressed={isSelected}
                    aria-label={`${formatFullDate(day)}${hasEvent ? ', has events' : ''}`}
                    onClick={() => onSelect(day)}
                  >
                    {day.getDate()}
                    {hasEvent && <span className={styles.dot} />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 20" className={cx(styles.chevron, className)} aria-hidden="true" focusable="false">
      <path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
