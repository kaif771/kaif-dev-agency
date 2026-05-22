"use client";

import React, { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number;
  perspective?: number;
  scale?: number;
};

export default function Tilt({
  children,
  className,
  maxRotate = 6,
  perspective = 900,
  scale = 1.02,
}: TiltProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) return;

    let rafId = 0;
    let rect: DOMRect | null = null;
    let lastX = 0;
    let lastY = 0;

    const update = () => {
      rafId = 0;
      if (!rect) rect = el.getBoundingClientRect();

      const px = (lastX - rect.left) / rect.width;
      const py = (lastY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * (maxRotate * 2);
      const rotateX = (0.5 - py) * (maxRotate * 2);

      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0) scale(${scale})`;
    };

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.style.willChange = "transform";
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    const onLeave = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      rect = null;
      el.style.transform = "";
      el.style.willChange = "";
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion, maxRotate, perspective, scale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
