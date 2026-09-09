import { PageContent } from '@/components/PageContent'
import { usePageTitle } from '@/lib/usePageTitle'
import { ApplyBanner } from './ApplyBanner'
import { Events } from './Events'
import { Hero } from './Hero'
import { Intro } from './Intro'
import { Newsletter } from './Newsletter'
import { Pillars } from './Pillars'

export function HomePage() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Intro />
      <PageContent>
        <Pillars />
        <ApplyBanner />
        <Events />
        <Newsletter />
      </PageContent>
    </>
  )
}
