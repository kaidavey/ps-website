import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { SelectField, TextAreaField, TextField } from '@/components/FormField'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { companies } from '@/content/companies'
import { site } from '@/content/site'
import styles from './Contact.module.css'

export function Contact() {
  const { contact } = companies
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const inFlight = useRef(false)
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || site.forms.contact

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return
    const form = event.currentTarget
    if (!endpoint) {
      setStatus('This form is temporarily unavailable. Please try again later.')
      return
    }
    inFlight.current = true
    setSending(true)
    setStatus('Sending your message…')
    try {
      const body = new URLSearchParams()
      new FormData(form).forEach((value, key) => body.append(key, String(value)))
      const response = await fetch(endpoint, {
        method: 'POST', body, headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Submission failed')
      form.reset()
      setStatus('Thanks for reaching out! Your message has been sent.')
    } catch {
      setStatus('Your message could not be sent. Please try again. Your answers are still here.')
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }
  return (
    <Section id="contact" aria-labelledby="contact-title">
      <SectionHeader id="contact-title" title={contact.title} subtitle={contact.subtitle} />
      <form className={styles.form} onSubmit={submit} aria-busy={sending}>
        <div className={styles.fields}>
          <TextField label="Name" name="name" autoComplete="name" required />
          <TextField label="Email" name="email" type="email" autoComplete="email" required />
          <TextField label="Company" name="company" autoComplete="organization" required />
          <SelectField label="Type of Partnership" name="partnership" options={contact.partnershipTypes} required />
          <TextAreaField label="Body" name="message" className={styles.wide} />
        </div>
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? 'Sending…' : contact.submit}
        </Button>
        <p className={`type-body ${styles.status}`} role="status" aria-live="polite">{status}</p>
      </form>
    </Section>
  )
}
