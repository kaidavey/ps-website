/**
 * Calendar maths. Framework-free and pure, so it is trivially testable and
 * the component stays presentational.
 *
 * Every date here is handled as a local `YYYY-MM-DD` string rather than a
 * Date. Comparing dates as strings avoids the timezone class of bug entirely:
 * `toISOString()` converts to UTC first, which shifts the day for anyone west
 * of Greenwich — including Los Angeles, where this site's readers are.
 */

export type CalendarCell = {
  /** Local ISO date, `YYYY-MM-DD`. */
  date: string
  /** Day of the month, 1-31. */
  day: number
  /** False for the leading and trailing days of adjacent months. */
  inMonth: boolean
}

/** Days per row, Sunday first — matching the design's Su-Sa header. */
export const DAYS_IN_WEEK = 7

export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Builds the grid for a month as whole weeks, including the adjacent-month
 * days that pad the first and last rows.
 *
 * `month` is 0-indexed, matching Date. Day arithmetic goes through Date so
 * leap years and month lengths are the platform's problem, not ours.
 */
export function getMonthGrid(year: number, month: number): CalendarCell[][] {
  const leadingBlanks = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Five rows, or six when the month starts late enough to need one.
  const weekCount = Math.ceil((leadingBlanks + daysInMonth) / DAYS_IN_WEEK)

  const weeks: CalendarCell[][] = []
  for (let week = 0; week < weekCount; week += 1) {
    const row: CalendarCell[] = []
    for (let weekday = 0; weekday < DAYS_IN_WEEK; weekday += 1) {
      // Day 0 of the grid is the Sunday on or before the 1st. Date normalises
      // out-of-range day numbers, so leap years and month lengths are the
      // platform's problem rather than ours.
      const offset = week * DAYS_IN_WEEK + weekday - leadingBlanks
      const date = new Date(year, month, 1 + offset)
      row.push({
        date: toISO(date.getFullYear(), date.getMonth(), date.getDate()),
        day: date.getDate(),
        inMonth: date.getMonth() === month,
      })
    }
    weeks.push(row)
  }

  return weeks
}

/** Steps a year/month pair by whole months, rolling the year over. */
export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const shifted = new Date(year, month + delta, 1)
  return { year: shifted.getFullYear(), month: shifted.getMonth() }
}

export function formatMonth(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

/** "Monday, September 14" — used for the accessible name of a day button. */
export function formatFullDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
