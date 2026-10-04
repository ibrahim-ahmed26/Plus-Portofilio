import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";
import AboutAnimations from "../../components/AboutAnimations";

export const metadata = {
  title: "About Us | Plus Creative Studio",
};

export default async function About() {
  const t = await getTranslations("about");

  const values = [
    { icon: "✦", title: t("value1Title"), desc: t("value1Desc") },
    { icon: "◈", title: t("value2Title"), desc: t("value2Desc") },
    { icon: "◉", title: t("value3Title"), desc: t("value3Desc") },
    { icon: "▲", title: t("value4Title"), desc: t("value4Desc") },
  ];

  const stats = [
    { num: t("stat1Num"), label: t("stat1Label") },
    { num: t("stat2Num"), label: t("stat2Label") },
    { num: t("stat3Num"), label: t("stat3Label") },
    { num: t("stat4Num"), label: t("stat4Label") },
  ];

  return (
    <>
      <AboutAnimations />
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/who_we_ares.png"
            alt=""
            fill
            quality={90}
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className={styles.heroOverlay} />

        <p className={`${styles.eyebrow} about-eyebrow`}>{t("heroEyebrow")}</p>
        <h1 className={`${styles.title} about-title`}>
          {t("heroTitle")} <em>{t("heroTitleEm")}</em>
        </h1>
      </section>
      <section className={styles.story}>
        <div className={styles.storyGrid}>
          <div>
            <p className="section-label about-story-label">{t("storyLabel")}</p>
            <h2 className={`${styles.storyHeading} about-story-heading`}>
              {t("storyHeading")} <em>{t("storyHeadingEm")}</em>{" "}
              {t("storyHeadingEnd")}
            </h2>
          </div>
          <div>
            <p className={`${styles.storyText} about-story-text`}>
              {t("storyText1")}
            </p>
            <p className={`${styles.storyText} about-story-text`}>
              {t("storyText2")}
            </p>
          </div>
        </div>
      </section>
      <section className={styles.vision}>
        <div className={styles.visionBg}>
          <Image
            src="/our vision_.png"
            alt="Our Vision"
            fill
            quality={90}
            size="(max-width: 768px) 100vw, 50vw"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.visionOverlay} />

        <div className={styles.visionInner}>
          <blockquote className={`${styles.visionQuote} about-vision`}>
            {t("visionQuoteStart")} <em>{t("visionQuoteEm")}</em>{" "}
            {t("visionQuoteEnd")}
          </blockquote>
        </div>
      </section>
      <section className={styles.values}>
        <p className="section-label">{t("valuesLabel")}</p>
        <h2 className={styles.valuesHeading}>
          {t("valuesHeading")} <em>{t("valuesHeadingEm")}</em>
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
      <section className={`${styles.stats} about-stats`}>
        {stats.map((s) => (
          <div key={s.label} className={`${styles.statItem} about-stat`}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>
    </>
  );
}