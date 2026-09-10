import { Container } from '@/components/Container'
import { PhotoMarquee } from '@/components/PhotoMarquee'
import { SectionHeader } from '@/components/SectionHeader'
import { students } from '@/content/students'
import styles from './Welcome.module.css'

export function Welcome() {
  const { welcome } = students
  return (
    <Container as="section" className={styles.section} aria-labelledby="students-title">
      <h1 id="students-title" className="type-title">
        {students.title}
      </h1>
      <div className={styles.group}>
        <SectionHeader title={welcome.title} subtitle={welcome.subtitle} />
        <PhotoMarquee photos={welcome.photos} className={styles.gallery} />
      </div>
    </Container>
  )
}
