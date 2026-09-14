import { useEffect, useState } from 'react'
import type { SiteEvent } from '@/content/events'
import { site } from '@/content/site'

export function useLumaEvents() {
  const [events, setEvents] = useState<SiteEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    let pending = false
    let controller: AbortController | undefined
    async function refresh() {
      if (pending) return
      pending = true
      controller = new AbortController()
      const request = controller
      const timeout = setTimeout(() => request.abort(), 15000)
      try {
        const response = await fetch(site.events.feedUrl, { signal: request.signal, cache: 'no-cache' })
        if (!response.ok) throw new Error('Calendar unavailable')
        const { parseLumaCalendar } = await import('./luma')
        const next = parseLumaCalendar(await response.text())
        if (active) { setEvents(next); setError(false) }
      } catch {
        if (active) setError(true)
      } finally {
        clearTimeout(timeout)
        pending = false
        if (active) setLoading(false)
      }
    }
    setLoading(true)
    void refresh()
    const interval = setInterval(() => { if (!document.hidden) void refresh() }, 5 * 60 * 1000)
    return () => { active = false; controller?.abort(); clearInterval(interval) }
  }, [attempt])

  return { events, loading, error, retry: () => setAttempt((value) => value + 1) }
}
