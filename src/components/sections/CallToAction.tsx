import { Button } from '@/components/ui/Button'
import { cx } from '@/lib/cx'
import styles from './CallToAction.module.css'

/** Applications-open panel. */
export function CallToAction() {
  return (
    <section className={cx(styles.panel)} aria-labelledby="cta-title">
      <div className={cx(styles.lead)}>
        <h2 id="cta-title" className={cx(styles.title)}>
          Applications Open
        </h2>
        <div className={cx(styles.actions)}>
          <Button to="/apply">Apply</Button>
          <Button to="/about" variant="light">
            Learn more
          </Button>
        </div>
      </div>

      <div className={cx(styles.description)}>
        <p>
          Fall Quarter is right around the corner and we are taking applicants!{' '}
          <span className={cx(styles.strong)}>
            Start by filling out our interest form.
          </span>
        </p>
        <p>
          Remember, <span className={cx(styles.strong)}>any major</span> and{' '}
          <span className={cx(styles.strong)}>any skill level</span> can join! We&rsquo;d
          love to see your application.
        </p>
      </div>
    </section>
  )
}
