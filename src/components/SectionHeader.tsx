import { cx } from '@/lib/cx'
import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  id?: string
  title: string
  subtitle?: string
  className?: string
}

/** Section heading with an optional muted subtitle. */
export function SectionHeader({ id, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cx(styles.header, className)}>
      <h2 id={id} className="type-heading">
        {title}
      </h2>
      {subtitle && <p className={cx('type-subtitle', styles.subtitle)}>{subtitle}</p>}
    </div>
  )
}
