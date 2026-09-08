import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/config/site'
import { cx } from '@/lib/cx'
import styles from './HomePage.module.css'

/**
 * Placeholder home page.
 *
 * Its only job right now is to exercise the layout primitives and tokens end
 * to end. It gets replaced wholesale by the Figma design.
 */
export function HomePage() {
  return (
    <Section space="lg">
      <Container>
        <div className={cx(styles.intro)}>
          <div>
            <h1 className={cx(styles.heading)}>
              We bridge <span className={cx(styles.accent)}>product strategy</span> and
              execution to help your team move faster.
            </h1>
            <p className={cx(styles.lede)}>{siteConfig.description}</p>
            <div className={cx(styles.cta)}>
              <Button to="/companies" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
