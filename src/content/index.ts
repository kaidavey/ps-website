/**
 * The application's read API for CMS content.
 *
 * Pages and components import from here and nowhere else. The generated JSON
 * is an implementation detail, and keeping it behind these accessors means a
 * later move to a different fetch strategy (a serverless proxy, a different
 * CMS) touches this file only.
 *
 * The JSON is bundled at build time, so reads are synchronous — no loading
 * states, no spinners, no request waterfalls on any CMS-backed page.
 */
import type { TeamMember } from './schema'
import teamData from './generated/team.json'

/**
 * The generated files are plain JSON, so TypeScript infers structural types
 * that are wider than the models. Asserting once here is the single point
 * where the two are reconciled; `npm run content:fetch` is what guarantees the
 * assertion holds, because the mappers are type-checked against the models.
 */
const team = teamData as TeamMember[]

export function getTeam(): readonly TeamMember[] {
  return team
}

export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug)
}
