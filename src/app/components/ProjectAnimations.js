"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsAnimations() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const eyebrow = document.querySelector(".proj-eyebrow");
      const title = document.querySelector(".proj-title");
      const cards = document.querySelectorAll(".proj-card");
      const grid = document.querySelector(".proj-grid");

      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.2 },
        );
      }

      if (title) {
        gsap.fromTo(
          title,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.6, ease: "power4.out", delay: 0.4 },
        );
      }

      if (cards.length && grid) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
            stagger: {
              each: 0.15,
              from: "start",
            },
            scrollTrigger: {
              trigger: grid,
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
