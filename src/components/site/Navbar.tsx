"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

const LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Work", href: "#projects" },
  { label: "Studio Assistant", href: "#studio", isDrawerTrigger: true },
  { label: "Apply", href: "#contact" },
];

export default function Navbar() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const smooth = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    return (href: string, isDrawerTrigger?: boolean) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      setIsMobileMenuOpen(false);
      e.preventDefault();

      if (isDrawerTrigger) {
        window.dispatchEvent(new CustomEvent("open-studio-assistant"));
        return;
      }

      if (!href.startsWith("#")) return;

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
        className="mx-auto max-w-7xl glass-panel rounded-full px-7 py-3 flex items-center justify-between border-black/8 transition-[background,border-color,border-radius] duration-300 data-[scrolled=true]:border-black/12"
      >
        <a
          href="#top"
          onClick={handleAnchor("#top")}
          className="flex items-center gap-1.5 text-lg tracking-tight font-black text-cyber-text"
          aria-label="Scroll to top"
        >
          <span className="text-cyber-blue font-black">Kaif</span>
          <span className="text-cyber-muted font-normal text-sm tracking-wider uppercase opacity-80">Studio</span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-cyber-text/80 font-medium">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleAnchor(l.href, l.isDrawerTrigger)}
              className="hover:text-cyber-blue transition-colors apple-nav-link flex items-center gap-1"
            >
              {l.isDrawerTrigger && <Sparkles className="h-3 w-3 text-cyber-blue animate-pulse" />}
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA and Hamburger */}
        <div className="flex items-center gap-3">
          <Magnetic className="hidden sm:block">
            <a
              href="#contact"
              onClick={handleAnchor("#contact")}
              className="inline-flex items-center gap-1.5 rounded-full bg-black text-white hover:bg-black/90 px-5.5 py-2.5 text-sm font-semibold transition-all duration-300"
            >
              Start a build <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Magnetic>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden p-2 rounded-full text-cyber-text hover:bg-black/[0.04] transition-colors border border-black/5"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl glass-panel rounded-3xl p-5 border-black/8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4 text-sm font-semibold text-cyber-text">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={handleAnchor(l.href, l.isDrawerTrigger)}
                className="py-2.5 border-b border-black/5 hover:text-cyber-blue transition-colors flex items-center gap-1.5"
              >
                {l.isDrawerTrigger && <Sparkles className="h-3.5 w-3.5 text-cyber-blue animate-pulse" />}
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={handleAnchor("#contact")}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-black text-white py-3 text-sm font-semibold transition-all duration-300 hover:brightness-105"
            >
              Start a build <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
