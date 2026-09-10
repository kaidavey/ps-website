import { MemberCard } from '@/components/MemberCard'
import { Section } from '@/components/Section'
import { about } from '@/content/about'
import { members } from '@/content/members.generated'
import { groupMembers } from '@/lib/members'
import type { Member } from '@/lib/notion'
import styles from './Members.module.css'

function MemberGrid({ members, variant }: { members: Member[]; variant: 'board' | 'fellow' }) {
  return (
    <ul className={styles.grid}>
      {members.map((member) => (
        <li key={member.id}>
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
        <Section aria-labelledby="board-title">
          <h2 id="board-title" className="type-heading">
            {about.members.boardTitle}
          </h2>
          <MemberGrid members={board} variant="board" />
        </Section>
      )}

      {cohorts.map((cohort) => {
        const headingId = `fellows-${cohort.year}`
        return (
          <Section key={cohort.year} aria-labelledby={headingId}>
            <h2 id={headingId} className="type-heading">
              {about.members.fellowsTitleTemplate.replace('{year}', cohort.year)}
            </h2>
            <div className={styles.groups}>
              {cohort.disciplines.map((discipline) => (
                <div key={discipline.label} className={styles.group}>
                  <h3 className="type-subtitle">{discipline.label}</h3>
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
