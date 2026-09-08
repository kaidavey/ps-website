import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { cx } from '@/lib/cx'
import styles from './SiteLayout.module.css'

/**
 * The chrome every page shares.
 *
 * <ScrollRestoration> resets scroll on navigation and restores it on back —
 * a single-page app does neither by default, and its absence is one of the
 * most noticeable ways an SPA feels broken.
 */
export function SiteLayout() {
  return (
    <div className={cx(styles.shell)}>
      <a href="#main" className={cx(styles.skipLink)}>
        Skip to content
      </a>
      <Header />
      <main id="main" className={cx(styles.main)}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
