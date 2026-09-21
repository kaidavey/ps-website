import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './SectionHeader.module.css'

/** `id` lands on the heading itself, so `aria-labelledby` points at the text, not the wrapper. */
type SectionHeaderProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  title: string
  subtitle?: string
}

/** Section heading with an optional muted subtitle. */
export function SectionHeader({ id, title, subtitle, className, ...rest }: SectionHeaderProps) {
  return (
    <div className={cx(styles.header, className)} {...rest}>
      <h2 id={id} className="type-heading">
        {title}
      </h2>
      {subtitle && <p className={cx('type-subtitle', styles.subtitle)}>{subtitle}</p>}
    </div>
  )
}
