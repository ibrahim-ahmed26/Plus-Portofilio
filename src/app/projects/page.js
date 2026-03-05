import { collection, getDocs } from "firebase/firestore";
import styles from "./page.module.css";
import { db } from "../lib/firebase";

export const metadata = {
  title: "Projects | Plus Creative Studio",
};

export default async function Projects() {
  const [projectsSnap, clientsSnap] = await Promise.all([
    getDocs(collection(db, "projects")),
    getDocs(collection(db, "clients")),
  ]);

  const projects = projectsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const clients = clientsSnap.docs.map((doc) => doc.data().name);

  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>04 — Our Work</p>
        <h1 className={styles.title}>
          Featured <em>Projects</em>
        </h1>
      </section>

      <section className={styles.projectsSection}>
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={`${styles.card} ${i === 0 || i === 5 ? styles.wide : ""}`}
              style={{ "--card-bg": p.bg }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardContent}>
                  <span className={styles.cardCategory}>{p.category}</span>
                  <h2 className={styles.cardTitle}>{p.title}</h2>
                  <span className={styles.cardClient}>{p.client}</span>
                </div>
              </div>
              <div className={styles.cardBg} aria-hidden="true">
                <span className={styles.cardBgText}>{p.client}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.clients}>
        <p className="section-label">Clients We&apos;ve Served</p>
        <h2 className={styles.clientsHeading}>
          Some of Our <em>Partners</em>
        </h2>
        <div className={styles.clientsGrid}>
          {clients.map((name) => (
            <div key={name} className={styles.clientCell}>
              <span className={styles.clientName}>{name}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
