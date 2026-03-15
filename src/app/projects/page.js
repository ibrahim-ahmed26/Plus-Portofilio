import { collection, getDocs } from "firebase/firestore";
import styles from "./page.module.css";
import { db } from "../lib/firebase";
import ClientsMarquee from "../components/ClientsMarquee";
import ProjectsAnimations from "../components/ProjectAnimations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      <ProjectsAnimations />

      {/* Hero */}
      <section className={styles.hero}>
        <p className={`${styles.eyebrow} proj-eyebrow`}>04 — Our Work</p>
        <h1 className={`${styles.title} proj-title`}>
          Featured <em>Projects</em>
        </h1>
      </section>

      {/* Grid */}
      <section className={styles.projectsSection}>
        <div className={`${styles.grid} proj-grid`}>
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={`${styles.card} ${p.wide ? styles.wide : ""} proj-card`}
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

      {/* Clients */}
      <ClientsMarquee clients={clients} />
    </>
  );
}
