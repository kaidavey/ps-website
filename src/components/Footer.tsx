import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/content/site'
import { cx } from '@/lib/cx'
import { Container } from './Container'
import { Logo } from './Logo'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.brandText}>
            <p className={cx('type-heading', styles.brandName)}>{site.name.toLowerCase()}</p>
            <p className="type-body">{site.org}</p>
          </div>
          <p className={cx('type-body', styles.updated)}>Last updated {formatBuildDate(__BUILD_DATE__)}</p>
        </div>

        <div className={styles.columns}>
          <FooterColumn title="Navigation">
            {site.nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterColumn>
          <FooterColumn title="Connect">
            {site.social.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer" className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>
      </Container>

      <div className={styles.glow} aria-hidden="true">
        <Logo className={styles.mark} />
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.column}>
      <p className={cx('type-body-strong', styles.columnTitle)}>{title}</p>
      <ul className={cx('type-body', styles.links)}>{children}</ul>
    </div>
  )
}

/** "2026-09-13" → "9.13.2026" */
function formatBuildDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return `${month}.${day}.${year}`
}
