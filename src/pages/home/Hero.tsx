import heroImage from "@/assets/images/hero.png";
import heroTitle from "@/assets/images/hero-title.png";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { home } from "@/content/home";
import { cx } from "@/lib/cx";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero } = home;
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <h1 id="hero-title">
            <img className={styles.title} src={heroTitle} alt={hero.title} />
          </h1>
          <p className={cx("type-subtitle", styles.tagline)}>{hero.tagline}</p>
        </div>

        <div className={styles.prompt}>
          <p className={cx("type-body", styles.promptText)}>{hero.prompt}</p>
          <Button variant="secondary" size="lg" to={hero.cta.to}>
            {hero.cta.label}
          </Button>
        </div>
      </Container>

      <img
        className={styles.photo}
        src={heroImage}
        alt={hero.imageAlt}
        width={1300}
        height={790}
        fetchPriority="high"
      />
    </section>
  );
}
