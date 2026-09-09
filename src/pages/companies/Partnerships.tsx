import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { companies } from '@/content/companies'
import styles from './Partnerships.module.css'

export function Partnerships() {
  const { partnerships } = companies
  return (
    <Section aria-labelledby="partnerships-title">
      <SectionHeader id="partnerships-title" title={partnerships.title} subtitle={partnerships.subtitle} />
      <ul className={styles.grid}>
        {partnerships.items.map((item) => (
          <li key={item.title} className={styles.card}>
            <h3 className="type-body-strong">{item.title}</h3>
            <p className="type-body">{item.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
