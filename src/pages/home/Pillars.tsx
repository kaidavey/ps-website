import laptopFrame from '@/assets/images/pillar-projects-laptop.png'
import laptopScreen from '@/assets/images/pillar-projects-screen.jpg'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { home } from '@/content/home'
import styles from './Pillars.module.css'
import { ProjectShapes } from './ProjectShapes'

export function Pillars() {
  return (
    <Section id="how-it-works" aria-labelledby="how-it-works-title">
      <SectionHeader id="how-it-works-title" title={home.howItWorks.title} subtitle={home.howItWorks.subtitle} />
      <ul className={styles.grid}>
        {home.pillars.map((pillar) => (
          <li key={pillar.title} className={styles.card}>
            <div className={styles.media}>
              {pillar.image ? <img src={pillar.image} alt="" loading="lazy" /> : <ProjectArt />}
            </div>
            <div className={styles.text}>
              <h3 className="type-body-strong">{pillar.title}</h3>
              <p className="type-body">{pillar.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Laptop showing a client deliverable, peeking in from the card's edge. */
function ProjectArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <div className={styles.laptop}>
        <img src={laptopFrame} alt="" loading="lazy" />
        <img src={laptopScreen} alt="" loading="lazy" className={styles.screen} />
      </div>
      <ProjectShapes className={styles.shapes} />
    </div>
  )
}
