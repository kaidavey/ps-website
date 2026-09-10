import { cx } from '@/lib/cx'
import styles from './PhotoMarquee.module.css'

interface Photo {
  src: string
  alt: string
}

interface PhotoMarqueeProps {
  photos: readonly Photo[]
  className?: string
}

/**
 * Photo strip that scrolls itself continuously. The list is rendered twice so the animation can
 * loop seamlessly; the second copy is decorative and hidden from assistive technology.
 */
export function PhotoMarquee({ photos, className }: PhotoMarqueeProps) {
  return (
    <div className={cx(styles.marquee, className)}>
      <div className={styles.track}>
        <ul className={styles.group}>
          {photos.map((photo) => (
            <li key={photo.src} className={styles.slide}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </li>
          ))}
        </ul>
        <ul className={styles.group} aria-hidden="true">
          {photos.map((photo) => (
            <li key={photo.src} className={styles.slide}>
              <img src={photo.src} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
