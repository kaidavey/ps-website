import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './Container.module.css'

type ContainerTag = 'div' | 'section' | 'header' | 'footer' | 'nav'

type ContainerProps<T extends ContainerTag> = { as?: T } & ComponentPropsWithoutRef<T>

/** Centers content at the site's max width and applies the page gutters. */
export function Container<T extends ContainerTag = 'div'>({ as, className, ...rest }: ContainerProps<T>) {
  const Tag = (as ?? 'div') as ContainerTag
  return <Tag className={cx(styles.container, className)} {...(rest as ComponentPropsWithoutRef<ContainerTag>)} />
}
