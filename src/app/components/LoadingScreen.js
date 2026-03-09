"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState("idle"); // idle → reveal → tagline → exit → hidden
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 300);
    const t2 = setTimeout(() => setPhase("tagline"), 1200);
    const t3 = setTimeout(() => setPhase("exit"), 2600);
    const t4 = setTimeout(() => {
      setPhase("hidden");
      onComplete?.();
    }, 3400);

    // Animate progress bar
    let start = null;
    const duration = 2200;
    const animateProgress = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(pct));
      if (pct < 100) requestAnimationFrame(animateProgress);
    };
    const rafId = requestAnimationFrame(animateProgress);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (phase === "hidden") return null;

  const isRevealed =
    phase === "reveal" || phase === "tagline" || phase === "exit";

  return (
    <div className={`${styles.screen} ${phase === "exit" ? styles.exit : ""}`}>
      {/* Spinning background rings — exactly as before */}
      <div className={styles.rings} aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`${styles.ring} ${styles[`ring${n}`]}`} />
        ))}
      </div>

      {/* Logo + tagline */}
      <div className={styles.wordWrap}>
        <div
          className={`${styles.logoBox} ${isRevealed ? styles.logoRevealed : ""}`}
        >
          <Image
            src="/plus.png"
            alt="Plus Creative Studio"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <p
          className={`${styles.tagline} ${phase === "tagline" || phase === "exit" ? styles.taglineVisible : ""}`}
        >
          Creative Studio
        </p>
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
