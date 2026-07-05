"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

export function MaskReveal({
  children,
  as: Tag = "span",
  delay = 0,
  className
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  return (
    <Tag className={`mask-reveal ${className ?? ""}`}>
      <motion.span
        className="mask-reveal-inner"
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
