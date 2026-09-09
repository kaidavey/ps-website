import { Section } from '@/components/Section'
import { companies } from '@/content/companies'
import { cx } from '@/lib/cx'
import styles from './PastEvents.module.css'

export function PastEvents() {
  const { pastEvents } = companies
  return (
    <Section aria-labelledby="past-events-title">
      <h2 id="past-events-title" className="type-heading">
        {pastEvents.title}
      </h2>
      <ul className={styles.grid}>
        {pastEvents.items.map((item) => (
          <li key={item.caption} className={styles.item}>
            <img src={item.src} alt={item.alt} className={styles.image} loading="lazy" />
            <p className={cx('type-body', styles.caption)}>{item.caption}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
