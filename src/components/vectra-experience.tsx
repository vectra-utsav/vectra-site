"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { OpeningSequence } from "@/components/opening-sequence";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ChapterProblem } from "@/components/chapters/chapter-problem";
import { ChapterIdea } from "@/components/chapters/chapter-idea";
import { ChapterPhilosophy } from "@/components/chapters/chapter-philosophy";
import { ChapterEngineering } from "@/components/chapters/chapter-engineering";
import { ChapterConvergence } from "@/components/chapters/chapter-convergence";
import { ChapterReveal } from "@/components/chapters/chapter-reveal";
import { ChapterScale } from "@/components/chapters/chapter-scale";
import { ChapterRoadmap } from "@/components/chapters/chapter-roadmap";
import { ChapterFinal } from "@/components/chapters/chapter-final";

function SiteMark() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("reveal");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.span
      className="site-mark"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      VECTRA
    </motion.span>
  );
}

export function VectraExperience() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="site-shell">
      <OpeningSequence onDone={() => setOpened(true)} />
      {opened && (
        <>
          <ScrollProgress />
          <SiteMark />
        </>
      )}

      <main>
        <ChapterProblem />
        <ChapterIdea />
        <ChapterPhilosophy />
        <ChapterEngineering />
        <ChapterConvergence />
        <ChapterReveal />
        <ChapterScale />
        <ChapterRoadmap />
        <ChapterFinal />
      </main>
    </div>
  );
}
