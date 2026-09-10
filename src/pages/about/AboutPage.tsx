import { Container } from '@/components/Container'
import { PageContent } from '@/components/PageContent'
import { about } from '@/content/about'
import { usePageTitle } from '@/lib/usePageTitle'
import { Members } from './Members'

export function AboutPage() {
  usePageTitle(about.title)
  return (
    <PageContent offsetHeader>
      <Container>
        <h1 className="type-title">{about.title}</h1>
      </Container>
      <Members />
    </PageContent>
  )
}
