"use client";

import { useLayoutEffect } from "react";
import type React from "react";
import { getGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

type RevealOptions = {
  selector?: string;
  y?: number;
  start?: string;
  duration?: number;
  stagger?: number;
  once?: boolean;
};

export function useRevealOnScroll(
  scopeRef: React.RefObject<HTMLElement>,
  {
    selector = "[data-reveal]",
    y = 18,
    start = "top 82%",
    duration = 0.9,
    stagger = 0.08,
    once = true,
  }: RevealOptions = {}
) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    if (prefersReducedMotion) return;

    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope);
      const targets = q(selector) as HTMLElement[];
      if (!targets.length) return;

      gsap.set(targets, { willChange: "transform, opacity" });

      gsap.fromTo(
        targets,
        { opacity: 0, y, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: scope,
            start,
            once,
          },
          onComplete: () => gsap.set(targets, { clearProps: "willChange" }),
        }
      );
    }, scope);

    return () => ctx.revert();
  }, [scopeRef, prefersReducedMotion, selector, y, start, duration, stagger, once]);
}
