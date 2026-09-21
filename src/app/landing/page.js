"use client";
import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import styles from "./landing.module.css";

const painPoints = [
  "Your brand looks different everywhere",
  "You're spending on ads without knowing what's actually working",
  "Your content gets attention but doesn't drive business",
  "Your marketing feels disconnected from your business goals",
];

const offerings = [
  {
    icon: "✦",
    name: "Branding & Identity",
    desc: "Build a clear and memorable brand",
  },
  {
    icon: "◈",
    name: "Digital Marketing",
    desc: "Turn strategy into measurable growth",
  },
  {
    icon: "◉",
    name: "Social Media",
    desc: "Create content people actually engage with",
  },
  {
    icon: "▲",
    name: "Media Buying",
    desc: "Put your brand in front of the right audience",
  },
  {
    icon: "◆",
    name: "Production",
    desc: "Turn ideas into content that gets noticed",
  },
];

// Placeholder cases — replace with real client work
const cases = [
  {
    client: "Regional F&B Brand",
    challenge:
      "Inconsistent identity across channels was diluting brand recognition.",
    whatWeDid:
      "Rebuilt the visual identity system and rolled it out across every touchpoint.",
    result: "40% increase in brand recall within 3 months.",
  },
  {
    client: "E-commerce Retailer",
    challenge:
      "High ad spend with no clear read on what was actually converting.",
    whatWeDid:
      "Restructured media buying strategy and built a full-funnel tracking setup.",
    result: "2.3x return on ad spend within the first quarter.",
  },
  {
    client: "Real Estate Developer",
    challenge:
      "Social content had reach but wasn't generating qualified leads.",
    whatWeDid:
      "Redesigned content strategy around lead-gen, not just engagement.",
    result: "150+ qualified leads generated in 8 weeks.",
  },
];

const serviceOptions = [
  "Branding",
  "Digital Marketing",
  "Social Media",
  "Media Buying",
  "Content Production",
  "Full Marketing Solution",
  "Other",
];

const budgetOptions = ["Less than 50K", "50K – 100K", "100K – 250K", "250K+"];

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

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function ClientItem({ client }) {
  return (
    <span className={styles.logoItem}>
      {client.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={client.logo} alt={client.name} className={styles.logoImg} />
      ) : (
        client.name
      )}
    </span>
  );
}

