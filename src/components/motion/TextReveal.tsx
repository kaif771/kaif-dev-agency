"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

type TextRevealProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: "mount" | "scroll";
  start?: string;
};

export default function TextReveal({
  text,
  as = "span",
  className,
  delay = 0,
  stagger = 0.06,
  trigger = "mount",
  start = "top 85%",
}: TextRevealProps) {
  const Tag = as;
  const prefersReducedMotion = usePrefersReducedMotion();

  const words = useMemo(() => text.trim().split(/\s+/g), [text]);
  const scopeRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    if (prefersReducedMotion) return;

    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const wordEls = q("[data-word]") as HTMLElement[];
      if (!wordEls.length) return;

      gsap.set(wordEls, {
        yPercent: 120,
        opacity: 0,
        rotateX: 14,
        transformOrigin: "50% 100%",
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        ...(trigger === "scroll"
          ? {
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
              },
            }
          : {}),
      });

      tl.to(wordEls, {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.05,
        stagger,
        delay,
        onComplete: () => gsap.set(wordEls, { clearProps: "willChange" }),
      });
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion, delay, stagger, trigger, start]);

  return (
    <Tag className={className} aria-label={text}>
      <span ref={scopeRef}>
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden align-bottom">
              <span data-word className="inline-block">
                {word}
              </span>
            </span>
            {index < words.length - 1 ? <span aria-hidden="true"> </span> : null}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
}
