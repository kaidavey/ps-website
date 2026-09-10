import { Section } from '@/components/Section'
import { about } from '@/content/about'
import { cx } from '@/lib/cx'
import styles from './Mission.module.css'

export function Mission() {
  const { mission } = about
  return (
    <Section aria-labelledby="mission-title">
      <div className={styles.card}>
        <h2 id="mission-title" className="type-subtitle">
          {mission.title}
        </h2>
        <p className={cx('type-body', styles.body)}>{mission.body}</p>
      </div>

      <ul className={styles.photos}>
        {mission.photos.map((photo) => (
          <li key={photo.src}>
            <img src={photo.src} alt={photo.alt} className={styles.photo} loading="lazy" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
