"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutAnimations() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // ── Hero eyebrow ──
      const eyebrow = document.querySelector(".about-eyebrow");
      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.2 },
        );
      }

      // ── Hero title ──
      const title = document.querySelector(".about-title");
      if (title) {
        gsap.fromTo(
          title,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.4 },
        );
      }

      // ── Story section ──
      const storyLabel = document.querySelector(".about-story-label");
      const storyHeading = document.querySelector(".about-story-heading");
      const storyTexts = document.querySelectorAll(".about-story-text");

      if (storyLabel) {
        gsap.fromTo(
          storyLabel,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storyLabel,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      if (storyHeading) {
        gsap.fromTo(
          storyHeading,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: storyHeading,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      storyTexts.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      // ── Vision quote ──
      const vision = document.querySelector(".about-vision");
      if (vision) {
        gsap.fromTo(
          vision,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.6,
            ease: "power4.out",
            scrollTrigger: { trigger: vision, start: "top 80%", once: true },
          },
        );
      }

      // ── Values cards ──
      const valueCards = document.querySelectorAll(".about-value-card");
      if (valueCards.length) {
        gsap.fromTo(
          valueCards,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: ".about-values-grid",
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // ── Stats ──
      const stats = document.querySelectorAll(".about-stat");
      if (stats.length) {
        gsap.fromTo(
          stats,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".about-stats",
              start: "top 85%",
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
