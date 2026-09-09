import { MemberCard } from '@/components/MemberCard'
import { Section } from '@/components/Section'
import { students } from '@/content/students'
import { members } from '@/content/members.generated'
import styles from './Members.module.css'

export function Members() {
  return (
    <Section aria-labelledby="members-title">
      <h2 id="members-title" className="type-heading">
        {students.members.title}
      </h2>

      {members.length > 0 ? (
        <ul className={styles.grid}>
          {members.map((member) => (
            <li key={member.id}>
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="type-body">{students.members.empty}</p>
      )}
    </Section>
  )
}
