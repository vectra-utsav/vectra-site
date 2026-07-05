"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { openingLines } from "@/data/vectra";

const HOLD_MS = [2200, 1500, 1500, 2600];

export function OpeningSequence({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (closing) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }

    const isLast = index >= openingLines.length - 1;
    const t = setTimeout(() => {
      if (isLast) {
        setClosing(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, HOLD_MS[index] ?? 1800);
    return () => clearTimeout(t);
  }, [index, closing, onDone]);

  useEffect(() => {
    document.documentElement.style.overflow = closing ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [closing]);

  function skip() {
    setClosing(true);
  }

  return (
    <AnimatePresence>
      {!closing && (
        <motion.div
          className="opening-sequence"
          onClick={skip}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="opening-mark">Vectra</span>
          <AnimatePresence mode="wait">
            {index < openingLines.length && (
              <motion.p
                key={index}
                className="opening-word"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {openingLines[index]}
              </motion.p>
            )}
          </AnimatePresence>
          <span className="opening-skip">Enter</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
