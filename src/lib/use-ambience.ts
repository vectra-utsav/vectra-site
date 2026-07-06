"use client";

import { useEffect } from "react";

type Stop = { t: number; density: number; speed: number; warmth: number };

/**
 * The site's "time of day" — not a color-shift gimmick, a pacing curve.
 * Density/speed/warmth are read by ambient CSS (heartbeats, city canvas,
 * vignette) via custom properties so the whole page breathes together
 * instead of each section animating in isolation.
 */
const STOPS: Stop[] = [
  { t: 0, density: 0.55, speed: 0.85, warmth: 0.35 }, // dawn — Problem
  { t: 0.16, density: 0.7, speed: 1, warmth: 0.5 }, // day — Idea / Philosophy
  { t: 0.34, density: 1, speed: 1.25, warmth: 0.6 }, // rush hour — Engineering travel
  { t: 0.46, density: 0.5, speed: 0.55, warmth: 0.15 }, // the incident
  { t: 0.58, density: 0.35, speed: 0.4, warmth: 0.1 }, // convergence / silence
  { t: 0.66, density: 0.6, speed: 0.75, warmth: 0.55 }, // reveal afterglow
  { t: 1, density: 0.5, speed: 0.8, warmth: 0.4 } // calm — Scale / Roadmap / Final
];

function lerp(a: number, b: number, f: number) {
  return a + (b - a) * f;
}

function sample(t: number): { density: number; speed: number; warmth: number } {
  const clamped = Math.min(1, Math.max(0, t));
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const f = (clamped - a.t) / (b.t - a.t || 1);
      return {
        density: lerp(a.density, b.density, f),
        speed: lerp(a.speed, b.speed, f),
        warmth: lerp(a.warmth, b.warmth, f)
      };
    }
  }
  const last = STOPS[STOPS.length - 1];
  return { density: last.density, speed: last.speed, warmth: last.warmth };
}

export function useAmbience() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.style.setProperty("--ambient-density", "0");
      return;
    }

    let raf = 0;
    let ticking = false;

    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? window.scrollY / max : 0;
      const { density, speed, warmth } = sample(t);
      root.style.setProperty("--ambient-density", density.toFixed(3));
      root.style.setProperty("--ambient-speed", speed.toFixed(3));
      root.style.setProperty("--ambient-warmth", warmth.toFixed(3));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}
