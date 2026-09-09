import { Container } from '@/components/Container'
import { companies } from '@/content/companies'
import { cx } from '@/lib/cx'
import styles from './Overview.module.css'

export function Overview() {
  const { overview, clients } = companies
  return (
    <Container as="section" className={styles.section} aria-labelledby="companies-title">
      <h1 id="companies-title" className="type-title">
        {companies.title}
      </h1>

      <div className={styles.overview}>
        <h2 className="type-heading">{overview.title}</h2>
        <div className={styles.row}>
          <p className={cx('type-body', styles.summary)}>{overview.summary}</p>
          <ul className={styles.stats}>
            {overview.stats.map((stat) => (
              <li key={stat.label} className={styles.stat}>
                <span className={cx('type-stat', styles.value)}>{stat.value}</span>
                <span className={cx('type-body', styles.label)}>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.clients}>
        <p className={cx('type-body-strong', styles.clientsLabel)}>{clients.label}</p>
        <ul className={styles.logos}>
          {clients.logos.map((logo) => (
            <li key={logo.name}>
              <img src={logo.src} alt={logo.name} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
