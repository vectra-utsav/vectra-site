"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { pipelineStages } from "@/data/vectra";

const SIZE = 420;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.37;
const TOTAL_NODES = pipelineStages.length;
const START_ANGLE = -Math.PI / 2;

function point(i: number) {
  const a = START_ANGLE + (i / TOTAL_NODES) * Math.PI * 2;
  return {
    x: CENTER + RADIUS * Math.cos(a),
    y: CENTER + RADIUS * Math.sin(a)
  };
}

export function ChapterConvergence() {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.55], [1, 0.1]);
  const echoOpacity = useTransform(scrollYProgress, [0, 0.45, 0.65], [1, 0.7, 0]);
  const veilOpacity = useTransform(scrollYProgress, [0.45, 0.85], [0, 1]);

  return (
    <div className="convergence-track" ref={trackRef} style={{ height: "220svh" }}>
      <div className="convergence-sticky">
        <motion.svg
          className="convergence-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ scale, opacity: echoOpacity }}
          aria-hidden="true"
        >
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--line-strong)" strokeWidth={1} />
          {pipelineStages.map((stage, i) => {
            const p = point(i);
            return <circle key={stage.id} cx={p.x} cy={p.y} r={4} fill="var(--gold)" />;
          })}
          <circle cx={CENTER} cy={CENTER} r={3} fill="var(--gold-bright)" />
        </motion.svg>
        <motion.div className="convergence-veil" style={{ opacity: veilOpacity }} />
      </div>
    </div>
  );
}
