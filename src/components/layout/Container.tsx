import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cx } from '@/lib/cx'
import styles from './Container.module.css'

export type ContainerSize = 'narrow' | 'content' | 'wide' | 'full'

type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  /** Element to render. Use `main`, `header`, `nav` etc. to keep markup semantic. */
  as?: ElementType
  size?: ContainerSize
  /** Removes the horizontal gutter, for edge-to-edge children. */
  flush?: boolean
}

/**
 * Horizontal layout primitive: centres content, caps its width, and applies
 * the fluid page gutter. Every full-width section should wrap its content in
 * one of these rather than setting max-width itself.
 */
export function Container({
  as: Tag = 'div',
  size = 'content',
  flush = false,
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cx(styles.container, styles[size], flush && styles.flush, className)}
      {...props}
    />
  )
}
