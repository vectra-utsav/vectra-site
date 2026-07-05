"use client";

import { motion } from "framer-motion";
import { ChapterLabel } from "@/components/motion/chapter-label";
import { MaskReveal } from "@/components/motion/mask-reveal";
import { ideaBody, ideaClose, ideaLabel, ideaLead } from "@/data/vectra";

export function ChapterIdea() {
  return (
    <section className="chapter chapter-idea" id="idea">
      <div className="chapter-shell is-narrow">
        <ChapterLabel>{ideaLabel}</ChapterLabel>

        <h2 className="chapter-headline idea-lead">
          <MaskReveal as="span">{ideaLead}</MaskReveal>
        </h2>

        <motion.div
          className="idea-rule"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="idea-body">
          {ideaBody.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          className="idea-close"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {ideaClose}
        </motion.p>
      </div>
    </section>
  );
}
