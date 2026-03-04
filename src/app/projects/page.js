import styles from "./page.module.css";

export const metadata = {
  title: "Projects | Plus Creative Studio",
};

// TODO: replace with Firestore fetch
// e.g. const projects = await getDocs(collection(db, 'projects'))
const projects = [
  {
    id: 1,
    client: "Pepsi",
    category: "Social Media · ATL Campaign",
    title: "Champions League Campaign",
    bg: "#1a3a6b",
  },
  {
    id: 2,
    client: "Mountain Dew",
    category: "Event Activation",
    title: "Cap is Your Ticket — Global Village",
    bg: "#1a3d0a",
  },
  {
    id: 3,
    client: "Cheetos",
    category: "Social Media",
    title: "Cheetos Museum",
    bg: "#7a2c00",
  },
  {
    id: 4,
    client: "Gatorade",
    category: "ATL Campaign",
    title: "Make Them Sweat",
    bg: "#0d0d0d",
  },
  {
    id: 5,
    client: "Hawana Salalah",
    category: "Digital Marketing",
    title: "Luxury Coastal Resort",
    bg: "#0a3040",
  },
  {
    id: 6,
    client: "Memaar Almorshedy",
    category: "Branding · Social Media",
    title: "Zahra by the Sea",
    bg: "#1c2744",
  },
  {
    id: 7,
    client: "7Up",
    category: "BTL Campaign · Event",
    title: "Fido Food Area Activation",
    bg: "#0d3d1a",
  },
  {
    id: 8,
    client: "Egyptian FA",
    category: "Social Media · Statistics",
    title: "Egyptian Premier League",
    bg: "#3d0a0a",
  },
  {
    id: 9,
    client: "Persil",
    category: "ATL Campaign",
    title: "Lavender Freshness",
    bg: "#2d0a40",
  },
];

const clients = [
  "Pepsi",
  "Mountain Dew",
  "Gatorade",
  "7Up",
  "Aquafina",
  "Cheetos",
  "Shipsies",
  "Great Foods",
  "Vine Café",
  "Semsema",
  "Persil",
  "Danone HiPRO",
  "Topfruit",
  "Egyptian FA",
  "Memaar Almorshedy",
  "Hawana Salalah",
  "Jebel Sifah",
  "Orange",
];

export default function Projects() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>04 — Our Work</p>
        <h1 className={styles.title}>
          Featured <em>Projects</em>
        </h1>
      </section>

      {/* PROJECTS GRID */}
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
              {/* placeholder visual — replace with <Image> when you have project images */}
              <div className={styles.cardBg} aria-hidden="true">
                <span className={styles.cardBgText}>{p.client}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CLIENTS */}
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
