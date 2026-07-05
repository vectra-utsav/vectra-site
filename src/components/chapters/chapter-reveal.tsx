"use client";

import { motion, type Variants } from "framer-motion";
import { revealName, revealTagline } from "@/data/vectra";

const wordVariants: Variants = {
  hidden: { opacity: 0, letterSpacing: "0.7em" },
  show: {
    opacity: 1,
    letterSpacing: "0.01em",
    transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const taglineVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }
  }
};

export function ChapterReveal() {
  return (
    <>
      <div className="reveal-silence" aria-hidden="true" />
      <motion.section
        className="reveal-section"
        id="reveal"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="reveal-shell">
          <motion.h2 className="reveal-word" variants={wordVariants}>
            {revealName}
          </motion.h2>
          <motion.p className="reveal-tagline" variants={taglineVariants}>
            {revealTagline}
          </motion.p>
        </div>
      </motion.section>
    </>
  );
}
