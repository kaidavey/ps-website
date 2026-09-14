import { Container } from '@/components/Container'
import { PhotoMarquee } from '@/components/PhotoMarquee'
import { about } from '@/content/about'
import { cx } from '@/lib/cx'
import styles from './Mission.module.css'

/**
 * The page title, then the mission statement over a self-scrolling strip of member photos. The
 * strip sits outside the container so it runs the full width of the page.
 */
export function Mission() {
  const { mission } = about
  return (
    <section className={styles.section} aria-labelledby="about-title">
      <Container className={styles.copy}>
        <h1 id="about-title" className="type-title">
          {about.title}
        </h1>

        <div className={styles.mission}>
          <h2 className="type-heading">{mission.title}</h2>
          <p className={cx('type-body', styles.body)}>{mission.body}</p>
        </div>
      </Container>

      <PhotoMarquee photos={mission.photos} className={styles.gallery} />
    </section>
  )
}
