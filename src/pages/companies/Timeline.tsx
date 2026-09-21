import type { CSSProperties } from 'react'
import { Section } from '@/components/Section'
import { companies } from '@/content/companies'
import { cx } from '@/lib/cx'
import styles from './Timeline.module.css'

export function Timeline() {
  const { timeline } = companies
  const lastIndex = timeline.steps.length - 1
  return (
    // Long enough that one fade would cover most of a screen: heading, steps and note each
    // reveal on their own.
    <Section aria-labelledby="timeline-title" data-no-reveal>
      <h2 id="timeline-title" className="type-heading" data-reveal>
        {timeline.title}
      </h2>

      <div className={styles.steps} data-reveal>
        <div className={styles.track} aria-hidden="true">
          {timeline.steps.map((step, index) => (
            <span key={step.title} className={styles.marker} style={{ '--t': index / lastIndex } as CSSProperties} />
          ))}
        </div>
        <ol className={styles.grid}>
          {timeline.steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <div className={styles.heading}>
                <span className={cx('type-body', styles.number)}>{index + 1}</span>
                <h3 className={cx('type-body-strong', styles.title)}>{step.title}</h3>
              </div>
              <p className={cx('type-body', styles.description)}>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="type-body" data-reveal>
        {timeline.note}
      </p>
    </Section>
  )
}
