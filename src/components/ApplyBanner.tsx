import { site } from '@/content/site'
import { cx } from '@/lib/cx'
import { Button } from './Button'
import { Container } from './Container'
import styles from './ApplyBanner.module.css'

interface ApplyBannerProps {
  /** Adds a secondary "Learn more" button linking here, beside Apply. */
  learnMoreTo?: string
}

/** The "Applications Open" call to action: title and buttons on the left, copy on the right. */
export function ApplyBanner({ learnMoreTo }: ApplyBannerProps) {
  const { apply } = site
  return (
    <Container as="section" aria-labelledby="apply-title">
      <div className={styles.banner}>
        <div className={styles.lead}>
          <h2 id="apply-title" className="type-subtitle">
            {apply.title}
          </h2>
          <div className={styles.actions}>
            <Button href={site.links.apply}>{apply.primary}</Button>
            {learnMoreTo && (
              <Button variant="secondary" to={learnMoreTo}>
                {apply.secondary}
              </Button>
            )}
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
