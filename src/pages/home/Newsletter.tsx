import { Button } from '@/components/Button'
import { TextField } from '@/components/FormField'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { home } from '@/content/home'
import { site } from '@/content/site'
import styles from './Newsletter.module.css'

export function Newsletter() {
  const { newsletter } = home
  return (
    <Section aria-labelledby="newsletter-title">
      <SectionHeader id="newsletter-title" title={newsletter.title} subtitle={newsletter.subtitle} />
      <form className={styles.form} action={site.forms.newsletter} method="post">
        <TextField label="Name" name="name" autoComplete="name" required className={styles.field} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required className={styles.field} />
        <Button type="submit" size="lg" className={styles.submit}>
          {newsletter.submit}
        </Button>
      </form>
    </Section>
  )
}
