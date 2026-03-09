"use client";
import styles from "./ClientsMarquee.module.css";

export default function ClientsMarquee({ clients }) {
  // Split clients into two rows
  const mid = Math.ceil(clients.length / 2);
  const row1 = clients.slice(0, mid);
  const row2 = clients.slice(mid);

  return (
    <section className={styles.section}>
      <p className="section-label" style={{ paddingLeft: "60px" }}>
        Clients We&apos;ve Served
      </p>
      <h2 className={styles.heading}>
        Some of Our <em>Partners</em>
      </h2>

      {/* Row 1 — scrolls left */}
      <div className={styles.track}>
        <div className={`${styles.rail} ${styles.left}`}>
          {/* Duplicate for seamless loop */}
          {[...row1, ...row1, ...row1].map((name, i) => (
            <div key={`r1-${i}`} className={styles.item}>
              <span className={styles.dot} />
              <span className={styles.name}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className={styles.track}>
        <div className={`${styles.rail} ${styles.right}`}>
          {[...row2, ...row2, ...row2].map((name, i) => (
            <div key={`r2-${i}`} className={styles.item}>
              <span className={styles.dot} />
              <span className={styles.name}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
