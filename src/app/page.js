"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Marquee from "../app/components/Marquee";
import styles from "./page.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import LogoMarquee from "./components/LogoMarquee";
!gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero title — chars drift up one by one, silky slow ──
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

      // ── Hero desc — slow fade up ──
      gsap.fromTo(
        ".hero-desc",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.9 },
      );

      // ── Hero button — elegant fade ──
      gsap.fromTo(
        ".hero-btn",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 1.1 },
      );

      // ── Scroll hint — soft breathe loop ──
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

      // ── Section label line — grows in ──
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

      // ── Headings — lines reveal upward ──
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

      // ── Text paragraphs — gentle fade ──
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

      // ── Stats — stagger up on scroll ──
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

      // ── Clients — slow diagonal wave ──
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

  return (
    <div ref={rootRef}>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.rings} aria-hidden="true">
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
        </div>

        <h1 className={`${styles.title} hero-title`}>
          We Make
          <em>Brands</em>
          Unforgettable.
        </h1>

        <div className={styles.bottom}>
          <p className={`${styles.desc} hero-desc`}>
            Full-Service Digital Agency · Cairo, Egypt A creative partner for
            huge commercial brands in the Egyptian &amp; Middle East market —
            where creativity meets reality.
          </p>
          <Link href="/services" className={`${styles.btn} hero-btn`}>
            Explore Work <span className={styles.arrow}>→</span>
          </Link>
        </div>

        <div className={`${styles.scrollHint} scroll-hint`} aria-hidden="true">
          Scroll
        </div>
      </section>
      <Marquee />
      {/* ── INTRO ── */}
      <section className={styles.intro}>
        <div className={styles.introGrid}>
          <div>
            <p className="section-label gsap-label">Who We Are</p>
            <h2 className={`${styles.introHeading} gsap-heading`}>
              Creativity meets <em>Reality</em>
            </h2>
            <p className={`${styles.introText} gsap-text`}>
              Plus is a full-service digital agency and creative partner for
              major commercial brands in Egypt. We deliver integrated digital
              marketing for companies of all sizes.
            </p>
            <Link href="/about" className={`${styles.outlineBtn} gsap-text`}>
              Learn More →
            </Link>
          </div>

          <div className={styles.statGrid}>
            {[
              { num: "10+", label: "Years Experience" },
              { num: "50+", label: "Brands Served" },
              { num: "100+", label: "Campaigns" },
              { num: "4", label: "Countries" },
            ].map((s) => (
              <div key={s.label} className={`${styles.stat} gsap-stat`}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── CLIENTS ── */}
      <section className={`${styles.clients} gsap-clients`}>
        <p
          className="section-label gsap-label"
          style={{ justifyContent: "center", marginBottom: "48px" }}
        >
          Brands We&apos;ve Worked With
        </p>
        <LogoMarquee />
      </section>
    </div>
  );
}
