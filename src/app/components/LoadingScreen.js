"use client";
import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

// "PLUS" splits into individual letters that fill with color
const LETTERS = ["P", "L", "U", "S"];

export default function LoadingScreen() {
  const [phase, setPhase] = useState("intro"); // intro → filling → done
  const [filled, setFilled] = useState(-1); // which letter index is filled
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // start filling letters one by one
    const t0 = setTimeout(() => setPhase("filling"), 400);

    const timers = LETTERS.map((_, i) =>
      setTimeout(() => setFilled(i), 500 + i * 260),
    );

    // after all letters filled, slide the screen up and away
    const tDone = setTimeout(
      () => setPhase("done"),
      500 + LETTERS.length * 260 + 300,
    );
    const tHidden = setTimeout(
      () => setHidden(true),
      500 + LETTERS.length * 260 + 900,
    );

    return () => {
      clearTimeout(t0);
      timers.forEach(clearTimeout);
      clearTimeout(tDone);
      clearTimeout(tHidden);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`${styles.screen} ${phase === "done" ? styles.exit : ""}`}>
      {/* background rings */}
      <div className={styles.rings} aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`${styles.ring} ${styles[`ring${n}`]}`} />
        ))}
      </div>

      {/* letters */}
      <div className={styles.wordWrap}>
        <div className={styles.word}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className={`${styles.letter} ${filled >= i ? styles.letterFilled : ""}`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {/* outline version always visible */}
              <span className={styles.letterOutline}>{letter}</span>
              {/* filled version clips in */}
              <span className={styles.letterFill}>{letter}</span>
            </span>
          ))}
        </div>

        <p
          className={`${styles.tagline} ${phase === "filling" ? styles.taglineVisible : ""}`}
        >
          Creative Studio
        </p>
      </div>

      {/* progress bar */}
      <div className={styles.progressWrap}>
        <div
          className={styles.progressBar}
          style={{
            width: `${
              phase === "filling"
                ? Math.round(((filled + 1) / LETTERS.length) * 100)
                : phase === "done"
                  ? 100
                  : 0
            }%`,
          }}
        />
      </div>
    </div>
  );
}
