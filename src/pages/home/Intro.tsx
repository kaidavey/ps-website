import { Container } from '@/components/Container'
import { PhotoMarquee } from '@/components/PhotoMarquee'
import { RevealText } from '@/components/RevealText'
import { home } from '@/content/home'
import { cx } from '@/lib/cx'
import { useScrollProgress } from '@/lib/useScrollProgress'
import styles from './Intro.module.css'

/**
 * Full-viewport panel that stays pinned while the bio darkens word by word. The section itself is
 * the scroll track: it is a viewport tall plus the distance the reveal takes.
 */
export function Intro() {
  const trackRef = useScrollProgress<HTMLElement>()

  return (
    <section ref={trackRef} className={styles.intro} aria-label="About Product Space">
      <div className={styles.panel}>
        <Container>
          <RevealText paragraphs={home.intro} className={cx('type-lead', styles.text)} />
        </Container>
        <PhotoMarquee photos={home.gallery} />
      </div>
    </section>
  )
}
