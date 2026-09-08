import { SectionHeading } from '@/components/ui/SectionHeading'
import { getPillars } from '@/content'
import { cx } from '@/lib/cx'
import styles from './Pillars.module.css'

/**
 * "How It Works" — the three pillars.
 *
 * The cards are equal-height by grid default and reflow from three columns to
 * one on content width rather than at a breakpoint, so they stay correct
 * inside any container at any zoom level.
 */
export function Pillars() {
  const pillars = getPillars()
  if (pillars.length === 0) return null

  return (
    <section className={cx(styles.section)} aria-labelledby="pillars-title">
      <SectionHeading
        id="pillars-title"
        title="How It Works"
        subtitle="Product Space is built on three pillars."
      />

      <ul role="list" className={cx(styles.grid)}>
        {pillars.map((pillar) => (
          <li key={pillar.id} className={cx(styles.card)}>
            <div className={cx(styles.media)}>
              <img
                className={cx(styles.image)}
                src={pillar.image.src}
                alt={pillar.image.alt}
                width={pillar.image.width}
                height={pillar.image.height}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={cx(styles.text)}>
              <h3 className={cx(styles.title)}>{pillar.title}</h3>
              <p className={cx(styles.description)}>{pillar.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
