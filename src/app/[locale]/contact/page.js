"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./page.module.css";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../lib/firebase";

export default function Contact() {
  const t = useTranslations("contact");

  const services = [
    t("service1"),
    t("service2"),
    t("service3"),
    t("service4"),
    t("service5"),
    t("service6"),
    t("service7"),
    t("service8"),
  ];

  const socials = [
    { label: "Instagram", handle: "@plus.creativestudio" },
    { label: "Facebook", handle: "plus.creativestudio" },
    { label: "TikTok", handle: "@plus.eg" },
    { label: "LinkedIn", handle: "plus-creativestudio" },
  ];

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
      toast.success(t("toastSuccess"));
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
      toast.error(t("toastError"));
    }
  };

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{t("heroEyebrow")}</p>
        <h1 className={styles.title}>
          {t("heroTitleLine1")}
          <br />
          <em>{t("heroTitleLine2")}</em>
        </h1>
      </section>

      {/* MAIN */}
      <section className={styles.main}>
        {/* LEFT */}
        <div className={styles.info}>
          <p className={styles.infoIntro}>{t("infoIntro")}</p>

          <div className={styles.infoItems}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📞</span>
              <div>
                <strong>{t("phoneLabel")}</strong>
                <span>01118887031</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>✉</span>
              <div>
                <strong>{t("emailLabel")}</strong>
                <span>INFO.PLUSCREATIVESTUDIO@gmail.com</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📍</span>
              <div>
                <strong>{t("locationLabel")}</strong>
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

          <div className={styles.socials}>
            {socials.map((s) => (
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
              <label className={styles.label}>{t("nameLabel")}</label>
              <input
                required
                className={styles.input}
                placeholder="Ahmed Hassan"
                value={form.name}
                onChange={update("name")}
              />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>{t("companyLabel")}</label>
              <input
                className={styles.input}
                placeholder={t("companyPlaceholder")}
                value={form.company}
                onChange={update("company")}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label}>{t("emailFieldLabel")}</label>
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
              <label className={styles.label}>{t("phoneFieldLabel")}</label>
              <input
                className={styles.input}
                placeholder="+20 10 ..."
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>{t("serviceLabel")}</label>
            <select
              className={styles.select}
              value={form.service}
              onChange={update("service")}
            >
              <option value="">{t("servicePlaceholder")}</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>{t("messageLabel")}</label>
            <textarea
              required
              className={styles.textarea}
              placeholder={t("messagePlaceholder")}
              value={form.message}
              onChange={update("message")}
            />
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" && t("btnSending")}
            {status === "success" && t("btnSuccess")}
            {status === "error" && t("btnError")}
            {status === "idle" && t("btnIdle")}
          </button>

          {status === "error" && (
            <p className={styles.errorMsg}>{t("errorMsg")}</p>
          )}
        </form>
      </section>
    </>
  );
}