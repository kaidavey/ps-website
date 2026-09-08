import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
  title: string
  subtitle?: ReactNode
  /** Heading level. Set it to keep the document outline correct. */
  as?: 'h2' | 'h3'
  id?: string
  className?: string | undefined
}

/**
 * The title + subtitle pair that opens most sections of the page.
 *
 * Exists so the three sections using it cannot drift apart, and so the
 * heading level stays a decision the caller makes explicitly rather than one
 * baked into a style.
 */
export function SectionHeading({
  title,
  subtitle,
  as: Tag = 'h2',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cx(styles.heading, className)}>
      <Tag id={id} className={cx(styles.title)}>
        {title}
      </Tag>
      {subtitle !== undefined && <p className={cx(styles.subtitle)}>{subtitle}</p>}
    </div>
  )
}
