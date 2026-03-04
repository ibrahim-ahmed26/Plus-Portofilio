import styles from "./Marquee.module.css";

const items = [
  "Design & Branding",
  "Digital Marketing",
  "Social Media",
  "Media Buying",
  "Event Management",
  "UI & UX",
  "Media Production",
  "Influencer Campaigns",
  "OutDoor",
  "ATL & BTL Campaigns",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.dot}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
