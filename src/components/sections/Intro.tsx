import { getGallery } from '@/content'
import { cx } from '@/lib/cx'
import styles from './Intro.module.css'

/**
 * Introductory copy followed by the photo carousel.
 *
 * The photos come from the content layer, so the carousel takes however many
 * the CMS supplies — one, five, or twenty — without a code change.
 */
export function Intro() {
  const gallery = getGallery()

  return (
    <section className={cx(styles.intro)} aria-labelledby="intro-title">
      <div className={cx(styles.copy)}>
        <h2 id="intro-title">
          We are UCLA&rsquo;s chapter of Product Space, a nation-wide family of students
          passionate about digital product development.
        </h2>
        <p>
          We provide a year-long fellowship for aspiring product managers, product
          designers, and product marketers to learn from mentors and grow from
          industry-focused client projects.
        </p>
      </div>

      {gallery.length > 0 && (
        // A named landmark wrapping the list, rather than a role on the list
        // itself, so the list semantics a screen reader announces survive.
        // tabIndex makes the scroller reachable by keyboard (WCAG 2.1.1):
        // Chrome and Firefox focus scroll containers automatically, Safari
        // does not.
        <section
          className={cx(styles.carousel)}
          aria-label="Photos from Product Space events"
          tabIndex={0}
        >
          <ul role="list" className={cx(styles.track)}>
            {gallery.map((photo) => (
              <li key={photo.id} className={cx(styles.slide)}>
                <img
                  className={cx(styles.image)}
                  src={photo.image.src}
                  alt={photo.image.alt}
                  width={photo.image.width}
                  height={photo.image.height}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
