"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

type CounterProps = {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

function formatNumber(value: number, decimals: number) {
  const fixed = value.toFixed(decimals);
  // Keep locale formatting without destroying decimals.
  const [whole, frac] = fixed.split(".");
  const formattedWhole = Number(whole).toLocaleString();
  return decimals ? `${formattedWhole}.${frac}` : formattedWhole;
}

export default function Counter({
  to,
  from = 0,
  duration = 1.2,
  decimals = 0,
  prefix,
  suffix,
  className,
}: CounterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);

  const finalText = useMemo(() => {
    const n = formatNumber(to, decimals);
    return `${prefix ?? ""}${n}${suffix ?? ""}`;
  }, [to, decimals, prefix, suffix]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = finalText;
      return;
    }

    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const obj = { value: from };

      gsap.to(obj, {
        value: to,
        duration,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          const n = formatNumber(obj.value, decimals);
          el.textContent = `${prefix ?? ""}${n}${suffix ?? ""}`;
        },
        onComplete: () => {
          el.textContent = finalText;
        },
      });
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion, to, from, duration, decimals, prefix, suffix, finalText]);

  return (
    <span ref={ref} className={className}>
      {finalText}
    </span>
  );
}
