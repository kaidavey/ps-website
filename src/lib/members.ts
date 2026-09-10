import type { Member } from './notion'

/**
 * Owns the Notion `Year` naming convention, which encodes both cohort and discipline:
 * "Our Board" for the board, "Fellow <year> (<discipline>)" for everyone else.
 * Renaming the CMS options should only ever require editing this file.
 */
const BOARD_YEAR = 'Our Board'
const FELLOW_PATTERN = /^Fellow\s+(.+?)\s*\(([^)]+)\)\s*$/

const DISCIPLINE_LABELS: Record<string, string> = {
  Design: 'Product Design',
  PM: 'Product Management',
  PMM: 'Product Marketing Management',
}

/** Display order from the Paper design; anything unrecognised sorts after these, alphabetically. */
const DISCIPLINE_ORDER = ['Product Design', 'Product Management', 'Product Marketing Management']

export interface DisciplineGroup {
  label: string
  members: Member[]
}

export interface Cohort {
  year: string
  disciplines: DisciplineGroup[]
}

export interface Roster {
  board: Member[]
  cohorts: Cohort[]
}

/** Manual `Order` first (ascending), unset last, then alphabetically by name. */
function byOrderThenName(a: Member, b: Member): number {
  if (a.order !== b.order) {
    if (a.order === null) return 1
    if (b.order === null) return -1
    return a.order - b.order
  }
  return a.name.localeCompare(b.name)
}

/** Leading 4-digit year, used to sort cohorts newest-first. */
function cohortStartYear(year: string): number {
  const match = year.match(/\d{4}/)
  return match ? Number(match[0]) : 0
}

function disciplineRank(label: string): number {
  const index = DISCIPLINE_ORDER.indexOf(label)
  return index === -1 ? DISCIPLINE_ORDER.length : index
}

/** True for any `Year` value this module knows how to place on the page. */
export function isKnownYear(year: string): boolean {
  return year === BOARD_YEAR || FELLOW_PATTERN.test(year)
}

/** Splits the flat roster into the board plus fellow cohorts, each subdivided by discipline. */
export function groupMembers(members: Member[]): Roster {
  const board = members.filter((member) => member.year === BOARD_YEAR).sort(byOrderThenName)

  const byCohort = new Map<string, Map<string, Member[]>>()
  for (const member of members) {
    const match = member.year.match(FELLOW_PATTERN)
    if (!match) continue

    const [, year, code] = match
    const label = DISCIPLINE_LABELS[code] ?? code

    let disciplines = byCohort.get(year)
    if (!disciplines) {
      disciplines = new Map()
      byCohort.set(year, disciplines)
    }
    disciplines.set(label, [...(disciplines.get(label) ?? []), member])
  }

  const cohorts = [...byCohort.entries()]
    .sort(([a], [b]) => cohortStartYear(b) - cohortStartYear(a) || b.localeCompare(a))
    .map(([year, disciplines]) => ({
      year,
      disciplines: [...disciplines.entries()]
        .sort(([a], [b]) => disciplineRank(a) - disciplineRank(b) || a.localeCompare(b))
        .map(([label, disciplineMembers]) => ({ label, members: [...disciplineMembers].sort(byOrderThenName) })),
    }))

  return { board, cohorts }
}
