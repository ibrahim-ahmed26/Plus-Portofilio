import styles from "./loading.module.css";

export default function ServicesLoading() {
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
        <p className={styles.eyebrow}>03 — What We Do</p>
        <h1 className={styles.title}>
          Our <em>Services</em>
        </h1>
        <div className={styles.barTrack}>
          <div className={styles.bar} />
        </div>
        <p className={styles.hint}>Loading services...</p>
      </div>
    </div>
  );
}
