import { MemberCard } from '@/components/MemberCard'
import { Section } from '@/components/Section'
import { about } from '@/content/about'
import { members } from '@/content/members.generated'
import { groupMembers } from '@/lib/members'
import type { Member } from '@/lib/notion'
import styles from './Members.module.css'

function MemberGrid({ members, variant }: { members: Member[]; variant: 'board' | 'fellow' }) {
  return (
    // Per card, not per grid: a full roster is several screens tall, so one fade would either
    // cover the whole page or (on a phone, where the grid is a single column) never fire at all.
    // Cards in the same row share a position, so a row still comes in together.
    <ul className={styles.grid}>
      {members.map((member) => (
        <li key={member.id} data-reveal>
          <MemberCard member={member} variant={variant} />
        </li>
      ))}
    </ul>
  )
}

export function Members() {
  const { board, cohorts } = groupMembers(members)

  if (board.length === 0 && cohorts.length === 0) {
    return (
      <Section aria-labelledby="members-title">
        <h2 id="members-title" className="type-heading">
          {about.members.boardTitle}
        </h2>
        <p className="type-body">{about.members.empty}</p>
      </Section>
    )
  }

  return (
    <>
      {board.length > 0 && (
        // Too tall to read as one block: the heading and the grid reveal as separate units.
        <Section aria-labelledby="board-title" data-no-reveal>
          <h2 id="board-title" className="type-heading" data-reveal>
            {about.members.boardTitle}
          </h2>
          <MemberGrid members={board} variant="board" />
        </Section>
      )}

      {cohorts.map((cohort) => {
        const headingId = `fellows-${cohort.year}`
        return (
          // As above: the cohort heading, each discipline heading and each card reveal on their own.
          <Section key={cohort.year} aria-labelledby={headingId} data-no-reveal>
            <h2 id={headingId} className="type-heading" data-reveal>
              {about.members.fellowsTitleTemplate.replace('{year}', cohort.year)}
            </h2>
            <div className={styles.groups}>
              {cohort.disciplines.map((discipline) => (
                <div key={discipline.label} className={styles.group}>
                  <h3 className="type-subtitle" data-reveal>
                    {discipline.label}
                  </h3>
                  <MemberGrid members={discipline.members} variant="fellow" />
                </div>
              ))}
            </div>
          </Section>
        )
      })}
    </>
  )
}
