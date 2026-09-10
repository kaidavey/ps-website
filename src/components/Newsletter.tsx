import { useState, type FormEvent } from 'react'
import { site } from '@/content/site'
import { Button } from './Button'
import { TextField } from './FormField'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'
import styles from './Newsletter.module.css'

export function Newsletter({ className }: { className?: string }) {
  const { newsletter } = site
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const endpoint = import.meta.env.VITE_NEWSLETTER_FORM_ENDPOINT || site.forms.newsletter

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    if (!endpoint) {
      setStatus('error')
      setMessage('Newsletter signup is not available yet. Please check back soon.')
      return
    }
    const form = event.currentTarget
    setStatus('sending')
    setMessage('Subscribing…')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(Array.from(new FormData(form), ([key, value]) => [key, String(value)])),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Subscription failed')
      setStatus('success')
      setMessage('Thanks for subscribing! You’re on the list.')
      form.reset()
    } catch {
      setStatus('error')
      setMessage('We couldn’t subscribe you. Please try again in a moment.')
    }
  }

  return (
    <Section aria-labelledby="newsletter-title" className={className}>
      <SectionHeader id="newsletter-title" title={newsletter.title} subtitle={newsletter.subtitle} />
      <form className={styles.form} onSubmit={subscribe} aria-busy={status === 'sending'} aria-describedby="newsletter-status">
        <TextField label="Name" name="name" autoComplete="name" required className={styles.field} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required className={styles.field} />
        <Button type="submit" size="lg" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? 'Subscribing…' : newsletter.submit}
        </Button>
      </form>
      <p id="newsletter-status" role="status" className={styles.status}>{message}</p>
    </Section>
  )
}
