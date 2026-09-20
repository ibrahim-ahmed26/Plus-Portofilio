import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { db } from "../../lib/firebase";
import styles from "./page.module.css";
import { collection, getDocs } from "firebase/firestore";
import ServicesAnimations from "../../components/ServicesAnimations";

export const metadata = {
  title: "Services | Plus Creative Studio",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Services() {
  const t = await getTranslations("services");

  const snapshot = await getDocs(collection(db, "services"));
  const services = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const steps = [
    { step: "01", title: t("step1Title"), desc: t("step1Desc") },
    { step: "02", title: t("step2Title"), desc: t("step2Desc") },
    { step: "03", title: t("step3Title"), desc: t("step3Desc") },
    { step: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <>
      <ServicesAnimations />
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/our_service.png"
            alt="Services hero image"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>
      <section className={`${styles.grid} serv-grid`}>
        {services.map((s) => (
          <article key={s.num} className={`${styles.card} serv-card`}>
            {s.image && (
              <div className={styles.cardImageWrap}>
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.cardImageOverlay} />
              </div>
            )}

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
        <p className="section-label serv-process-label">{t("processLabel")}</p>
        <h2 className={`${styles.processHeading} serv-process-heading`}>
          {t("processHeading")} <em>{t("processHeadingEm")}</em>
        </h2>
        <div className={`${styles.processSteps} serv-process-steps`}>
          {steps.map((p) => (
            <div
              key={p.step}
              className={`${styles.processStep} serv-process-step`}
            >
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