import { Button } from '@/components/Button'
import { SelectField, TextAreaField, TextField } from '@/components/FormField'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { companies } from '@/content/companies'
import { site } from '@/content/site'
import styles from './Contact.module.css'

export function Contact() {
  const { contact } = companies
  return (
    <Section aria-labelledby="contact-title">
      <SectionHeader id="contact-title" title={contact.title} subtitle={contact.subtitle} />
      <form className={styles.form} action={site.forms.contact} method="post">
        <div className={styles.fields}>
          <TextField label="Name" name="name" autoComplete="name" required />
          <TextField label="Email" name="email" type="email" autoComplete="email" required />
          <TextField label="Company" name="company" autoComplete="organization" required />
          <SelectField label="Type of Partnership" name="partnership" options={contact.partnershipTypes} required />
          <TextAreaField label="Body" name="message" className={styles.wide} />
        </div>
        <Button type="submit" size="lg">
          {contact.submit}
        </Button>
      </form>
    </Section>
  )
}
