import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '@/lib/cx'
import { Container } from './Container'
import styles from './Section.module.css'

/** A contained page section: a column with the standard heading-to-content gap. */
export function Section({ className, ...rest }: ComponentPropsWithoutRef<'section'>) {
  return <Container as="section" className={cx(styles.section, className)} {...rest} />
}
