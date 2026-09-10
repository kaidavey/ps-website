import { useState, type ReactNode } from 'react'
import type { Member } from '@/lib/notion'
import { cx } from '@/lib/cx'
import styles from './MemberCard.module.css'

/** Lucide geometry on its native 24-unit grid, whose built-in margin keeps the 2-unit stroke from clipping. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

interface MemberCardProps {
  member: Member
  /** Board cards show role and internship; fellow cards show major. Two variants in the Paper design. */
  variant: 'board' | 'fellow'
}

/** A single roster entry: photo, name, and the rows for its variant — matches the Paper "Member Profile" design. */
export function MemberCard({ member, variant }: MemberCardProps) {
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

        {variant === 'board' && member.role && (
          <div className={cx('type-body', styles.row)}>
            <Icon>
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </Icon>
            <span className={styles.text}>{member.role}</span>
          </div>
        )}

        {variant === 'board' && member.internship && (
          <div className={cx('type-body', styles.row)}>
            <Icon>
              <path d="M12 12h.01" />
              <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <path d="M22 13a18.15 18.15 0 0 1-20 0" />
              <rect width="20" height="14" x="2" y="6" rx="2" />
            </Icon>
            <span className={styles.text}>{member.internship}</span>
          </div>
        )}

        {variant === 'fellow' && member.major && (
          <div className={cx('type-body', styles.row)}>
            <Icon>
              <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            </Icon>
            <span className={styles.text}>{member.major}</span>
          </div>
        )}
      </div>
    </article>
  )
}
