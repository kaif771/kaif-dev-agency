"use client";

import { useEffect, useState, useRef } from "react";

export default function GridBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden bg-[#050508]"
    >
      {/* Drifting Cyber Grid Line Backdrop */}
      <div 
        className="absolute inset-0 cyber-grid animate-grid-drift opacity-[0.35]" 
        style={{
          animationDuration: "40s"
        }}
      />

      {/* Dynamic mouse follow spotlight */}
      {isHovering && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.07), rgba(189, 0, 255, 0.04), transparent 70%)`,
          }}
        />
      )}

      {/* Cybernetic ambient background bubbles */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-cyber-blue/5 rounded-full filter blur-[100px] animate-float" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-cyber-violet/5 rounded-full filter blur-[120px] animate-pulse-slow" />
      <div className="absolute top-[40%] right-[30%] w-80 h-80 bg-cyber-green/3 rounded-full filter blur-[90px] animate-float [animation-delay:2s]" />

      {/* Cyberpunk Scanlines Layer */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30" />
    </div>
  );
}
