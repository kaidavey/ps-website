import { useEffect, useState } from 'react'

/** Ignore scroll jitter below this many pixels, so the header doesn't flicker. */
const SCROLL_THRESHOLD = 6
/** Distance the reader must be past the top before the header is allowed to hide. */
const HIDE_AFTER = 140

export interface HeaderVisibility {
  /** True while the reader is scrolling down, away from the top of the page. */
  hidden: boolean
  /** True at the very top, where the header sits transparently over the hero. */
  atTop: boolean
}

/**
 * Drives a header that slides away as the reader scrolls down and drops back in the moment they
 * scroll up. State only changes when it actually flips, so scrolling does not re-render per frame.
 */
export function useHeaderVisibility(): HeaderVisibility {
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const measure = () => {
      frame = 0
      const y = Math.max(window.scrollY, 0)
      setAtTop(y <= 4)

      const delta = y - lastY
      if (Math.abs(delta) < SCROLL_THRESHOLD) return
      lastY = y
      setHidden(delta > 0 && y > HIDE_AFTER)
    }

    const schedule = () => {
      frame ||= requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return { hidden, atTop }
}
