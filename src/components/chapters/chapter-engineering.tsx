"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from "framer-motion";
import { useRef, useState } from "react";
import { ChapterLabel } from "@/components/motion/chapter-label";
import {
  engineeringClose,
  engineeringFailureNote,
  engineeringIntro,
  engineeringLabel,
  engineeringLead,
  engineeringRecoveryNote,
  systemNodes
} from "@/data/vectra";

const SIZE = 560;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.36;
const LABEL_RADIUS = RADIUS + 34;
const FAILURE_INDEX = 4; // Dispatch
const LOOP_END = 0.58;
const FAILURE_END = 0.82;
const START_ANGLE = -Math.PI / 2;
const TOTAL_NODES = systemNodes.length;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function nodeAngle(i: number) {
  return START_ANGLE + (i / TOTAL_NODES) * Math.PI * 2;
}

function point(angle: number, radius: number) {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle)
  };
}

function normalizeAngle(a: number) {
  const twoPi = Math.PI * 2;
  return ((a % twoPi) + twoPi) % twoPi;
}

export function ChapterEngineering() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"travel" | "failure" | "recovery">("travel");
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  const failureAngle = nodeAngle(FAILURE_INDEX);
  const fullTurn = failureAngle - START_ANGLE + Math.PI * 2;

  const angle = useTransform(scrollYProgress, (t) => {
    if (t <= LOOP_END) {
      return START_ANGLE + (t / LOOP_END) * fullTurn;
    }
    const frozen = START_ANGLE + fullTurn;
    if (t <= FAILURE_END) {
      return frozen;
    }
    const recover = (t - FAILURE_END) / (1 - FAILURE_END);
    return frozen + recover * (Math.PI * 2 * 0.62);
  });

  const cx = useTransform(angle, (a) => point(a, RADIUS).x);
  const cy = useTransform(angle, (a) => point(a, RADIUS).y);

  const ringOffset = useTransform(angle, (a) => {
    const norm = normalizeAngle(a - START_ANGLE);
    return CIRCUMFERENCE - (norm / (Math.PI * 2)) * CIRCUMFERENCE;
  });

  useMotionValueEvent(scrollYProgress, "change", (t) => {
    const nextPhase = t <= LOOP_END ? "travel" : t <= FAILURE_END ? "failure" : "recovery";
    setPhase((p) => (p === nextPhase ? p : nextPhase));
  });

  useMotionValueEvent(angle, "change", (a) => {
    const norm = normalizeAngle(a - START_ANGLE);
    const idx = Math.round((norm / (Math.PI * 2)) * TOTAL_NODES) % TOTAL_NODES;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const activeNode = systemNodes[activeIndex];
  const isFailing = phase === "failure";
  const isRecovering = phase === "recovery";

  return (
    <>
      <section className="chapter chapter-engineering-intro" id="engineering">
        <div className="chapter-shell is-narrow">
          <ChapterLabel>{engineeringLabel}</ChapterLabel>
          <motion.h2
            className="chapter-headline engineering-lead"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {engineeringLead}
          </motion.h2>
          <motion.p
            className="chapter-body engineering-intro-copy"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {engineeringIntro}
          </motion.p>
        </div>
      </section>

      <div className="engineering-track" ref={trackRef} style={{ height: "360svh" }}>
        <div className="engineering-sticky">
          <div className="engineering-diagram-wrap">
            <svg
              className="engineering-svg"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label="Vectra service mesh — request travelling through Gateway, Authentication, Users, Ride, Dispatch, Payment, Notification, and Observability"
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="var(--line)"
                strokeWidth={1}
              />
              <motion.circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={isFailing ? "var(--crimson)" : "var(--gold)"}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                style={{ strokeDashoffset: ringOffset, rotate: -90, transformOrigin: "50% 50%" }}
                animate={{
                  stroke: isFailing ? "var(--crimson)" : "var(--gold)"
                }}
                transition={{ duration: 0.4 }}
              />

              {systemNodes.map((node, i) => {
                const a = nodeAngle(i);
                const p = point(a, RADIUS);
                const lp = point(a, LABEL_RADIUS);
                const isActive = i === activeIndex;
                const isFailNode = isActive && (isFailing || isRecovering) && i === FAILURE_INDEX;
                return (
                  <g key={node.id}>
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 7 : 4.5}
                      fill={
                        isFailNode
                          ? "var(--crimson-bright)"
                          : isActive
                            ? "var(--gold-bright)"
                            : "var(--bg-elevated)"
                      }
                      stroke={isActive ? "transparent" : "var(--line-strong)"}
                      strokeWidth={1}
                      animate={{
                        r: isActive ? 7 : 4.5
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <text
                      x={lp.x}
                      y={lp.y}
                      className={`engineering-node-label ${isActive ? (isFailNode ? "is-failing" : "is-active") : ""}`}
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}

              <motion.circle
                cx={cx}
                cy={cy}
                r={9}
                fill={isFailing ? "var(--crimson-bright)" : "var(--gold-bright)"}
                animate={{
                  fill: isFailing ? "var(--crimson-bright)" : "var(--gold-bright)",
                  scale: isFailing ? [1, 1.25, 0.9, 1.15, 1] : 1
                }}
                transition={
                  isFailing
                    ? { scale: { duration: 1.1, repeat: Infinity, ease: "easeInOut" } }
                    : { duration: 0.4 }
                }
                style={{
                  filter: isFailing
                    ? "drop-shadow(0 0 10px var(--crimson))"
                    : "drop-shadow(0 0 10px var(--gold-soft))"
                }}
              />
            </svg>

            <div className="engineering-caption">
              <AnimatePresence mode="wait">
                {phase === "travel" && (
                  <motion.div
                    key={`node-${activeIndex}`}
                    className="engineering-caption-inner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="engineering-caption-title">{activeNode.name}</p>
                    <p className="engineering-caption-role">{activeNode.role}</p>
                  </motion.div>
                )}
                {phase === "failure" && (
                  <motion.div
                    key="failure"
                    className="engineering-caption-inner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="engineering-caption-title is-failing">Dispatch is down.</p>
                    <p className="engineering-caption-role">{engineeringFailureNote}</p>
                  </motion.div>
                )}
                {phase === "recovery" && (
                  <motion.div
                    key="recovery"
                    className="engineering-caption-inner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="engineering-caption-title">Recovered.</p>
                    <p className="engineering-caption-role">{engineeringRecoveryNote}</p>
                    <p className="engineering-close">{engineeringClose}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
