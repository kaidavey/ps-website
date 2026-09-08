import { Container } from '@/components/layout/Container'
import { CallToAction } from '@/components/sections/CallToAction'
import { Events } from '@/components/sections/Events'
import { Hero } from '@/components/sections/Hero'
import { Intro } from '@/components/sections/Intro'
import { Newsletter } from '@/components/sections/Newsletter'
import { Pillars } from '@/components/sections/Pillars'
import { cx } from '@/lib/cx'
import styles from './HomePage.module.css'

/**
 * Home page — composition only.
 *
 * Every section owns its own layout and content; this file's single job is
 * the order they appear in and the rhythm between them.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Container as="div" size="wide" className={cx(styles.content)}>
        <Intro />
        <Pillars />
        <CallToAction />
        <Events />
        <Newsletter />
      </Container>
    </>
  )
}
