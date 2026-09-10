import { ApplyBanner } from '@/components/ApplyBanner'
import { Newsletter } from '@/components/Newsletter'
import { PageContent } from '@/components/PageContent'
import { usePageTitle } from '@/lib/usePageTitle'
import { Events } from './Events'
import { Hero } from './Hero'
import { Intro } from './Intro'
import { Pillars } from './Pillars'

export function HomePage() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Intro />
      <PageContent>
        <Pillars />
        <ApplyBanner learnMoreTo="/for-students" />
        <Events />
        <Newsletter />
      </PageContent>
    </>
  )
}
