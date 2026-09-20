import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Fades in each `section` inside this container every time it scrolls into view, and fades it
 * back out when it scrolls back off screen, so the effect repeats on every pass rather than
 * playing once. Sections are matched anywhere in the subtree, since most pages nest theirs inside
 * a shared layout wrapper (e.g. `PageContent`) rather than placing them directly under `<main>`.
 *
 * Sections already on screen at load (e.g. a page's hero) start visible with no transition, so
 * first paint isn't delayed by an animation; scrolling them out and back in animates normally.
 * Any section can opt out with `data-no-reveal` (used by sections that already animate
 * themselves, like the home page's pinned intro).
 *
 * Re-scans on every route change: `<main>` itself never unmounts between pages, only its
 * contents swap, so without this the observer would only ever see the very first page's sections.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (typeof IntersectionObserver === 'undefined') return

    const sections = Array.from(root.querySelectorAll<HTMLElement>('section:not([data-no-reveal])'))
    if (sections.length === 0) return

    // Only promote a section to its own compositor layer while it's actually transitioning;
    // leaving `will-change` on for every section all the time is what made scrolling choppy.
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'opacity') (event.currentTarget as HTMLElement).style.willChange = ''
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement
          section.style.willChange = 'opacity, transform'
          section.classList.toggle('is-visible', entry.isIntersecting)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 },
    )

    const instant: HTMLElement[] = []
    for (const section of sections) {
      section.classList.add('reveal')
      section.addEventListener('transitionend', onTransitionEnd)
      // Already visible (or nearly) on load: show it immediately, with no transition, rather
      // than delay first paint. It still animates normally once scrolled out and back in.
      if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
        section.classList.add('is-visible', 'reveal-instant')
        instant.push(section)
      }
      observer.observe(section)
    }

    // Drop the no-transition flag on the next frame so a later scroll-out/scroll-in animates.
    const frame = requestAnimationFrame(() => {
      for (const section of instant) section.classList.remove('reveal-instant')
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname])

  return ref
}
