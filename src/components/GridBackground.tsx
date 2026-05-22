"use client";

import { useEffect, useRef } from "react";

export default function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const update = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const x = lastX - rect.left;
      const y = lastY - rect.top;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
      el.style.setProperty("--spot-opacity", "1");
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    const onLeave = () => {
      el.style.setProperty("--spot-opacity", "0");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden bg-cyber-bg"
    >
      {/* Subtle technical grid (animated very slowly) */}
      <div className="absolute inset-0 studio-grid" />

      {/* Ambient lighting layers */}
      <div className="absolute inset-0 studio-lights" />

      {/* Mouse-follow spotlight (GPU-cheap, no React re-renders) */}
      <div className="absolute inset-0 studio-spotlight" />

      {/* Grain / noise overlay */}
      <div className="absolute inset-0 studio-noise" />
    </div>
  );
}
