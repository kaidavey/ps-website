import { Link } from 'react-router'
import { Container } from '@/components/layout/Container'
import { primaryNav, siteConfig } from '@/config/site'
import { cx } from '@/lib/cx'
import styles from './Footer.module.css'

/** Site footer. Structural shell — awaiting the Figma design. */
export function Footer() {
  return (
    <footer className={cx(styles.footer)}>
      <Container as="div" size="wide">
        <div className={cx(styles.inner)}>
          <Link to="/" className={cx(styles.brand)}>
            {siteConfig.name}
          </Link>

          <nav className={cx(styles.nav)} aria-label="Footer">
            {primaryNav.map((item) => (
              <Link key={item.to} to={item.to} className={cx(styles.link)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <p className={cx(styles.legal)}>
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  )
}
