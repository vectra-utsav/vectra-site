"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isRequest: boolean;
};

const LINK_DISTANCE = 130;
const BASE_COUNT = 46;

/**
 * A quiet city, not a particle demo. Dots drift like traffic; when two
 * pass close enough a road briefly exists between them. One dot is the
 * request this whole site follows — brighter, steadier, foreshadowing
 * the pipeline in the Engineering chapter.
 */
export function CityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const styles = getComputedStyle(document.documentElement);
    const gold = styles.getPropertyValue("--gold").trim() || "#b08d3e";
    const goldBright = styles.getPropertyValue("--gold-bright").trim() || "#d4af5a";

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;
    let density = 0.6;
    let speed = 1;

    function seed() {
      const count = Math.max(14, Math.round(BASE_COUNT * (width < 640 ? 0.55 : 1)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        isRequest: i === 0
      }));
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function readAmbience() {
      const root = getComputedStyle(document.documentElement);
      const d = parseFloat(root.getPropertyValue("--ambient-density"));
      const s = parseFloat(root.getPropertyValue("--ambient-speed"));
      density = Number.isFinite(d) ? d : 0.6;
      speed = Number.isFinite(s) ? s : 1;
    }

    function step() {
      raf = requestAnimationFrame(step);
      if (!visible) return;

      readAmbience();
      ctx.clearRect(0, 0, width, height);

      const activeCount = Math.max(10, Math.round(nodes.length * (0.5 + density * 0.5)));

      for (let i = 0; i < activeCount; i += 1) {
        const n = nodes[i];
        n.x += n.vx * speed;
        n.y += n.vy * speed;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      for (let i = 0; i < activeCount; i += 1) {
        for (let j = i + 1; j < activeCount; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.14 * (0.5 + density * 0.5);
            ctx.strokeStyle = `rgba(176, 141, 62, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < activeCount; i += 1) {
        const n = nodes[i];
        ctx.beginPath();
        if (n.isRequest) {
          ctx.fillStyle = goldBright;
          ctx.shadowColor = goldBright;
          ctx.shadowBlur = 8;
          ctx.arc(n.x, n.y, 2.6, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = gold;
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 0.55;
          ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    resize();

    if (reduced) {
      step();
      cancelAnimationFrame(raf);
      return () => {};
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="city-canvas" aria-hidden="true" />;
}
