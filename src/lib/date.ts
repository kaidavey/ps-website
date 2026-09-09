const LOCALE = 'en-US'

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

/** Local-time key like "2026-09-06", stable across time zones for grouping and lookups. */
export function toDayKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

/**
 * Every day on a month grid, in whole weeks from Sunday to Saturday,
 * including the leading and trailing days of the neighbouring months.
 */
export function monthGrid(month: Date): Date[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  const end = new Date(last)
  end.setDate(last.getDate() + (6 - last.getDay()))

  const weeks: Date[][] = []
  for (const day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    if (day.getDay() === 0) weeks.push([])
    weeks[weeks.length - 1].push(new Date(day))
  }
  return weeks
}

export const formatMonth = (d: Date) => d.toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' })
export const formatDay = (d: Date) => d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' })
export const formatWeekday = (d: Date) => d.toLocaleDateString(LOCALE, { weekday: 'long' })
export const formatFullDate = (d: Date) =>
  d.toLocaleDateString(LOCALE, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
export const formatTime = (d: Date) => d.toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit' })
