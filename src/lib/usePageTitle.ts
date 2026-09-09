import { useEffect } from 'react'
import { site } from '@/content/site'

/** Sets the document title for the current page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : site.name
  }, [title])
}
