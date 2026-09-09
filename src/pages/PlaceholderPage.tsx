import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { PageContent } from '@/components/PageContent'
import { cx } from '@/lib/cx'
import { usePageTitle } from '@/lib/usePageTitle'
import styles from './PlaceholderPage.module.css'

interface PlaceholderPageProps {
  title: string
  message: string
}

/** Stand-in for routes whose design isn't finished yet, and for unknown URLs. */
export function PlaceholderPage({ title, message }: PlaceholderPageProps) {
  usePageTitle(title)
  return (
    <PageContent offsetHeader>
      <Container className={styles.body}>
        <h1 className="type-title">{title}</h1>
        <p className={cx('type-subtitle', styles.message)}>{message}</p>
        <Button to="/">Back home</Button>
      </Container>
    </PageContent>
  )
}
