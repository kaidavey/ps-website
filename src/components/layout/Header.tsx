import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { primaryNav, siteConfig } from '@/config/site'
import { cx } from '@/lib/cx'
import styles from './Header.module.css'

/**
 * Site header: wordmark and a menu button, at every width.
 *
 * The design uses a single disclosure rather than a desktop nav bar, which is
 * also the more robust choice — the navigation never has to reflow, so it
 * cannot break at an in-between width.
 *
 * The menu is a native <dialog> opened with showModal(), which is what
 * supplies focus trapping, Escape-to-close, inertness for the page behind,
 * and top-layer stacking. Hand-rolling those is a well-known source of
 * accessibility bugs; none of that code needs to exist here.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const panelId = useId()
  const { pathname } = useLocation()
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Drive the dialog from state so React stays the source of truth. Calling
  // showModal() on an already-open dialog throws, hence the guards.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // A route change closes the menu; without this it stays open over the new page.
  useEffect(() => setOpen(false), [pathname])

  // The dialog also closes itself (Escape, or the backdrop on some browsers),
  // so listen for that rather than assuming state and DOM stay in step.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const onClose = () => setOpen(false)
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [])

  // A zero-height sentinel at the top of the document tells us whether the
  // page has scrolled. An IntersectionObserver costs nothing per frame; a
  // scroll listener would run on every one.
  useEffect(() => {
    const sentinel = document.getElementById(`${panelId}-sentinel`)
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!(entry?.isIntersecting ?? true)),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [panelId])

  return (
    <>
      <div id={`${panelId}-sentinel`} aria-hidden="true" />

      <header className={cx(styles.header, scrolled && !open && styles.scrolled)}>
        <Container as="div" size="wide">
          <div className={cx(styles.bar)}>
            <NavLink to="/" className={cx(styles.brand)}>
              {siteConfig.shortName}
            </NavLink>

            <button
              type="button"
              className={cx(styles.toggle)}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen(true)}
            >
              <span className="visually-hidden">Open menu</span>
              <MenuIcon open={false} />
            </button>
          </div>
        </Container>
      </header>

      <dialog
        id={panelId}
        ref={dialogRef}
        className={cx(styles.panel)}
        aria-label="Site menu"
      >
        <div className={cx(styles.panelBar)}>
          <NavLink to="/" className={cx(styles.brand)}>
            {siteConfig.shortName}
          </NavLink>
          <button
            type="button"
            className={cx(styles.toggle)}
            onClick={() => setOpen(false)}
          >
            <span className="visually-hidden">Close menu</span>
            <MenuIcon open />
          </button>
        </div>

        <nav aria-label="Primary" className={cx(styles.panelNav)}>
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
        </nav>

        <div className={cx(styles.panelActions)}>
          <Button to="/apply">Apply</Button>
          <Button to="/about" variant="light">
            Learn more
          </Button>
        </div>
      </dialog>
    </>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
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
          <path d="M3 7h18" />
          <path d="M3 12h18" />
          <path d="M3 17h18" />
        </>
      )}
    </svg>
  )
}