export default function LandingPage() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    service: "",
    budget: "",
  });
  const [status, setStatus] = useState("idle");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    async function loadClients() {
      try {
        const snap = await getDocs(collection(db, "clients"));
        setClients(
          snap.docs.map((d) => ({
            name: d.data().name,
            logo: d.data().logo || null,
          })),
        );
      } catch (err) {
        console.error("Failed to load clients:", err);
      }
    }
    loadClients();
  }, []);

  // Visit + duration tracking
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
      const duration = Math.round((Date.now() - startTime) / 1000);
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

    return () => window.removeEventListener("pagehide", sendDuration);
  }, []);

  function scrollToForm() {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

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
      setForm({
        name: "",
        phone: "",
        email: "",
        company: "",
        service: "",
        budget: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  // Repeat the client list enough times that one group is always wider
  // than the screen, so the marquee never shows a gap.
  const marqueeItems =
    clients.length > 0
      ? Array.from({ length: Math.ceil(8 / clients.length) }).flatMap(
          () => clients,
        )
      : [];
  const marqueeDuration = Math.max(20, marqueeItems.length * 4);

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
        <section className={styles.hero}>
          <video
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            poster="/main_cover.png"
          >
            <source src="/main_loop.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroOverlay} />

          <Reveal className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Build a Brand
              <br />
              <em>People Remember.</em>
            </h1>
            <p className={styles.heroSubtitle}>
              We help ambitious brands grow through strategy, creativity &amp;
              performance.
            </p>
            <button onClick={scrollToForm} className={styles.heroBtn}>
              Start Your Project →
            </button>
            <p className={styles.heroFooter}>
              Tell us about your business. Our team will get back to you within
              24 hours.
            </p>
          </Reveal>
        </section>

        {/* ── TRUST ── */}
        <section className={styles.trust}>
          <Reveal>
            <p className={styles.trustLabel}>
              Trusted by brands with bigger ambitions
            </p>
          </Reveal>

          {marqueeItems.length > 0 && (
            <Reveal delay={100} className={styles.marquee}>
              <div
                className={styles.marqueeTrack}
                style={{ animationDuration: `${marqueeDuration}s` }}
              >
                <div className={styles.marqueeGroup}>
                  {marqueeItems.map((c, i) => (
                    <ClientItem key={`a-${c.name}-${i}`} client={c} />
                  ))}
                </div>
                <div className={styles.marqueeGroup} aria-hidden="true">
                  {marqueeItems.map((c, i) => (
                    <ClientItem key={`b-${c.name}-${i}`} client={c} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

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

        {/* ── PROBLEM ── */}
        <section className={styles.problem}>
          <Reveal>
            <h2 className={styles.problemHeading}>
              Your brand doesn&apos;t need more marketing.
              <br />
              <em>It needs the right marketing.</em>
            </h2>
          </Reveal>

          <div className={styles.painList}>
            {painPoints.map((p, i) => (
              <Reveal key={p} delay={i * 90} className={styles.painItem}>
                <span className={styles.painMark}>✕</span>
                <span>{p}</span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400} className={styles.problemCta}>
            That&apos;s where we come in.
          </Reveal>
        </section>

        {/* ── WHAT WE DO ── */}
        <section className={styles.offerings}>
          <Reveal>
            <p className={styles.sectionLabel}>What We Do</p>
            <h2 className={styles.sectionHeading}>
              One Partner. <em>Everything Your Brand Needs.</em>
            </h2>
          </Reveal>

          <div className={styles.offeringsGrid}>
            {offerings.map((o, i) => (
              <Reveal
                key={o.name}
                delay={i * 70}
                className={styles.offeringCard}
              >
                <span className={styles.offeringIcon}>{o.icon}</span>
                <h3 className={styles.offeringName}>{o.name}</h3>
                <p className={styles.offeringDesc}>{o.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CASE STUDIES ── */}
        <section className={styles.cases}>
          <Reveal>
            <p
              className={styles.sectionLabel}
              style={{ color: "rgba(245,240,220,0.6)" }}
            >
              Proof, Not Promises
            </p>
            <h2 className={styles.sectionHeadingDark}>
              We don&apos;t just create.
              <br />
              <em>We create work that moves brands forward.</em>
            </h2>
          </Reveal>

          <div className={styles.casesGrid}>
            {cases.map((c, i) => (
              <Reveal key={c.client} delay={i * 90} className={styles.caseCard}>
                <span className={styles.caseClient}>{c.client}</span>
                <div className={styles.caseRow}>
                  <span className={styles.caseLabel}>Challenge</span>
                  <p className={styles.caseText}>{c.challenge}</p>
                </div>
                <div className={styles.caseRow}>
                  <span className={styles.caseLabel}>What We Did</span>
                  <p className={styles.caseText}>{c.whatWeDid}</p>
                </div>
                <div className={styles.caseRow}>
                  <span className={styles.caseLabel}>Result</span>
                  <p className={styles.caseResult}>{c.result}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── LEAD FORM ── */}
        <section className={styles.contact} id="contact">
          <Reveal className={styles.contactInner}>
            <h2 className={styles.contactHeading}>
              Let&apos;s build <em>something great.</em>
            </h2>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <input
                  required
                  className={styles.input}
                  placeholder="Name"
                  value={form.name}
                  onChange={update("name")}
                />
                <input
                  required
                  className={styles.input}
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  required
                  type="email"
                  className={styles.input}
                  placeholder="Email"
                  value={form.email}
                  onChange={update("email")}
                />
                <input
                  className={styles.input}
                  placeholder="Company / Brand Name"
                  value={form.company}
                  onChange={update("company")}
                />
              </div>

              <select
                required
                className={styles.select}
                value={form.service}
                onChange={update("service")}
              >
                <option value="">What do you need help with?</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                required
                className={styles.select}
                value={form.budget}
                onChange={update("budget")}
              >
                <option value="">
                  What&apos;s your monthly marketing budget?
                </option>
                {budgetOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className={styles.submit}
                disabled={status === "loading"}
              >
                {status === "loading" && "Sending..."}
                {status === "success" && "✓ Sent! We'll be in touch."}
                {status === "error" && "Error — Try Again"}
                {status === "idle" && "Start My Project →"}
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
