import { Container } from '@/components/Container'
import frame from '@/assets/images/students/frame.webp'
import { SectionHeader } from '@/components/SectionHeader'
import { students } from '@/content/students'
import styles from './Welcome.module.css'

export function Welcome() {
  const { welcome } = students
  return (
    <section className={styles.section} aria-labelledby="students-title">
      <Container className={styles.copy}>
        <h1 id="students-title" className="type-title">
          {students.title}
        </h1>
        <SectionHeader title={welcome.title} subtitle={welcome.subtitle} />
      </Container>
      <Container>
        <div className={styles.gallery}>
          {welcome.photos.map((photo) => (
            <div key={photo.src} className={styles.print}>
              <img src={frame} alt="" className={styles.frame} width="207" height="323" />
              <img src={photo.src} alt={photo.alt} className={styles.photo} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
