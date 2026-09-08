import { useEffect, useId, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { primaryNav, siteConfig } from '@/config/site'
import { cx } from '@/lib/cx'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { media } from '@/lib/breakpoints'
import styles from './Header.module.css'

/**
 * Site header with a responsive navigation disclosure.
 *
 * Structure only — visual design lands when the Figma file does. What is here
 * is the behaviour that is easy to get wrong and tedious to retrofit:
 * the menu closes on navigation and when the viewport grows past the desktop
 * breakpoint, Escape dismisses it, and the button carries the ARIA state that
 * makes it usable with a screen reader.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const { pathname } = useLocation()
  const isDesktop = useMediaQuery(media.lg)

  // A route change closes the panel; without this it stays open over the new page.
  useEffect(() => setOpen(false), [pathname])

  // Rotating a phone or resizing into the desktop layout hides the toggle. If
  // the panel stayed "open" its state would be stranded with no way to close it.
  useEffect(() => {
    if (isDesktop) setOpen(false)
  }, [isDesktop])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className={cx(styles.header)}>
      <Container as="div" size="wide">
        <div className={cx(styles.bar)}>
          <NavLink to="/" className={cx(styles.brand)}>
            {siteConfig.shortName}
          </NavLink>

          <nav className={cx(styles.nav)} aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={cx(styles.link)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={cx(styles.actions)}>
            <Button to="/join" size="sm">
              Join Us
            </Button>
          </div>

          <button
            type="button"
            className={cx(styles.toggle)}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="visually-hidden">
              {open ? 'Close navigation menu' : 'Open navigation menu'}
            </span>
            <MenuIcon open={open} />
          </button>
        </div>

        {open && (
          <nav id={panelId} className={cx(styles.panel)} aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={cx(styles.panelLink)}
              >
                {item.label}
              </NavLink>
            ))}
            <Button to="/join" block className={cx(styles.panelAction)}>
              Join Us
            </Button>
          </nav>
        )}
      </Container>
    </header>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  )
}
