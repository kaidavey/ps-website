import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <Section space="lg">
      <Container size="narrow">
        <h1>Page not found</h1>
        <p>The page you were looking for doesn&rsquo;t exist or has moved.</p>
        <p>
          <Button to="/">Back to home</Button>
        </p>
      </Container>
    </Section>
  )
}
