"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChapterLabel } from "@/components/motion/chapter-label";
import {
  engineeringClose,
  engineeringFailureNote,
  engineeringImpactNote,
  engineeringIntro,
  engineeringLabel,
  engineeringLead,
  engineeringReconciliationNote,
  engineeringRecoveryNote,
  engineeringRetryNote,
  instrumentCopy,
  pipelineStages
} from "@/data/vectra";

const SIZE = 520;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.37;
const LABEL_RADIUS = RADIUS + 32;
const FAILURE_INDEX = 2; // Dispatch
const DEPENDENCY_INDEX = 1; // Ride — dims as if it can't reach Dispatch either
const START_ANGLE = -Math.PI / 2;
const TOTAL_NODES = pipelineStages.length;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const T_DISPATCH_ARRIVE = 0.36;
const T_FREEZE_END = 0.74;

type Phase = "travel" | "impact" | "failure" | "silence" | "retry" | "healing" | "recovery";

const HEARTBEAT_PATH =
  "M0 17 L18 17 L23 5 L28 29 L33 17 L50 17 L68 17 L73 5 L78 29 L83 17 L100 17 L118 17 L123 5 L128 29 L133 17 L150 17 L168 17 L173 5 L178 29 L183 17 L200 17";

const AMPLITUDE: Record<Phase, number> = {
  travel: 1,
  impact: 0.45,
  failure: 0.14,
  silence: 0.02,
  retry: 0.4,
  healing: 0.75,
  recovery: 1
};

const TROUBLE_PHASES: Phase[] = ["impact", "failure", "silence", "retry"];

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

function useAmbientParticles(count: number) {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 53.71;
      const rand = (n: number) => {
        const x = Math.sin(seed + n) * 10000;
        return x - Math.floor(x);
      };
      return {
        radius: RADIUS * (0.55 + rand(1) * 0.75),
        duration: 14 + rand(2) * 22,
        delay: -rand(3) * 30
      };
    });
  }, [count]);
}

