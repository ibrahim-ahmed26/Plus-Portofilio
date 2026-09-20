"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./ClientsMarquee.module.css";

export default function ClientsMarquee({ clients }) {
  const t = useTranslations("projects");

  const mid = Math.ceil(clients.length / 2);
  const row1 = clients.slice(0, mid);
  const row2 = clients.slice(mid);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        {t("partnersHeading")} <em>{t("partnersHeadingEm")}</em>
      </h2>

      {/* Row 1 — scrolls left */}
      <div className={styles.track}>
        <div className={`${styles.rail} ${styles.left}`}>
          {[...row1, ...row1, ...row1].map((client, i) => (
            <div key={`r1-${i}`} className={styles.item}>
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={120}
                  height={40}
                  className={styles.logo}
                  unoptimized
                />
              ) : (
                <>
                  <span className={styles.dot} />
                  <span className={styles.name}>{client.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className={styles.track}>
        <div className={`${styles.rail} ${styles.right}`}>
          {[...row2, ...row2, ...row2].map((client, i) => (
            <div key={`r2-${i}`} className={styles.item}>
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={120}
                  height={40}
                  className={styles.logo}
                  unoptimized
                />
              ) : (
                <>
                  <span className={styles.dot} />
                  <span className={styles.name}>{client.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}