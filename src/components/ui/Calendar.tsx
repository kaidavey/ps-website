import { useMemo, useState } from 'react'
import { cx } from '@/lib/cx'
import {
  WEEKDAY_LABELS,
  formatFullDate,
  formatMonth,
  getMonthGrid,
  shiftMonth,
} from '@/lib/calendar'
import styles from './Calendar.module.css'

type CalendarProps = {
  /** Local ISO dates (`YYYY-MM-DD`) that should show an event marker. */
  eventDates: readonly string[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  /** Today, as a local ISO date. Injected so the component stays pure. */
  today: string
  /** Month to open on, as `[year, monthIndex]`. Defaults to today's month. */
  initialMonth?: [number, number]
}

/**
 * Month calendar for the events section.
 *
 * A real `<table>` rather than a grid of divs: dates are tabular data, and the
 * table roles are what let a screen reader announce "row 3, column Tuesday"
 * while navigating. Days with events are buttons; the rest are plain text, so
 * keyboard users tab only through dates that actually do something.
 */
export function Calendar({
  eventDates,
  selectedDate,
  onSelectDate,
  today,
  initialMonth,
}: CalendarProps) {
  const [[year, month], setMonth] = useState<[number, number]>(
    () => initialMonth ?? [Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1],
  )

  const weeks = useMemo(() => getMonthGrid(year, month), [year, month])
  const eventSet = useMemo(() => new Set(eventDates), [eventDates])
  const monthLabel = formatMonth(year, month)

  const step = (delta: number) => {
    const next = shiftMonth(year, month, delta)
    setMonth([next.year, next.month])
  }

  return (
    <div className={cx(styles.calendar)}>
      <div className={cx(styles.header)}>
        <button
          type="button"
          className={cx(styles.navButton)}
          onClick={() => step(-1)}
          aria-label={`Previous month, ${formatMonth(...monthTuple(shiftMonth(year, month, -1)))}`}
        >
          <Chevron direction="left" />
        </button>

        {/* aria-live so month changes are announced; the heading itself is
            the table's caption below, which keeps the outline clean. */}
        <span className={cx(styles.month)} aria-live="polite">
          {monthLabel}
        </span>

        <button
          type="button"
          className={cx(styles.navButton)}
          onClick={() => step(1)}
          aria-label={`Next month, ${formatMonth(...monthTuple(shiftMonth(year, month, 1)))}`}
        >
          <Chevron direction="right" />
        </button>
      </div>

      <table className={cx(styles.grid)}>
        <caption className="visually-hidden">Events in {monthLabel}</caption>
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((label) => (
              <th key={label} scope="col" className={cx(styles.weekday)}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]?.date}>
              {week.map((cell) => {
                const hasEvent = eventSet.has(cell.date)
                const className = cx(
                  styles.day,
                  !cell.inMonth && styles.outside,
                  cell.date === today && styles.today,
                  cell.date === selectedDate && styles.selected,
                )

                return (
                  <td key={cell.date} className={cx(styles.cell)}>
                    {hasEvent ? (
                      <button
                        type="button"
                        className={className}
                        onClick={() => onSelectDate(cell.date)}
                        aria-pressed={cell.date === selectedDate}
                        aria-label={`${formatFullDate(cell.date)} — has events`}
                      >
                        {cell.day}
                        <span className={cx(styles.dot)} aria-hidden="true" />
                      </button>
                    ) : (
                      <span className={className}>{cell.day}</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Narrows the {year, month} record back to the tuple formatMonth takes. */
function monthTuple({ year, month }: { year: number; month: number }): [number, number] {
  return [year, month]
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={direction === 'right' ? { rotate: '180deg' } : undefined}
    >
      <path d="M15 5 8 12l7 7" />
    </svg>
  )
}
