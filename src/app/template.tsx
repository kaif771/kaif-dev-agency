"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import BootSequence from "@/components/site/BootSequence";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <>
      <BootSequence />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
