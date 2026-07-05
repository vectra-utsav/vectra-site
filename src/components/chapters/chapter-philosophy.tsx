"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { ChapterLabel } from "@/components/motion/chapter-label";
import {
  philosophyLabel,
  philosophyLead,
  philosophyPrinciples
} from "@/data/vectra";

export function ChapterPhilosophy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      philosophyPrinciples.length - 1,
      Math.floor(v * philosophyPrinciples.length)
    );
    setActive(Math.max(0, idx));
  });

  const current = philosophyPrinciples[active];

  return (
    <section
      className="chapter-philosophy-track"
      id="philosophy"
      ref={trackRef}
      style={{ height: `${philosophyPrinciples.length * 100}svh` }}
    >
      <div className="chapter-philosophy-sticky">
        <div className="philosophy-shell">
          <div className="philosophy-head">
            <div>
              <ChapterLabel>{philosophyLabel}</ChapterLabel>
              <p className="chapter-headline philosophy-lead">{philosophyLead}</p>
            </div>
            <p className="philosophy-counter">
              <span className="text-gold">{current.index}</span> /{" "}
              {String(philosophyPrinciples.length).padStart(2, "0")}
            </p>
          </div>

          <div className="philosophy-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.index}
                className="philosophy-slide"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="philosophy-slide-index">{current.index}</span>
                <div>
                  <h3>{current.title}</h3>
                  <p>{current.copy}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="philosophy-dots">
            {philosophyPrinciples.map((p, i) => (
              <span
                key={p.index}
                className={`philosophy-dot ${i === active ? "is-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
