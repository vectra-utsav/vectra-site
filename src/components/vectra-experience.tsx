"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { OpeningSequence } from "@/components/opening-sequence";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ChapterProblem } from "@/components/chapters/chapter-problem";
import { ChapterIdea } from "@/components/chapters/chapter-idea";
import { ChapterPhilosophy } from "@/components/chapters/chapter-philosophy";
import { ChapterEngineering } from "@/components/chapters/chapter-engineering";
import { ChapterReveal } from "@/components/chapters/chapter-reveal";
import { ChapterScale } from "@/components/chapters/chapter-scale";
import { ChapterRoadmap } from "@/components/chapters/chapter-roadmap";
import { ChapterFinal } from "@/components/chapters/chapter-final";

function SiteMark() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.56, 0.62], [0, 1]);
  return (
    <motion.span className="site-mark" style={{ opacity }}>
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
        <ChapterReveal />
        <ChapterScale />
        <ChapterRoadmap />
        <ChapterFinal />
      </main>
    </div>
  );
}
