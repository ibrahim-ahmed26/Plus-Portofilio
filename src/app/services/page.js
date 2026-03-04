import styles from "./page.module.css";

export const metadata = {
  title: "Services | Plus Creative Studio",
};

// TODO: replace with Firestore fetch
// e.g. const services = await getDocs(collection(db, 'services'))
const services = [
  {
    num: "01",
    icon: "✦",
    name: "Design & Branding",
    desc: "Visual identity systems, logo design, brand guidelines, and packaging that make your brand instantly recognizable and emotionally resonant.",
    tags: ["Logo Design", "Brand Identity", "Packaging", "Guidelines"],
  },
  {
    num: "02",
    icon: "◈",
    name: "Digital Marketing",
    desc: "Targeted campaigns, media buying, and performance marketing that deliver measurable results across all digital channels.",
    tags: ["Media Buying", "Performance", "Analytics", "Targeting"],
  },
  {
    num: "03",
    icon: "◉",
    name: "Social Media",
    desc: "Strategic content creation, community management, and influencer campaigns that grow your presence and drive genuine engagement.",
    tags: ["Content Creation", "Community", "Influencers", "Strategy"],
  },
  {
    num: "04",
    icon: "▲",
    name: "Event Management",
    desc: "Full event planning, social event coverage, and outdoor activations that create unforgettable brand experiences.",
    tags: ["Planning", "Coverage", "OutDoor", "Activation"],
  },
  {
    num: "05",
    icon: "◇",
    name: "Media Production",
    desc: "Video production, photography, and creative content that tells your brand story with stunning visual impact.",
    tags: ["Video", "Photography", "Motion", "Content"],
  },
  {
    num: "06",
    icon: "⬡",
    name: "UI & UX Design",
    desc: "User-centered interface design and digital experience strategy that converts visitors into loyal customers.",
    tags: ["UI Design", "UX Research", "Prototyping", "Web"],
  },
];

export default function Services() {
  return (
    <>
      {/* PAGE HERO */}
      <section className={styles.hero}>
        <div className={styles.heroRings} aria-hidden="true">
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
        </div>
        <p className={styles.eyebrow}>03 — What We Do</p>
        <h1 className={styles.title}>
          Our <em>Services</em>
        </h1>
        <p className={styles.subtitle}>
          Comprehensive advertising solutions that keep pace with global and
          Egyptian market trends.
        </p>
      </section>

      {/* SERVICES GRID */}
      <section className={styles.grid}>
        {services.map((s, i) => (
          <article key={s.num} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.cardNum}>{s.num}</span>
              <span className={styles.cardIcon}>{s.icon}</span>
            </div>
            <h2 className={styles.cardName}>{s.name}</h2>
            <p className={styles.cardDesc}>{s.desc}</p>
            <ul className={styles.tags}>
              {s.tags.map((t) => (
                <li key={t} className={styles.tag}>
                  {t}
                </li>
              ))}
            </ul>
            <div className={styles.cardArrow}>→</div>
          </article>
        ))}
      </section>

      {/* PROCESS */}
      <section className={styles.process}>
        <p className="section-label">How We Work</p>
        <h2 className={styles.processHeading}>
          Our <em>Process</em>
        </h2>
        <div className={styles.processSteps}>
          {[
            {
              step: "01",
              title: "Discover",
              desc: "We dive deep into your brand, audience, and market to uncover the insight that drives everything.",
            },
            {
              step: "02",
              title: "Strategise",
              desc: "We build a clear creative strategy and campaign blueprint before a single pixel is designed.",
            },
            {
              step: "03",
              title: "Create",
              desc: "Our creative team brings the strategy to life with ideas that are bold, beautiful, and purposeful.",
            },
            {
              step: "04",
              title: "Launch",
              desc: "We execute with precision across every channel, measuring impact and optimising in real time.",
            },
          ].map((p) => (
            <div key={p.step} className={styles.processStep}>
              <span className={styles.processNum}>{p.step}</span>
              <h3 className={styles.processTitle}>{p.title}</h3>
              <p className={styles.processDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