export function ChapterEngineering() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("travel");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ambientParticles = useAmbientParticles(26);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"]
  });

  const dispatchAngle = nodeAngle(FAILURE_INDEX);
  const alertsAngle =
    dispatchAngle + ((TOTAL_NODES - 1 - FAILURE_INDEX) / TOTAL_NODES) * Math.PI * 2;

  const angle = useTransform(scrollYProgress, (t) => {
    if (t <= T_DISPATCH_ARRIVE) {
      return START_ANGLE + (t / T_DISPATCH_ARRIVE) * (dispatchAngle - START_ANGLE);
    }
    if (t <= T_FREEZE_END) {
      return dispatchAngle;
    }
    const resume = (t - T_FREEZE_END) / (1 - T_FREEZE_END);
    return dispatchAngle + resume * (alertsAngle - dispatchAngle);
  });

  const cx = useTransform(angle, (a) => point(a, RADIUS).x);
  const cy = useTransform(angle, (a) => point(a, RADIUS).y);

  const ringOffset = useTransform(angle, (a) => {
    const norm = normalizeAngle(a - START_ANGLE);
    return CIRCUMFERENCE - (norm / (Math.PI * 2)) * CIRCUMFERENCE;
  });

  useMotionValueEvent(scrollYProgress, "change", (t) => {
    let nextPhase: Phase = "travel";
    if (t > T_DISPATCH_ARRIVE && t <= T_FREEZE_END) {
      const fw = (t - T_DISPATCH_ARRIVE) / (T_FREEZE_END - T_DISPATCH_ARRIVE);
      if (fw < 0.1) nextPhase = "impact";
      else if (fw < 0.3) nextPhase = "failure";
      else if (fw < 0.38) nextPhase = "silence";
      else if (fw < 0.56) nextPhase = "retry";
      else if (fw < 0.72) nextPhase = "healing";
      else nextPhase = "recovery";
    }
    setPhase((p) => (p === nextPhase ? p : nextPhase));
  });

  useMotionValueEvent(angle, "change", (a) => {
    const norm = normalizeAngle(a - START_ANGLE);
    const idx = Math.round((norm / (Math.PI * 2)) * TOTAL_NODES) % TOTAL_NODES;
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const activeStage = pipelineStages[activeIndex];
  const isTrouble = TROUBLE_PHASES.includes(phase);
  const isAlert = phase === "failure" || phase === "silence" || phase === "retry";
  const isHealing = phase === "healing";
  const isWaking = phase === "retry" || phase === "healing" || phase === "recovery";
  const isLastStage = activeIndex === TOTAL_NODES - 1 && phase === "travel";

  const ringColor = isTrouble ? "var(--crimson)" : isHealing ? "var(--healing)" : "var(--gold)";
  const nodeColor = isTrouble
    ? "var(--crimson-bright)"
    : isHealing
      ? "var(--healing)"
      : "var(--gold-bright)";

  const logLine =
    phase === "impact"
      ? "dispatch  → timeout waiting for candidates"
      : phase === "failure"
        ? "dispatch  → 0/12 candidates responded"
        : phase === "silence"
          ? "…"
          : phase === "retry"
            ? "dispatch  → retry 1/3 (backoff 400ms)"
            : phase === "healing"
              ? "dispatch  → healthy, rejoining ring"
              : phase === "recovery"
                ? "reconciler → ride#4471 resumed"
                : activeStage.log;

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

      <div className="engineering-track" ref={trackRef} style={{ height: "640svh" }}>
        <div className="engineering-sticky">
          <div className="engineering-diagram-wrap">
            <div className="engineering-ambient" aria-hidden="true">
              {mounted &&
                ambientParticles.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      // @ts-expect-error -- custom property
                      "--orbit-r": `${p.radius}px`,
                      animationDuration: `${p.duration}s`,
                      animationDelay: `${p.delay}s`
                    }}
                  />
                ))}
            </div>

            {isAlert && (
              <motion.div
                className="engineering-alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="engineering-alert-dot" />
                Alert
              </motion.div>
            )}

            <svg
              className="engineering-svg"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label="A ride request travelling through Vectra's pipeline — Gateway, Ride, Dispatch, Driver Assignment, Notification, Payment, Logging, Metrics, Tracing, and Alerts"
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
                stroke={ringColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                style={{ strokeDashoffset: ringOffset, rotate: -90, transformOrigin: "50% 50%" }}
                animate={{ stroke: ringColor }}
                transition={{ duration: 0.5 }}
              />

              {isWaking && (
                <motion.circle
                  className="engineering-reconciler"
                  cx={CENTER}
                  cy={CENTER}
                  r={5}
                  fill={isHealing ? "var(--healing)" : "var(--gold-bright)"}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              )}

              {pipelineStages.map((stage, i) => {
                const a = nodeAngle(i);
                const p = point(a, RADIUS);
                const lp = point(a, LABEL_RADIUS);
                const isActive = i === activeIndex;
                const isFailNode = isActive && isTrouble && i === FAILURE_INDEX;
                const isHealNode = isActive && isHealing && i === FAILURE_INDEX;
                const isDependency = i === DEPENDENCY_INDEX && isTrouble;
                return (
                  <g key={stage.id} opacity={isDependency ? 0.35 : 1}>
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 7 : 4.5}
                      fill={
                        isFailNode
                          ? "var(--crimson-bright)"
                          : isHealNode
                            ? "var(--healing)"
                            : isActive
                              ? "var(--gold-bright)"
                              : "var(--bg-elevated)"
                      }
                      stroke={isActive ? "transparent" : "var(--line-strong)"}
                      strokeWidth={1}
                      animate={{ r: isActive ? 7 : 4.5 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <text
                      x={lp.x}
                      y={lp.y}
                      className={`engineering-node-label ${
                        isFailNode ? "is-failing" : isActive ? "is-active" : ""
                      }`}
                    >
                      {stage.name}
                    </text>
                  </g>
                );
              })}

              <motion.circle
                cx={cx}
                cy={cy}
                r={9}
                fill={nodeColor}
                animate={{
                  fill: nodeColor,
                  scale: isAlert ? [1, 1.25, 0.9, 1.15, 1] : 1
                }}
                transition={
                  isAlert
                    ? { scale: { duration: 1.1, repeat: Infinity, ease: "easeInOut" } }
                    : { duration: 0.4 }
                }
                style={{
                  filter: isTrouble
                    ? "drop-shadow(0 0 10px var(--crimson))"
                    : isHealing
                      ? "drop-shadow(0 0 10px var(--healing))"
                      : "drop-shadow(0 0 10px var(--gold-soft))"
                }}
              />
            </svg>

            <div className={`engineering-heartbeat ${isTrouble ? "is-failing" : ""}`}>
              <svg viewBox="0 0 200 34" preserveAspectRatio="none">
                <g
                  className="engineering-heartbeat-wave"
                  style={{ transform: `scaleY(${AMPLITUDE[phase]})` }}
                >
                  <path d={HEARTBEAT_PATH} />
                </g>
              </svg>
            </div>

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
                    <p className="engineering-caption-title">{activeStage.name}</p>
                    <p className="engineering-caption-role">{activeStage.role}</p>
                    {activeStage.badge && (
                      <p className="engineering-instrument">
                        {instrumentCopy[activeStage.badge]}
                      </p>
                    )}
                    {isLastStage && <p className="engineering-close">{engineeringClose}</p>}
                  </motion.div>
                )}
                {phase === "impact" && (
                  <motion.div
                    key="impact"
                    className="engineering-caption-inner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="engineering-caption-title">Dispatch stops answering.</p>
                    <p className="engineering-caption-role">{engineeringImpactNote}</p>
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
                    <p className="engineering-caption-role is-failing">{engineeringFailureNote}</p>
                  </motion.div>
                )}
                {phase === "silence" && (
                  <motion.div
                    key="silence"
                    className="engineering-caption-inner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="engineering-caption-title is-failing">&nbsp;</p>
                  </motion.div>
                )}
                {phase === "retry" && (
                  <motion.div
                    key="retry"
                    className="engineering-caption-inner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="engineering-caption-title">Retrying.</p>
                    <p className="engineering-caption-role">{engineeringRetryNote}</p>
                  </motion.div>
                )}
                {phase === "healing" && (
                  <motion.div
                    key="healing"
                    className="engineering-caption-inner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="engineering-caption-title">Healing.</p>
                    <p className="engineering-caption-role">{engineeringReconciliationNote}</p>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="engineering-log">
              <AnimatePresence mode="wait">
                <motion.p
                  key={logLine}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {logLine}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
