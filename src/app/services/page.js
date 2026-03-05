import { db } from "../lib/firebase";
import styles from "./page.module.css";
import { collection, getDocs } from "firebase/firestore";

export const metadata = {
  title: "Services | Plus Creative Studio",
};

export default async function Services() {
  const snapshot = await getDocs(collection(db, "services"));
  const services = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return (
    <>
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
