"use client";
import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Marquee from "../components/Marquee";
import styles from "./page.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ClientsSection from "../components/ClientsSections";
import Image from "next/image";
!gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  const rootRef = useRef(null);
  const t = useTranslations("home");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(".hero-title", { type: "lines" });
      gsap.fromTo(
        split.lines,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.6,
          ease: "power4.out",
          stagger: 0.18,
          delay: 0.3,
        },
      );

      gsap.fromTo(
        ".hero-desc",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.9 },
      );

      gsap.fromTo(
        ".hero-btn",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 1.1 },
      );

      gsap.fromTo(
        ".scroll-hint",
        { opacity: 0 },
        {
          opacity: 0.5,
          duration: 1.8,
          delay: 1.6,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        },
      );

      gsap.utils.toArray(".gsap-label").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });

      gsap.utils.toArray(".gsap-heading").forEach((el) => {
        const s = new SplitText(el, { type: "lines" });
        gsap.fromTo(
          s.lines,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      gsap.utils.toArray(".gsap-text").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });

      gsap.fromTo(
        ".gsap-stat",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".gsap-stat",
            start: "top 85%",
          },
        },
      );
      gsap.fromTo(
        ".gsap-client",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".gsap-clients",
            start: "top 85%",
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { num: t("stat1Num"), label: t("stat1Label") },
    { num: t("stat2Num"), label: t("stat2Label") },
    { num: t("stat3Num"), label: t("stat3Label") },
    { num: t("stat4Num"), label: t("stat4Label") },
  ];

  return (
    <div ref={rootRef}>
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/main_cover.png"
            alt="Main Cover"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div className={styles.bottom}>
          <Link href="/services" className={`${styles.btn} hero-btn`}>
            {t("heroBtn")} <span className={styles.arrow}>→</span>
          </Link>
        </div>
      </section>
      <Marquee />
      <section className={styles.intro}>
        <div className={styles.introGrid}>
          <div>
            <p className="section-label gsap-label">{t("introLabel")}</p>
            <h2 className={`${styles.introHeading} gsap-heading`}>
              {t("introHeading")} <em>{t("introHeadingEm")}</em>
            </h2>
            <p className={`${styles.introText} gsap-text`}>
              {t("introText")}
            </p>
            <Link href="/about" className={`${styles.outlineBtn} gsap-text`}>
              {t("learnMore")} →
            </Link>
          </div>

          <div className={styles.statGrid}>
            {stats.map((s) => (
              <div key={s.label} className={`${styles.stat} gsap-stat`}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.brandsBanner}>
          <Image
            src="/brands.png"
            alt="Brands We've Worked With"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section className={`${styles.clients} gsap-clients`}>
        <ClientsSection />
      </section>
    </div>
  );
}