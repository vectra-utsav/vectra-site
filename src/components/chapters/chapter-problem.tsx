"use client";

import { motion } from "framer-motion";
import { ChapterLabel } from "@/components/motion/chapter-label";
import { ParticleField } from "@/components/motion/particle-field";
import { problemBody, problemClose, problemLabel, problemLead } from "@/data/vectra";

export function ChapterProblem() {
  return (
    <section className="chapter chapter-problem" id="problem">
      <ParticleField />
      <div className="chapter-shell is-narrow">
        <ChapterLabel>{problemLabel}</ChapterLabel>

        <motion.h2
          className="chapter-headline problem-lead"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {problemLead}
        </motion.h2>

        <div className="problem-body">
          {problemBody.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          className="problem-close"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {problemClose}
        </motion.p>
      </div>
    </section>
  );
}
