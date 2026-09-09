import { Container } from '@/components/Container'
import { home } from '@/content/home'
import styles from './Intro.module.css'

export function Intro() {
  return (
    <section className={styles.intro} aria-label="About Product Space">
      <Container className={styles.text}>
        {home.intro.map((paragraph) => (
          <p key={paragraph} className="type-lead">
            {paragraph}
          </p>
        ))}
      </Container>

      <ul className={styles.gallery} aria-label="Photos from Product Space">
        {home.gallery.map((photo) => (
          <li key={photo.src} className={styles.slide}>
            <img src={photo.src} alt={photo.alt} width={1200} height={800} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  )
}
