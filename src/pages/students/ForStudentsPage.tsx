import { ApplyBanner } from '@/components/ApplyBanner'
import { Newsletter } from '@/components/Newsletter'
import { PageContent } from '@/components/PageContent'
import { students } from '@/content/students'
import { usePageTitle } from '@/lib/usePageTitle'
import { Faq } from './Faq'
import { Fellowship } from './Fellowship'
import { Welcome } from './Welcome'

export function ForStudentsPage() {
  usePageTitle(students.title)
  return (
    <PageContent offsetHeader>
      <Welcome />
      <Fellowship />
      <ApplyBanner />
      <Faq />
      <Newsletter />
    </PageContent>
  )
}
