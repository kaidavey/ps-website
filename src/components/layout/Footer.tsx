import { Link } from 'react-router'
import { Container } from '@/components/layout/Container'
import { footerNav, siteConfig, socialLinks } from '@/config/site'
import { cx } from '@/lib/cx'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={cx(styles.footer)}>
      <Container as="div" size="wide">
        <div className={cx(styles.inner)}>
          <div className={cx(styles.brandBlock)}>
            <p className={cx(styles.wordmark)}>{siteConfig.shortName}</p>
            <p className={cx(styles.affiliation)}>{siteConfig.affiliation}</p>
            <p className={cx(styles.updated)}>Last updated {siteConfig.lastUpdated}</p>
          </div>

          <div className={cx(styles.columns)}>
            <nav className={cx(styles.column)} aria-label="Footer navigation">
              <h2 className={cx(styles.columnTitle)}>Navigation</h2>
              <div className={cx(styles.links)}>
                {footerNav.map((item) => (
                  <Link key={item.to} to={item.to} className={cx(styles.link)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <nav className={cx(styles.column)} aria-label="Social links">
              <h2 className={cx(styles.columnTitle)}>Connect</h2>
              <div className={cx(styles.links)}>
                {socialLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cx(styles.link)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </Container>

      <div className={cx(styles.wash)} aria-hidden="true" />
    </footer>
  )
}
