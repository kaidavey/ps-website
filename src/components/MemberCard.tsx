import type { Member } from '@/lib/notion'
import { cx } from '@/lib/cx'
import styles from './MemberCard.module.css'

interface MemberCardProps {
  member: Member
}

/** A single roster entry: photo, name, role and an optional bio and LinkedIn link. */
export function MemberCard({ member }: MemberCardProps) {
  return (
    <article className={styles.card}>
      {member.photo ? (
        <img src={member.photo} alt={member.name} className={styles.photo} loading="lazy" />
      ) : (
        <div className={styles.photoPlaceholder} aria-hidden="true" />
      )}

      <div className={styles.body}>
        <h3 className={cx('type-heading', styles.name)}>{member.name}</h3>

        {member.role && (
          <div className={styles.role}>
            <svg viewBox="0 0 16 18" className={styles.icon} aria-hidden="true" focusable="false">
              <path
                d="M13 5a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM16 18a8 8 0 0 0-16 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="type-subtitle">{member.role}</span>
          </div>
        )}

        {member.bio && <p className={cx('type-body', styles.bio)}>{member.bio}</p>}

        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noreferrer" className={cx('type-body-strong', styles.linkedin)}>
            LinkedIn ↗
          </a>
        )}
      </div>
    </article>
  )
}
