"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useState , useRef} from "react";
import styles from "./Navbar.module.css";

const DARK_HERO_PAGES = new Set(["/", "/about", "/services", "/contact"]);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/projects", label: t("projects") },
  ];

  const heroDark = DARK_HERO_PAGES.has(pathname);

  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchLocale(newLocale) {
    router.replace(pathname, { locale: newLocale });
  }

  const theme = menuOpen
    ? "menu-open"
    : scrolled
      ? "scrolled"
      : heroDark
        ? "on-dark"
        : "default";

  return (
    <>
      <nav className={styles.nav} data-theme={theme}>
        <Link
          href="/"
          className={styles.logo}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className={`${styles.logoImgWrap} ${styles[`logoImgWrap--${theme}`] || ""}`}
          >
            <Image
              src="/plus.png"
              alt="Plus Creative Studio"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </Link>

        <ul className={styles.links}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${pathname === href ? styles.active : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className={styles.ctaBtn}>
              {t("connect")}
            </Link>
          </li>
          <li className={styles.langSwitch}>
            <button
              className={locale === "en" ? styles.langActive : styles.langBtn}
              onClick={() => switchLocale("en")}
            >
              EN
            </button>
            <span className={styles.langDivider}>/</span>
            <button
              className={locale === "it" ? styles.langActive : styles.langBtn}
              onClick={() => switchLocale("it")}
            >
              IT
            </button>
          </li>
        </ul>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.isOpen : ""}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
        <div className={styles.panel}>
          <div className={styles.panelLinks}>
            {links.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                className={`${styles.panelLink} ${pathname === href ? styles.panelLinkActive : ""}`}
                style={{ transitionDelay: menuOpen ? `${i * 55}ms` : "0ms" }}
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.panelNum}>0{i + 1}</span>
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={styles.panelCta}
              style={{
                transitionDelay: menuOpen ? `${links.length * 55}ms` : "0ms",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {t("connect")} →
            </Link>
          </div>

          <div className={styles.panelLangSwitch}>
            <button
              className={locale === "en" ? styles.langActive : styles.langBtn}
              onClick={() => switchLocale("en")}
            >
              EN
            </button>
            <span className={styles.langDivider}>/</span>
            <button
              className={locale === "it" ? styles.langActive : styles.langBtn}
              onClick={() => switchLocale("it")}
            >
              IT
            </button>
          </div>

          <div className={styles.panelFooter}>
            <span>Plus Creative Studio</span>
            <span>Cairo, Egypt · 01118887031</span>
          </div>
        </div>
      </div>
    </>
  );
}