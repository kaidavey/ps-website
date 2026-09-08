import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

/**
 * Stand-in for a route whose design has not been built yet.
 *
 * Keeps every link in the primary navigation resolving to a real page, so
 * routing and layout can be exercised before the designs arrive. Delete each
 * usage as its real page lands.
 */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Section space="lg">
      <Container size="narrow">
        <h1>{title}</h1>
        <p>This page is not built yet.</p>
      </Container>
    </Section>
  )
}
