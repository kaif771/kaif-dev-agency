"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { getGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
    }
  ) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // GSAP ticker uses seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Keep triggers in sync after layout changes.
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  const value = useMemo<SmoothScrollContextValue>(() => {
    return {
      get lenis(): Lenis | null {
        return lenisRef.current;
      },
      scrollTo: (target, options) => {
        const lenis = lenisRef.current;

        if (!lenis) {
          if (typeof target === "string") {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
            return;
          }
          if (typeof target === "number") {
            window.scrollTo({ top: target, behavior: "smooth" });
            return;
          }
          target.scrollIntoView({ behavior: "smooth" });
          return;
        }

        lenis.scrollTo(target, {
          offset: options?.offset ?? 0,
          duration: 1.1,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      },
    };
  }, []);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
