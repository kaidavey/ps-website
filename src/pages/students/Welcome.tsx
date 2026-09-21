import type { CSSProperties } from 'react'
import { Container } from '@/components/Container'
import frame from '@/assets/images/students/frame.webp'
import { SectionHeader } from '@/components/SectionHeader'
import { students } from '@/content/students'
import styles from './Welcome.module.css'

export function Welcome() {
  const { welcome } = students
  return (
    // Opted out of the site-wide reveal: the prints run their own entrance on arrival.
    <section className={styles.section} aria-labelledby="students-title" data-no-reveal>
      <Container className={styles.copy}>
        <h1 id="students-title" className="type-title">
          {students.title}
        </h1>
        <SectionHeader title={welcome.title} subtitle={welcome.subtitle} />
      </Container>
      <Container>
        <div className={styles.gallery}>
          {welcome.photos.map((photo, index) => (
            <div key={photo.src} className={styles.print}>
              {/* Inner element so the pop scales from the print's centre: `.print` itself pivots
                  on its top-left corner, which is what its scattered tilt is measured from. */}
              <div className={styles.pop} style={{ '--index': index } as CSSProperties}>
                <img src={frame} alt="" className={styles.frame} width="207" height="323" />
                <img src={photo.src} alt={photo.alt} className={styles.photo} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
