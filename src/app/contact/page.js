"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../lib/firebase";

const services = [
  "Design & Branding",
  "Digital Marketing",
  "Social Media Management",
  "Event Management",
  "Media Production",
  "UI & UX Design",
  "Influencer Campaigns",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        submittedAt: new Date(),
      });

      setStatus("success");
      toast.success("Message sent! We'll be in touch soon 🎉");
      setTimeout(() => setStatus("idle"), 3000);
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>05 — Get In Touch</p>
        <h1 className={styles.title}>
          Let&apos;s Build
          <br />
          <em>Something Great.</em>
        </h1>
      </section>

      {/* MAIN */}
      <section className={styles.main}>
        {/* LEFT */}
        <div className={styles.info}>
          <p className={styles.infoIntro}>
            Whether you&apos;re a startup building your brand from scratch, or
            an established company looking to grow your digital presence —
            we&apos;re the creative partner you need.
          </p>

          <div className={styles.infoItems}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📞</span>
              <div>
                <strong>Phone</strong>
                <span>01118887031</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>✉</span>
              <div>
                <strong>Email</strong>
                <span>INFO.PLUSCREATIVESTUDIO@gmail.com</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📍</span>
              <div>
                <strong>Location</strong>
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

          <div className={styles.socials}>
            {[
              { label: "Instagram", handle: "@plus.creativestudio" },
              { label: "Facebook", handle: "plus.creativestudio" },
              { label: "TikTok", handle: "@plus.eg" },
              { label: "LinkedIn", handle: "plus-creativestudio" },
            ].map((s) => (
              <div key={s.label} className={styles.socialItem}>
                <span className={styles.socialLabel}>{s.label}</span>
                <span className={styles.socialHandle}>{s.handle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label}>Your Name *</label>
              <input
                required
                className={styles.input}
                placeholder="Ahmed Hassan"
                value={form.name}
                onChange={update("name")}
              />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Company</label>
              <input
                className={styles.input}
                placeholder="Your Brand"
                value={form.company}
                onChange={update("company")}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label}>Email Address *</label>
              <input
                required
                type="email"
                className={styles.input}
                placeholder="hello@yourbrand.com"
                value={form.email}
                onChange={update("email")}
              />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                placeholder="+20 10 ..."
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Service You Need</label>
            <select
              className={styles.select}
              value={form.service}
              onChange={update("service")}
            >
              <option value="">Select a service...</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Your Message *</label>
            <textarea
              required
              className={styles.textarea}
              placeholder="Tell us about your project, goals, and timeline..."
              value={form.message}
              onChange={update("message")}
            />
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" && "Sending..."}
            {status === "success" && "✓ Message Sent!"}
            {status === "error" && "Error — Try Again"}
            {status === "idle" && "Send Message →"}
          </button>

          {status === "error" && (
            <p className={styles.errorMsg}>
              Something went wrong. Please try again or email us directly.
            </p>
          )}
        </form>
      </section>
    </>
  );
}
