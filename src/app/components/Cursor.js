"use client";
import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    const trail = document.createElement("div");
    cursor.className = "cursor";
    trail.className = "cursor-trail";
    document.body.appendChild(cursor);
    document.body.appendChild(trail);

    const move = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      setTimeout(() => {
        trail.style.left = e.clientX + "px";
        trail.style.top = e.clientY + "px";
      }, 80);
    };

    const grow = () => {
      cursor.style.transform = "translate(-50%,-50%) scale(2)";
      trail.style.opacity = "0.2";
    };
    const shrink = () => {
      cursor.style.transform = "translate(-50%,-50%) scale(1)";
      trail.style.opacity = "0.5";
    };

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      document.body.removeChild(cursor);
      document.body.removeChild(trail);
    };
  }, []);

  return null;
}
