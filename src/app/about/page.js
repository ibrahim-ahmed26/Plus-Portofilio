import Image from "next/image";
import styles from "./page.module.css";
import AboutAnimations from "../components/AboutAnimations";

export const metadata = {
  title: "About Us | Plus Creative Studio",
};

const values = [
  {
    icon: "✦",
    title: "Creativity First",
    desc: "Every brief is a blank canvas. We push past the obvious to find ideas that are genuinely surprising.",
  },
  {
    icon: "◈",
    title: "Reality in Execution",
    desc: "Great ideas only matter when they work. We obsess over craft, detail, and flawless delivery.",
  },
  {
    icon: "◉",
    title: "Rooted in Culture",
    desc: "We understand the Egyptian and Arab market deeply — the nuance, the humor, and the emotional pulse.",
  },
  {
    icon: "▲",
    title: "Partnership Mindset",
    desc: "We work as an extension of your team, not just a vendor. Your growth is our growth.",
  },
];

export default function About() {
  return (
    <>
      <AboutAnimations />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/who_we_are.png"
            alt=""
            fill
            quality={90}
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>

      {/* STORY */}
      <section className={styles.story}>
        <div className={styles.storyGrid}>
          <div>
            <p className="section-label about-story-label">Our Story</p>
            <h2 className={`${styles.storyHeading} about-story-heading`}>
              Built on the belief that <em>creativity and reality</em>{" "}
              aren&apos;t opposites.
            </h2>
          </div>
          <div>
            <p className={`${styles.storyText} about-story-text`}>
              Plus Creative Studio was born from a simple but powerful idea:
              that the best creative work doesn&apos;t just look stunning — it
              works. We are a full-service digital agency and creative partner
              for major commercial brands in the Egyptian market.
            </p>
            <p className={`${styles.storyText} about-story-text`}>
              Our team combines diverse experiences, creative ambition, and a
              deep understanding of the Egyptian and Middle Eastern market. From
              Pepsi to Gatorade, from real estate to football — we&apos;ve built
              campaigns that move markets and minds.
            </p>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className={styles.vision}>
        <div className={styles.visionBg}>
          <Image
            src="/our_vision.png"
            alt="Our Vision"
            fill
            quality={90}
            size="(max-width: 768px) 100vw, 50vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>

      {/* VALUES */}
      <section className={styles.values}>
        <p className="section-label">What We Stand For</p>
        <h2 className={styles.valuesHeading}>
          Our <em>Values</em>
        </h2>
        <div className={`${styles.valuesGrid} about-values-grid`}>
          {values.map((v, i) => (
            <div key={i} className={`${styles.valueCard} about-value-card`}>
              <div className={styles.valueIcon}>{v.icon}</div>
              <h3 className={styles.valueName}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className={`${styles.stats} about-stats`}>
        {[
          { num: "10+", label: "Years in the market" },
          { num: "50+", label: "Brands partnered" },
          { num: "100+", label: "Campaigns launched" },
          { num: "4", label: "Countries reached" },
        ].map((s) => (
          <div key={s.label} className={`${styles.statItem} about-stat`}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>
    </>
  );
}
