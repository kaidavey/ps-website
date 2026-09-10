import { MemberCard } from '@/components/MemberCard'
import { Section } from '@/components/Section'
import { about } from '@/content/about'
import { members } from '@/content/members.generated'
import styles from './Members.module.css'

export function Members() {
  return (
    <Section aria-labelledby="members-title">
      <h2 id="members-title" className="type-heading">
        {about.members.title}
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
        <p className="type-body">{about.members.empty}</p>
      )}
    </Section>
  )
}
