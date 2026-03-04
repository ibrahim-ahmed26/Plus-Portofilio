"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
];

// Pages where the hero behind the navbar is dark/colored
// → links should be cream/white until user scrolls
const DARK_HERO_PAGES = new Set(["/", "/about", "/services", "/contact"]);

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const heroDark = DARK_HERO_PAGES.has(pathname);

  useEffect(() => {
    setMenuOpen(false);
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

  // Determine the visual "theme" of the navbar right now
  // menuOpen → always dark-panel mode (cream text, nav is transparent)
  // scrolled  → always light cream pill (dark text)
  // heroDark  → cream text on colored/dark hero
  // default   → dark text on cream page
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
          Pl<span>us</span>
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
              Connect
            </Link>
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
              Connect →
            </Link>
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
