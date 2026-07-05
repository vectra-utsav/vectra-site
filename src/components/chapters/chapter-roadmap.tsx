"use client";

import { motion } from "framer-motion";
import { ChapterLabel } from "@/components/motion/chapter-label";
import { roadmapLabel, roadmapLead, roadmapStages } from "@/data/vectra";

export function ChapterRoadmap() {
  return (
    <section className="chapter" id="roadmap">
      <div className="chapter-shell is-narrow">
        <ChapterLabel>{roadmapLabel}</ChapterLabel>
        <h2 className="chapter-headline roadmap-lead">{roadmapLead}</h2>

        <ul className="roadmap-list">
          {roadmapStages.map((stage, i) => (
            <motion.li
              key={stage.label}
              className="roadmap-row"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="roadmap-label">{stage.label}</span>
              <p className="roadmap-detail">{stage.detail}</p>
              <span className={`roadmap-status ${stage.state === "active" ? "is-active" : ""} ${stage.state === "done" ? "is-done" : ""}`}>
                <span className="roadmap-dot" />
                {stage.state}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
