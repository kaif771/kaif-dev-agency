"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function BootSequence() {
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(() => reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;

    const t = window.setTimeout(() => setDone(true), 900);
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-[60] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="absolute inset-0 bg-cyber-bg" />

          <div className="absolute inset-0 studio-lights" />

          <div className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2">
            <div className="glass-panel rounded-3xl px-6 py-5 sm:px-8 sm:py-7">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-[11px] tracking-[0.35em] text-cyber-muted">
                  KAIF_DEV_AGENCY
                </div>
                <div className="font-mono text-[11px] tracking-[0.35em] text-cyber-muted">
                  INIT
                </div>
              </div>

              <div className="mt-3 h-px w-full bg-white/8" />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm sm:text-base font-semibold text-cyber-text">
                  Booting studio runtime
                </div>
                <div className="text-xs font-mono text-cyber-muted">lenis · gsap</div>
              </div>

              <div className="mt-4 overflow-hidden rounded-full bg-white/6">
                <motion.div
                  className="h-1.5 w-1/2 bg-cyber-blue"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
