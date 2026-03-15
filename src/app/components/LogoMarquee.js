// components/LogoMarquee.js
import styles from "./LogoMarquee.module.css";

const row1 = [
  {
    name: "Pepsi",
    mark: (
      <svg viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="14"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <line x1="6" y1="20" x2="34" y2="20" stroke="#e83e0b" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" fill="#e83e0b" />
      </svg>
    ),
  },
  {
    name: "Mountain Dew",
    mark: (
      <svg viewBox="0 0 40 40">
        <polygon
          points="20,4 32,26 20,34 8,26"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <polygon points="20,12 28,25 20,30 12,25" fill="#e83e0b" />
      </svg>
    ),
  },
  {
    name: "Gatorade",
    mark: (
      <svg viewBox="0 0 40 40">
        <path
          d="M14,4 L24,4 L18,18 L26,18 L12,36 L16,22 L8,22 Z"
          fill="#e83e0b"
        />
      </svg>
    ),
  },
  {
    name: "Cheetos",
    mark: (
      <svg viewBox="0 0 40 40">
        <ellipse
          cx="18"
          cy="20"
          rx="10"
          ry="7"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <ellipse cx="18" cy="20" rx="5" ry="3.5" fill="#e83e0b" />
        <path
          d="M26,15 Q34,10 31,20 Q34,30 26,25"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Persil",
    mark: (
      <svg viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="14" fill="#1a1209" />
        <circle cx="20" cy="20" r="8" fill="#e83e0b" />
        <circle cx="20" cy="20" r="3" fill="#f5f0dc" />
      </svg>
    ),
  },
  {
    name: "Aquafina",
    mark: (
      <svg viewBox="0 0 40 40">
        <path
          d="M6,24 Q14,8 20,18 Q26,28 34,12"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6,30 Q14,14 20,24 Q26,34 34,18"
          fill="none"
          stroke="rgba(232,62,11,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Orange",
    mark: (
      <svg viewBox="0 0 40 40">
        <rect x="8" y="12" width="24" height="16" rx="4" fill="#e83e0b" />
        <rect x="12" y="16" width="6" height="6" rx="1" fill="#f5f0dc" />
        <rect x="22" y="16" width="6" height="6" rx="1" fill="#f5f0dc" />
      </svg>
    ),
  },
  {
    name: "Danone",
    mark: (
      <svg viewBox="0 0 40 40">
        <path
          d="M12,30 L12,10 Q12,10 20,10 Q28,10 28,20 Q28,30 20,30 Z"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="4" fill="#e83e0b" />
      </svg>
    ),
  },
];

const row2 = [
  {
    name: "7Up",
    mark: (
      <svg viewBox="0 0 40 40">
        <text
          x="16"
          y="28"
          fontFamily="'Playfair Display',serif"
          fontSize="24"
          fontWeight="900"
          fill="#e83e0b"
        >
          7
        </text>
        <circle
          cx="28"
          cy="10"
          r="4"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    name: "Egyptian FA",
    mark: (
      <svg viewBox="0 0 40 40">
        <polygon
          points="20,4 23,14 34,14 25,21 28,31 20,25 12,31 15,21 6,14 17,14"
          fill="#e83e0b"
        />
      </svg>
    ),
  },
  {
    name: "Hawana",
    mark: (
      <svg viewBox="0 0 40 40">
        <path
          d="M8,26 Q8,10 20,10 Q32,10 32,26"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <line x1="6" y1="26" x2="34" y2="26" stroke="#e83e0b" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Memaar",
    mark: (
      <svg viewBox="0 0 40 40">
        <rect
          x="10"
          y="16"
          width="20"
          height="14"
          rx="1"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <rect x="16" y="22" width="8" height="8" fill="#e83e0b" />
        <line
          x1="14"
          y1="16"
          x2="14"
          y2="10"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <line
          x1="26"
          y1="16"
          x2="26"
          y2="10"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <line
          x1="14"
          y1="10"
          x2="26"
          y2="10"
          stroke="#e83e0b"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    name: "Shipsies",
    mark: (
      <svg viewBox="0 0 40 40">
        <path
          d="M4,24 L20,8 L36,24 L30,24 L30,32 L10,32 L10,24 Z"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Great Foods",
    mark: (
      <svg viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="14"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <path d="M11,20 Q20,10 29,20 Q20,30 11,20 Z" fill="#e83e0b" />
      </svg>
    ),
  },
  {
    name: "Semsema",
    mark: (
      <svg viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="16"
          r="8"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <circle cx="20" cy="16" r="3" fill="#e83e0b" />
        <line
          x1="20"
          y1="24"
          x2="20"
          y2="32"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <line
          x1="12"
          y1="28"
          x2="28"
          y2="28"
          stroke="#e83e0b"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    name: "Vine Café",
    mark: (
      <svg viewBox="0 0 40 40">
        <path
          d="M20,6 Q20,6 12,16 Q6,22 12,28 Q16,34 20,30 Q24,34 28,28 Q34,22 28,16 Z"
          fill="none"
          stroke="#e83e0b"
          strokeWidth="2"
        />
        <line
          x1="20"
          y1="30"
          x2="20"
          y2="36"
          stroke="#e83e0b"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

function LogoCard({ name, mark }) {
  return (
    <div className={styles.card}>
      <div className={styles.mark}>{mark}</div>
      <span className={styles.name}>{name}</span>
    </div>
  );
}

function MarqueeRow({ logos, reverse }) {
  return (
    <div className={styles.track}>
      <div className={`${styles.inner} ${reverse ? styles.reverse : ""}`}>
        {[...logos, ...logos].map((l, i) => (
          <LogoCard key={i} {...l} />
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <div className={styles.wrapper}>
      <MarqueeRow logos={row1} reverse={false} />
      <MarqueeRow logos={row2} reverse={true} />
    </div>
  );
}
