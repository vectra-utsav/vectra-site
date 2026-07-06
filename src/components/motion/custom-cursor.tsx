"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [grow, setGrow] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const enableFrame = requestAnimationFrame(() => setEnabled(true));
    document.body.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = 0;

    function paint() {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }

    function onMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    }

    function onOver(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest(
        'a, button, [data-cursor="grow"]'
      );
      setGrow(Boolean(el));
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("has-custom-cursor");
      cancelAnimationFrame(enableFrame);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return <div ref={ref} className={`custom-cursor ${grow ? "is-grow" : ""}`} />;
}
