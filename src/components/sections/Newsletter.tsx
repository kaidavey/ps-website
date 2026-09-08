import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cx } from '@/lib/cx'
import styles from './Newsletter.module.css'

/**
 * Newsletter sign-up.
 *
 * The form is complete and accessible but not yet wired to anything — the
 * site is static, so submitting needs an endpoint (a form service, or the
 * serverless function that would also front a Notion write). `onSubmit` is
 * the single place to add it.
 */
export function Newsletter() {
  const nameId = useId()
  const emailId = useId()
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className={cx(styles.section)} aria-labelledby="newsletter-title">
      <SectionHeading
        id="newsletter-title"
        title="Join Our Newsletter"
        subtitle="All UCLA students (including non-fellows) can tune into our monthly newsletter exploring recent product news and career guidance."
      />

      <form
        className={cx(styles.form)}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}
      >
        <div className={cx(styles.field)}>
          <label htmlFor={nameId} className="visually-hidden">
            Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Name"
            required
            className={cx(styles.input)}
          />
        </div>

        <div className={cx(styles.field)}>
          <label htmlFor={emailId} className="visually-hidden">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            required
            className={cx(styles.input)}
          />
        </div>

        <Button type="submit" className={cx(styles.submit)}>
          Subscribe
        </Button>
      </form>

      {/* aria-live so the confirmation is announced, not just shown. */}
      <p className={cx(styles.status)} aria-live="polite">
        {submitted ? 'Thanks — we will be in touch.' : ''}
      </p>
    </section>
  )
}
