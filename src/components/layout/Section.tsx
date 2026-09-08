import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cx } from '@/lib/cx'
import styles from './Section.module.css'

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  as?: ElementType
  /** Vertical rhythm. Sections own their block padding; children never do. */
  space?: 'none' | 'sm' | 'md' | 'lg'
  tone?: 'default' | 'surface'
}

const spaceClass = {
  none: styles.spaceNone,
  sm: styles.spaceSm,
  md: styles.spaceMd,
  lg: styles.spaceLg,
} as const

const toneClass = {
  default: styles.toneDefault,
  surface: styles.toneSurface,
} as const

/**
 * Vertical layout primitive: a full-bleed band of the page that owns its own
 * block spacing and background. Pair with <Container> for the inner width.
 */
export function Section({
  as: Tag = 'section',
  space = 'md',
  tone = 'default',
  className,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cx(styles.section, spaceClass[space], toneClass[tone], className)}
      {...props}
    />
  )
}
