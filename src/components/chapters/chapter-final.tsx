"use client";

import { motion } from "framer-motion";
import { finalLine, founderNote } from "@/data/vectra";

export function ChapterFinal() {
  return (
    <section className="chapter-final" id="final">
      <div className="final-shell">
        <motion.p
          className="final-line"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {finalLine}
        </motion.p>
        <motion.p
          className="final-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {founderNote}
        </motion.p>

        <motion.div
          className="final-pulse"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, delay: 2.4 }}
        >
          <span className="final-pulse-track">
            <span className="final-pulse-dot" />
          </span>
          <span className="final-pulse-label">Still running.</span>
        </motion.div>
      </div>
    </section>
  );
}
