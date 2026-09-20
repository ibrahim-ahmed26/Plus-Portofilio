import styles from "./loading.module.css";

export default function ProjectsLoading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.rings} aria-hidden="true">
        <div className="ring" />
        <div className="ring" />
        <div className="ring" />
        <div className="ring" />
        <div className="ring" />
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>04 — Our Work</p>
        <h1 className={styles.title}>
          Featured <em>Projects</em>
        </h1>
        <div className={styles.barTrack}>
          <div className={styles.bar} />
        </div>
        <p className={styles.hint}>Loading projects...</p>
      </div>
    </div>
  );
}
