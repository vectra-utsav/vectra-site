"use client";

import { motion } from "framer-motion";
import { ChapterLabel } from "@/components/motion/chapter-label";
import { scaleBody, scaleLabel, scaleStatement } from "@/data/vectra";

export function ChapterScale() {
  return (
    <section className="chapter chapter-scale" id="scale">
      <div className="scale-shell">
        <ChapterLabel>{scaleLabel}</ChapterLabel>
        <motion.h2
          className="scale-statement"
          initial={{ opacity: 0, scale: 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {scaleStatement}
        </motion.h2>
        <div className="scale-body">
          {scaleBody.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
