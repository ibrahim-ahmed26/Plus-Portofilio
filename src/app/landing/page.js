"use client";
import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "./landing.module.css";

const services = [
  {
    icon: "✦",
    name: "Design & Branding",
    desc: "Visual identity systems, logo design, and brand guidelines that make you unforgettable.",
  },
  {
    icon: "◈",
    name: "Digital Marketing",
    desc: "Integrated campaigns across every channel that turn attention into growth.",
  },
  {
    icon: "◉",
    name: "Social Media Management",
    desc: "Strategic content and community management that builds real engagement.",
  },
  {
    icon: "▲",
    name: "Event Management",
    desc: "Full event planning and activations that create unforgettable brand experiences.",
  },
  {
    icon: "◆",
    name: "Media Production",
    desc: "Video, photography, and content that tells your story with real impact.",
  },
  {
    icon: "●",
    name: "UI & UX Design",
    desc: "Interfaces that are as functional as they are beautiful.",
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startTime = Date.now();
    let visitId = null;

    addDoc(collection(db, "landing_visits"), {
      timestamp: new Date(),
      referrer: document.referrer || null,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      fbclid: params.get("fbclid"),
      userAgent: navigator.userAgent,
    })
      .then((docRef) => {
        visitId = docRef.id;
      })
      .catch(() => {});

    function sendDuration() {
      if (!visitId) return;
      const duration = Math.round((Date.now() - startTime) / 1000); // seconds
      const payload = JSON.stringify({ visitId, duration });
      navigator.sendBeacon(
        "/api/landing-track-duration",
        new Blob([payload], { type: "application/json" }),
      );
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") sendDuration();
    });
    window.addEventListener("pagehide", sendDuration);

    return () => {
      window.removeEventListener("pagehide", sendDuration);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      await addDoc(collection(db, "landing_leads"), {
        ...form,
        submittedAt: new Date(),
      });

      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead");
      }

      await fetch("/api/landing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>

      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroBlob1} />
          <div className={styles.heroBlob2} />
          <Reveal className={styles.heroContent}>
            <p className={styles.eyebrow}>Plus Creative Studio</p>
            <h1 className={styles.heroTitle}>
              We Make Brands <em>Unforgettable.</em>
            </h1>
            <p className={styles.heroSubtitle}>
              Full-service digital agency and creative partner for major brands
              in Egypt &amp; the Middle East. Tell us about your project —
              we&apos;ll get back to you within 24 hours.
            </p>
            <a href="#contact" className={styles.heroBtn}>
              Start Your Project →
            </a>
          </Reveal>
        </section>

        {/* WHO WE ARE */}
        <section className={styles.who}>
          <Reveal>
            <p className={styles.sectionLabel}>Who We Are</p>
            <h2 className={styles.sectionHeading}>
              Creativity meets <em>Reality</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className={styles.whoText}>
              Plus is a full-service digital agency and creative partner for
              major commercial brands in Egypt. We deliver integrated digital
              marketing for companies of all sizes — combining bold ideas with
              flawless execution to build brands that actually move markets and
              minds.
            </p>
          </Reveal>
          <div className={styles.statGrid}>
            {[
              { num: "10+", label: "Years Experience" },
              { num: "50+", label: "Brands Served" },
              { num: "100+", label: "Campaigns" },
              { num: "4", label: "Countries" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className={styles.services}>
          <Reveal>
            <p className={styles.sectionLabel}>What We Do</p>
            <h2 className={styles.sectionHeading}>
              Our <em>Services</em>
            </h2>
          </Reveal>
          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <Reveal
                key={s.name}
                delay={i * 70}
                className={styles.serviceCard}
              >
                <span className={styles.serviceIcon}>{s.icon}</span>
                <h3 className={styles.serviceName}>{s.name}</h3>
                <p className={styles.serviceDesc}>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className={styles.contact} id="contact">
          <Reveal className={styles.contactInner}>
            <div className={styles.contactLeft}>
              <p
                className={styles.sectionLabel}
                style={{ color: "rgba(245,240,220,0.6)" }}
              >
                Let&apos;s Talk
              </p>
              <h2 className={styles.contactHeading}>
                Ready to build <em>something great?</em>
              </h2>
              <p className={styles.contactText}>
                Fill out the form and our team will reach out within 24 hours to
                discuss your project.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                required
                className={styles.input}
                placeholder="Your Name"
                value={form.name}
                onChange={update("name")}
              />
              <input
                required
                type="email"
                className={styles.input}
                placeholder="Email Address"
                value={form.email}
                onChange={update("email")}
              />
              <input
                className={styles.input}
                placeholder="Phone Number"
                value={form.phone}
                onChange={update("phone")}
              />
              <textarea
                required
                className={styles.textarea}
                placeholder="Tell us about your project..."
                value={form.message}
                onChange={update("message")}
              />
              <button
                type="submit"
                className={styles.submit}
                disabled={status === "loading"}
              >
                {status === "loading" && "Sending..."}
                {status === "success" && "✓ Sent! We'll be in touch."}
                {status === "error" && "Error — Try Again"}
                {status === "idle" && "Send Message →"}
              </button>
            </form>
          </Reveal>
        </section>

        <footer className={styles.footer}>
          <p>
            © {new Date().getFullYear()} Plus Creative Studio · Cairo, Egypt
          </p>
        </footer>
      </main>
    </>
  );
}
