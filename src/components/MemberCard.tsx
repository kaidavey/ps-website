import { useState } from 'react'
import type { Member } from '@/lib/notion'
import { cx } from '@/lib/cx'
import styles from './MemberCard.module.css'

interface MemberCardProps {
  member: Member
}

/** A single roster entry: photo, name, role and internship — matches the Paper "Member Profile" design. */
export function MemberCard({ member }: MemberCardProps) {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <article className={styles.card}>
      {member.photo && !photoFailed ? (
        <img
          src={member.photo}
          alt={member.name}
          className={styles.photo}
          loading="lazy"
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <div className={styles.photoPlaceholder} aria-hidden="true" />
      )}

      <div className={styles.body}>
        <p className="type-body-strong">{member.name}</p>

        {member.role && (
          <div className={styles.row}>
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
            <span className={cx('type-body', styles.text)}>{member.role}</span>
          </div>
        )}

        {member.internship && (
          <div className={styles.row}>
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true" focusable="false">
              <rect x="2" y="7" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={cx('type-body', styles.text)}>{member.internship}</span>
          </div>
        )}
      </div>
    </article>
  )
}
