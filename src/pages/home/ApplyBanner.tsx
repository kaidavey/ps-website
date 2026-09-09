import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { home } from '@/content/home'
import { site } from '@/content/site'
import { cx } from '@/lib/cx'
import styles from './ApplyBanner.module.css'

export function ApplyBanner() {
  const { apply } = home
  return (
    <Container as="section" aria-labelledby="apply-title">
      <div className={styles.banner}>
        <div className={styles.lead}>
          <h2 id="apply-title" className="type-subtitle">
            {apply.title}
          </h2>
          <div className={styles.actions}>
            <Button href={site.links.apply}>{apply.primary}</Button>
            <Button variant="secondary" to="/for-students">
              {apply.secondary}
            </Button>
          </div>
        </div>
        <div className={cx('type-body', styles.copy)}>
          {apply.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Container>
  )
}
