import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { students } from '@/content/students'
import { cx } from '@/lib/cx'
import styles from './Fellowship.module.css'

export function Fellowship() {
  const { fellowship } = students
  return (
    <Section aria-labelledby="fellowship-title">
      <SectionHeader id="fellowship-title" title={fellowship.title} subtitle={fellowship.subtitle} />
      <div className={cx('type-body', styles.copy)}>
        {fellowship.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className={styles.disciplines}>
        {fellowship.disciplines.map((discipline) => (
          <li key={discipline.title} className={styles.discipline}>
            <img src={discipline.image} alt="" loading="lazy" className={styles.art} />
            <h3 className={cx('type-heading', styles.name)}>{discipline.title}</h3>
          </li>
        ))}
      </ul>
    </Section>
  )
}
