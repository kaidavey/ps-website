import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'

/**
 * Router-level error boundary. Catches render and loader failures so a single
 * broken page degrades to a readable message instead of a blank document.
 */
export function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong.'

  return (
    <Section space="lg">
      <Container size="narrow">
        <h1>{message}</h1>
        <p>Please try again, or head back to the home page.</p>
        <p>
          <Button to="/">Back to home</Button>
        </p>
      </Container>
    </Section>
  )
}
