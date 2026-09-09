import { Container } from '@/components/Container'
import { PageContent } from '@/components/PageContent'
import { students } from '@/content/students'
import { usePageTitle } from '@/lib/usePageTitle'
import { Members } from './Members'

export function ForStudentsPage() {
  usePageTitle(students.title)
  return (
    <PageContent offsetHeader>
      <Container>
        <h1 className="type-title">{students.title}</h1>
      </Container>
      <Members />
    </PageContent>
  )
}
