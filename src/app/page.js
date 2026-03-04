import Link from "next/link";
import Marquee from "../app/components/Marquee";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        {/* blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        {/* rings */}
        <div className={styles.rings} aria-hidden="true">
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
        </div>

        <p className={styles.eyebrow}>
          Full-Service Digital Agency · Cairo, Egypt
        </p>

        <h1 className={styles.title}>
          We Make
          <em>Brands</em>
          Unforgettable.
        </h1>

        <div className={styles.bottom}>
          <p className={styles.desc}>
            A creative partner for huge commercial brands in the Egyptian &amp;
            Middle East market — where creativity meets reality.
          </p>
          <Link href="/services" className={styles.btn}>
            Explore Work <span className={styles.arrow}>→</span>
          </Link>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          Scroll
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── QUICK INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introGrid}>
          <div>
            <p className="section-label">Who We Are</p>
            <h2 className={styles.introHeading}>
              Creativity meets <em>Reality</em>
            </h2>
            <p className={styles.introText}>
              Plus is a full-service digital agency and creative partner for
              major commercial brands in Egypt. We deliver integrated digital
              marketing for companies of all sizes.
            </p>
            <Link href="/about" className={styles.outlineBtn}>
              Learn More →
            </Link>
          </div>

          <div className={styles.statGrid}>
            {[
              { num: "10+", label: "Years Experience" },
              { num: "50+", label: "Brands Served" },
              { num: "100+", label: "Campaigns" },
              { num: "4", label: "Countries" },
            ].map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS STRIP ── */}
      <section className={styles.clients}>
        <p
          className="section-label"
          style={{ justifyContent: "center", marginBottom: "48px" }}
        >
          Brands We&apos;ve Worked With
        </p>
        <div className={styles.clientsGrid}>
          {[
            "Pepsi",
            "Mountain Dew",
            "Gatorade",
            "Cheetos",
            "Persil",
            "Aquafina",
            "Orange",
            "Danone HiPRO",
          ].map((name) => (
            <div key={name} className={styles.clientCell}>
              <span className={styles.clientName}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
    </>
  );
}
