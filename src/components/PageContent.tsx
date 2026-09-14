import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './PageContent.module.css'

interface PageContentProps {
  /** Reserve room for the floating header when the page has no hero of its own. */
  offsetHeader?: boolean
  children: ReactNode
}

/** Vertical stack of page sections with the site's section rhythm. */
export function PageContent({ offsetHeader, children }: PageContentProps) {
  return <div className={cx(styles.content, offsetHeader && styles.offset)}>{children}</div>
}
