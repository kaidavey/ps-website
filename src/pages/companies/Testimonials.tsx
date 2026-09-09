import { Section } from '@/components/Section'
import { companies } from '@/content/companies'
import { cx } from '@/lib/cx'
import styles from './Testimonials.module.css'

export function Testimonials() {
  const { testimonials } = companies
  return (
    <Section aria-labelledby="testimonials-title">
      <h2 id="testimonials-title" className="type-heading">
        {testimonials.title}
      </h2>
      <ul className={styles.list}>
        {testimonials.items.map((item) => (
          <li key={item.name} className={styles.card}>
            <div className={styles.meta}>
              <div className={styles.client}>
                <img src={item.logo} alt={item.company} className={styles.logo} loading="lazy" />
                <p className={cx('type-body', styles.project)}>{item.project}</p>
              </div>
              <div className={styles.author}>
                <img src={item.avatar} alt="" className={styles.avatar} loading="lazy" />
                <div>
                  <p className="type-body-strong">{item.name}</p>
                  <p className={cx('type-body', styles.role)}>{item.role}</p>
                </div>
              </div>
            </div>
            <blockquote className={cx('type-body', styles.quote)}>
              {item.quote.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
          </li>
        ))}
      </ul>
    </Section>
  )
}
