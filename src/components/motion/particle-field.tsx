"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Particle = {
  left: number;
  top: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  opacity: number;
};

export function ParticleField({ count = 36 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 97.13;
      const rand = (n: number) => {
        const x = Math.sin(seed + n) * 10000;
        return x - Math.floor(x);
      };
      return {
        left: rand(1) * 100,
        top: rand(2) * 100,
        driftX: (rand(3) - 0.5) * 60,
        driftY: (rand(4) - 0.5) * 60,
        duration: 10 + rand(5) * 14,
        delay: rand(6) * 6,
        opacity: 0.12 + rand(7) * 0.28
      };
    });
  }, [count]);

  if (!mounted) {
    return <div className="problem-particles" aria-hidden="true" />;
  }

  return (
    <div className="problem-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="problem-particle"
          style={{ left: `${p.left}%`, top: `${p.top}%`, opacity: p.opacity }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
