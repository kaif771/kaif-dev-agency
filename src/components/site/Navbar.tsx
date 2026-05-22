"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

const LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Work", href: "#projects" },
  { label: "Intake", href: "#contact" },
];

export default function Navbar() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const smooth = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const next = window.scrollY > 14;
      setScrolled((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleAnchor = useMemo(() => {
    return (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href.startsWith("#")) return;

      e.preventDefault();

      const offset = -96;

      if (smooth?.scrollTo) {
        smooth.scrollTo(href, { offset });
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    };
  }, [smooth, prefersReducedMotion]);

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4">
      <div
        data-scrolled={scrolled ? "true" : "false"}
        className="mx-auto max-w-7xl glass-panel rounded-full px-5 py-3 flex items-center justify-between border-black/8 transition-[background,border-color] duration-300 data-[scrolled=true]:border-black/12"
      >
        <a
          href="#top"
          onClick={handleAnchor("#top")}
          className="flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.28em] text-cyber-text"
          aria-label="Scroll to top"
        >
          <span className="text-cyber-blue">{"///"}</span>
          <span className="font-black">KAIF</span>
          <span className="text-cyber-muted">STUDIO</span>
        </a>

        <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] tracking-[0.22em] text-cyber-muted">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleAnchor(l.href)}
              className="hover:text-cyber-text transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Magnetic className="hidden sm:block">
          <a
            href="#contact"
            onClick={handleAnchor("#contact")}
            className="inline-flex items-center gap-2 rounded-full bg-cyber-blue text-white px-4 py-2 text-xs font-semibold transition-transform duration-300 hover:brightness-105"
          >
            Start a project <ArrowUpRight className="h-4 w-4" />
          </a>
        </Magnetic>
      </div>
    </header>
  );
}
