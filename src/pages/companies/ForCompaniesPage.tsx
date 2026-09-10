import { PageContent } from '@/components/PageContent'
import { companies } from '@/content/companies'
import { usePageTitle } from '@/lib/usePageTitle'
import { Contact } from './Contact'
import { Overview } from './Overview'
import { Partnerships } from './Partnerships'
import { PastEvents } from './PastEvents'
import { Testimonials } from './Testimonials'
import { Timeline } from './Timeline'
import styles from './ForCompaniesPage.module.css'

export function ForCompaniesPage() {
  usePageTitle(companies.title)
  return (
    <PageContent offsetHeader className={styles.page}>
      <Overview />
      <Timeline />
      <Testimonials />
      <Partnerships />
      <PastEvents />
      <Contact />
    </PageContent>
  )
}
