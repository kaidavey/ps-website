import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Blurs and fades each reveal unit inside this container up into place the first time it scrolls
 * far enough into view. The reveal plays once and is never undone: scrolling back up and down
 * leaves already-revealed content alone.
 *
 * A unit is any `section` in the subtree, or any element marked `data-reveal`. Sections are
 * matched anywhere below the container, since most pages nest theirs inside a shared layout
 * wrapper (e.g. `PageContent`) rather than placing them directly under `<main>`. A section that
 * is too tall to read as one block marks itself `data-no-reveal` and marks its parts with
 * `data-reveal` instead, so it comes in piece by piece; `data-no-reveal` on its own (as on the
 * home page's hero and pinned intro) just opts out entirely.
 *
 * Sections already on screen at load (e.g. a page's hero) are left untouched, so first paint
 * isn't delayed by an animation.
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
    // Nothing is ever hidden under reduced motion, rather than hiding it and relying on the
    // global near-zero transition override in base.css to bring it back.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const candidates = Array.from(
      root.querySelectorAll<HTMLElement>('section:not([data-no-reveal]), [data-reveal]'),
    )
    // Outermost wins: a marked wrapper animates as one block rather than also animating each
    // marked child on its own.
    const targets = candidates.filter((el) => !candidates.some((other) => other !== el && other.contains(el)))
    if (targets.length === 0) return

    // Once a unit has settled it needs no reveal styles at all, and keeping them costs: a
    // `filter` — even `blur(0)` — holds a compositing layer and a containing block on every
    // section for the rest of the session, which is what made scrolling choppy.
    const onTransitionEnd = (event: TransitionEvent) => {
      const el = event.currentTarget as HTMLElement
      if (event.propertyName !== 'opacity' || !el.classList.contains('is-visible')) return
      el.classList.remove('reveal', 'is-visible')
      el.style.willChange = ''
      el.removeEventListener('transitionend', onTransitionEnd)
    }

    const onReveal: IntersectionObserverCallback = (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        el.style.willChange = 'opacity, transform, filter'
        el.classList.add('is-visible')
        observer.unobserve(el)
      }
    }

    /*
     * A unit reveals once `min(half its own height, a quarter of the viewport)` of it is on
     * screen. Rather than measure that per element on every callback, the two cases fall out as
     * plain observer options:
     *
     * - taller than half the viewport: the cap binds, so it fires when the top edge passes 75%
     *   down the screen — a root shrunk 25% at the bottom, at threshold 0.
     * - shorter than that: half its own height binds, i.e. its midpoint enters the viewport —
     *   which is just threshold 0.5.
     */
    const tall = new IntersectionObserver(onReveal, { rootMargin: '0px 0px -25% 0px' })
    const short = new IntersectionObserver(onReveal, { threshold: 0.5 })

    const hidden: HTMLElement[] = []
    for (const el of targets) {
      // Already on screen (or nearly) at load: leave it as authored. It never animates, so it
      // never needs the hidden starting state.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) continue
      // Suppressed for one frame so hiding the unit doesn't itself animate: without this the
      // unit fades *out* over 0.7s on arrival, and that stray transitionend would tear down the
      // reveal before it ever ran.
      el.style.transition = 'none'
      el.classList.add('reveal')
      el.addEventListener('transitionend', onTransitionEnd)
      hidden.push(el)
      // Classified once, on purpose: on phones the URL bar collapsing changes `innerHeight`
      // constantly, and re-sorting units mid-scroll would reintroduce the jitter this replaced.
      const observer = el.offsetHeight >= window.innerHeight * 0.5 ? tall : short
      observer.observe(el)
    }

    const frame = requestAnimationFrame(() => {
      for (const el of hidden) el.style.transition = ''
    })

    return () => {
      cancelAnimationFrame(frame)
      tall.disconnect()
      short.disconnect()
    }
  }, [pathname])

  return ref
}
