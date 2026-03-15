"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesAnimations() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // ── Hero eyebrow ──
      const eyebrow = document.querySelector(".serv-eyebrow");
      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.2 },
        );
      }

      // ── Hero title ──
      const title = document.querySelector(".serv-title");
      if (title) {
        gsap.fromTo(
          title,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.4 },
        );
      }

      // ── Hero subtitle ──
      const subtitle = document.querySelector(".serv-subtitle");
      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.7 },
        );
      }

      // ── Service cards ──
      const cards = document.querySelectorAll(".serv-card");
      const grid = document.querySelector(".serv-grid");
      if (cards.length && grid) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: grid,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // ── Process label ──
      const processLabel = document.querySelector(".serv-process-label");
      if (processLabel) {
        gsap.fromTo(
          processLabel,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: processLabel,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      // ── Process heading ──
      const processHeading = document.querySelector(".serv-process-heading");
      if (processHeading) {
        gsap.fromTo(
          processHeading,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: processHeading,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ── Process steps ──
      const steps = document.querySelectorAll(".serv-process-step");
      if (steps.length) {
        gsap.fromTo(
          steps,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: ".serv-process-steps",
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
