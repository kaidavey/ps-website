import { useSyncExternalStore } from 'react'

/**
 * Subscribes to a CSS media query.
 *
 * Uses useSyncExternalStore so the value is correct on first paint and stays
 * consistent under concurrent rendering — a useEffect-based version flashes
 * the wrong layout on mount.
 *
 * Prefer plain CSS. Reach for this only when a layout change must alter the
 * DOM or behaviour (closing a menu, swapping a component), not just its style.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    // Server/prerender fallback: assume the query does not match.
    () => false,
  )
}
