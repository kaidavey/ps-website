import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { students } from '@/content/students'
import { cx } from '@/lib/cx'
import styles from './Faq.module.css'

/** Native disclosure rows, so they open by keyboard and screen reader without any script. */
export function Faq() {
  const { faq } = students
  return (
    <Section aria-labelledby="faq-title">
      <SectionHeader id="faq-title" title={faq.title} />
      <div className={styles.list}>
        {faq.items.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>
              <span className="type-subtitle">{item.question}</span>
              {/* Lucide "plus"; turns into a close mark when the row is open. */}
              <svg
                viewBox="0 0 24 24"
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14M12 5v14" />
              </svg>
            </summary>
            <p className={cx('type-body', styles.answer)}>{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
