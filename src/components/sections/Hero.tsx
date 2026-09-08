import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { cx } from '@/lib/cx'
import styles from './Hero.module.css'

const HERO_PHOTO = {
  src: '/img/hero-group.svg',
  width: 986,
  height: 563,
  alt: 'Product Space at UCLA fellows gathered together on campus',
}

/**
 * Page hero: wordmark, tagline, group photo and the "let's chat" prompt.
 *
 * The design places these by absolute coordinates on a 1512px frame. Here
 * they are grid areas instead, so the same arrangement holds at the design
 * width and collapses to a single column below it — no element can escape its
 * container or overlap another at an in-between size.
 */
export function Hero() {
  return (
    <section className={cx(styles.hero)} aria-labelledby="hero-title">
      <div className={cx(styles.wash)} aria-hidden="true" />

      <Container size="wide">
        <div className={cx(styles.layout)}>
          <div className={cx(styles.headline)}>
            <h1 id="hero-title" className={cx(styles.wordmark)}>
              product space
            </h1>
            <p className={cx(styles.tagline)}>
              Building the Next Generation of Tech Leaders
            </p>
          </div>

          <div className={cx(styles.prompt)}>
            <p className={cx(styles.promptText)}>
              Have a project in mind? Let&rsquo;s chat!
            </p>
            <Button to="/companies" variant="light">
              Learn more
            </Button>
          </div>

          <img
            className={cx(styles.photo)}
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            width={HERO_PHOTO.width}
            height={HERO_PHOTO.height}
            /* The hero image is the largest paint on first load — never lazy. */
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </Container>
    </section>
  )
}
