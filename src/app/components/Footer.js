"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./Footer.module.css";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/contact", key: "contact" },
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

// ── Rotating CTA background images ──
const ctaBgImages = [
  "/Artboard.png",
  "/Artboard2.png",
  "/Artboard3.png",
  "/Artboard4.png",
];

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % ctaBgImages.length);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={styles.footer}>
      {/* ── TOP CTA BAND ── */}
      <div className={styles.ctaBand}>
        <div className={styles.ctaBg}>
          {ctaBgImages.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="brands Images"
              fill
              style={{ objectFit: "cover" }}
              priority={i === 0}
              className={`${styles.ctaBgImg} ${i === bgIndex ? styles.ctaBgImgActive : ""
                }`}
            />
          ))}
          <div className={styles.ctaOverlay} />
        </div>

        <div className={styles.ctaLeft}></div>
        <Link href="/contact" className={styles.ctaBtn}>
          {t("cta")} →
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
          <p className={styles.tagline}>{t("tagline")}</p>
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
          <h3 className={styles.colTitle}>{t("navigation")}</h3>
          <ul className={styles.colLinks}>
            {navLinks.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className={styles.colLink}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services column */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>{t("services")}</h3>
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
          <h3 className={styles.colTitle}>{t("followUs")}</h3>
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

        {/* ── BOTTOM BAR ── */}
        <div className={styles.bottom} >
          <p className={styles.copy}>
            © {year} Plus Creative Studio. {t("rights")}
          </p>
          <p className={styles.madein}>{t("madeIn")}</p>
        </div >
      </div>
    </footer >
  );
}