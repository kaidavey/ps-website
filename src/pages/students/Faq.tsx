import { useRef, type MouseEvent } from 'react'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { students } from '@/content/students'
import { cx } from '@/lib/cx'
import styles from './Faq.module.css'

const DURATION = 320
const EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'

/**
 * A native disclosure row that opens and closes on a height animation.
 *
 * `<details>` can't transition its own open state, so the toggle is deferred: the row is held open
 * for the length of the animation and `open` only flips once it finishes. Everything else stays
 * native, so the row still works by keyboard and screen reader, and without script it simply snaps
 * open as before.
 */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const animation = useRef<Animation>(null)

  function toggle(event: MouseEvent<HTMLElement>) {
    const details = ref.current
    if (!details) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    event.preventDefault()
    const summary = event.currentTarget
    // Mid-flight height if a click interrupts an animation, so the row changes direction from
    // wherever it currently is rather than jumping.
    const from = details.offsetHeight
    animation.current?.cancel()

    const opening = !details.open
    if (opening) details.open = true
    const to = opening ? details.offsetHeight : summary.offsetHeight

    details.style.overflow = 'hidden'
    animation.current = details.animate({ height: [`${from}px`, `${to}px`] }, { duration: DURATION, easing: EASING })
    animation.current.onfinish = () => {
      if (!opening) details.open = false
      details.style.overflow = ''
      animation.current = null
    }
  }

  return (
    <details ref={ref} className={styles.item}>
      <summary className={styles.question} onClick={toggle}>
        <span className="type-subtitle">{question}</span>
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
      <p className={cx('type-body', styles.answer)}>{answer}</p>
    </details>
  )
}

export function Faq() {
  const { faq } = students
  return (
    // The full question list runs past a screen, so the heading and the list reveal separately.
    <Section aria-labelledby="faq-title" data-no-reveal>
      <SectionHeader id="faq-title" title={faq.title} data-reveal />
      <div className={styles.list} data-reveal>
        {faq.items.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </Section>
  )
}
