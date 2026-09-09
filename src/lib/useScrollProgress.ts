import { useEffect, useRef } from 'react'

/**
 * Measures how far a tall "scroll track" element has been scrolled through, 0 → 1, and writes
 * the value to it as the `--progress` custom property. Children read it through inheritance,
 * so scrolling drives CSS without re-rendering React.
 *
 * The track is expected to be taller than the viewport and to contain a sticky panel: progress
 * hits 1 exactly when the panel stops being pinned.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const setProgress = (value: number) => element.style.setProperty('--progress', value.toFixed(4))

    // With reduced motion the text is simply shown at full contrast.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }

    let frame = 0
    const measure = () => {
      frame = 0
      const { top, height } = element.getBoundingClientRect()
      const distance = height - window.innerHeight
      setProgress(distance <= 0 ? 1 : Math.min(Math.max(-top / distance, 0), 1))
    }
    const schedule = () => {
      frame ||= requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return ref
}
