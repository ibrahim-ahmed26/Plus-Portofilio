import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Design & Branding",
  "Digital Marketing",
  "Social Media",
  "Event Management",
  "Media Production",
  "UI & UX Design",
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/plus.creativestudio",
    handle: "@plus.creativestudio",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/plus.creativestudio/",
    handle: "plus.creativestudio",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@plus.eg",
    handle: "@plus.eg",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/plus-creativestudio",
    handle: "plus-creativestudio",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* ── TOP CTA BAND ── */}
      <div className={styles.ctaBand}>
        <div className={styles.ctaLeft}>
          <p className={styles.ctaEyebrow}>Ready to start?</p>
          <h2 className={styles.ctaHeading}>
            Let&apos;s build something <em>great.</em>
          </h2>
        </div>
        <Link href="/contact" className={styles.ctaBtn}>
          Start a Project →
        </Link>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className={styles.main}>
        {/* Brand column */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoImgWrap}>
              <Image
                src="/plus.png"
                alt="Plus Creative Studio"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
          <p className={styles.tagline}>
            A full-service digital agency and creative partner for major brands
            in Egypt &amp; the Middle East.
          </p>
          <div className={styles.contact}>
            <a href="tel:01118887031" className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              01118887031
            </a>
            <a
              href="mailto:INFO.PLUSCREATIVESTUDIO@gmail.com"
              className={styles.contactItem}
            >
              <span className={styles.contactIcon}>✉</span>
              INFO.PLUSCREATIVESTUDIO@gmail.com
            </a>
            <span className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              Cairo, Egypt
            </span>
          </div>
        </div>

        {/* Navigation column */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Navigation</h3>
          <ul className={styles.colLinks}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={styles.colLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services column */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Services</h3>
          <ul className={styles.colLinks}>
            {services.map((s) => (
              <li key={s}>
                <Link href="/services" className={styles.colLink}>
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials column */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Follow Us</h3>
          <ul className={styles.colLinks}>
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.colLink}
                >
                  <span className={styles.socialLabel}>{s.label}</span>
                  <span className={styles.socialHandle}>{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {year} Plus Creative Studio. All rights reserved.
        </p>
        <p className={styles.madein}>Made with ✦ in Cairo</p>
      </div>
    </footer>
  );
}
