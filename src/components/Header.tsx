import { useEffect, useId, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { site } from '@/content/site'
import { cx } from '@/lib/cx'
import { Container } from './Container'
import { Logo } from './Logo'
import styles from './Header.module.css'

/** Floating site header: logo plus a menu toggle that opens the full-screen navigation. */
export function Header() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={cx(styles.header, open && styles.open)}>
      <Container className={styles.bar}>
        <Link to="/" className={styles.home} aria-label={`${site.name} home`} onClick={close}>
          <Logo className={styles.logo} />
        </Link>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <MenuIcon open={open} />
        </button>
      </Container>

      <nav id={menuId} className={styles.menu} aria-label="Site" hidden={!open}>
        <Container className={styles.menuInner}>
          <ul className={styles.primary}>
            {site.nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => cx('type-title', styles.primaryLink, isActive && styles.active)}
                  onClick={close}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className={styles.secondary}>
            {site.social.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer" className={cx('type-subtitle', styles.secondaryLink)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 29 23" className={styles.icon} aria-hidden="true" focusable="false">
      {open ? (
        <path d="M3 2l23 19M26 2L3 21" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      ) : (
        <path d="M0 0h29v3.2H0zM0 9.9h29v3.2H0zM0 19.8h29V23H0z" fill="currentColor" />
      )}
    </svg>
  )
}
