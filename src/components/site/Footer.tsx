"use client";

import React, { useLayoutEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";

export default function Footer() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scopeRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  useRevealOnScroll(scopeRef, {
    selector: "[data-reveal]",
    y: 14,
    start: "top 92%",
    duration: 0.9,
    stagger: 0.06,
    once: true,
  });

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const line = lineRef.current;
    const scope = scopeRef.current;
    if (!line || !scope) return;

    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: "0% 50%" },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope,
            start: "top 95%",
            once: true,
          },
        }
      );
    }, scope);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer ref={scopeRef} className="pb-14">
      <div className="glass-panel rounded-3xl border-white/8 overflow-hidden">
        <div className="px-7 sm:px-10 pt-8">
          <div
            ref={lineRef}
            className="h-px w-full bg-gradient-to-r from-cyber-blue/70 via-white/15 to-cyber-green/60"
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6">
              <div
                data-reveal
                className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
              >
                Kaif Dev Agency
              </div>
              <div data-reveal className="mt-3 text-xl font-black text-cyber-text">
                A lean engineering studio.
              </div>
              <p data-reveal className="mt-3 max-w-md text-sm leading-relaxed text-cyber-muted">
                Built with Next.js App Router, Tailwind, Lenis, GSAP — and a strict obsession with
                performance.
              </p>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-6">
              <div>
                <div
                  data-reveal
                  className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
                >
                  Sections
                </div>
                <div data-reveal className="mt-3 flex flex-col gap-2 text-sm">
                  {[
                    { label: "Capabilities", href: "#capabilities" },
                    { label: "Work", href: "#projects" },
                    { label: "Intake", href: "#contact" },
                  ].map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="text-cyber-text/90 hover:text-cyber-text transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <div
                  data-reveal
                  className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
                >
                  Contact
                </div>
                <div data-reveal className="mt-3 text-sm text-cyber-muted">
                  <div className="text-cyber-text/90">kaifdevagency@gmail.com</div>
                  <div className="mt-2">Maharashtra, India</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 pt-6">
            <div data-reveal className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted">
              © {new Date().getFullYear()} KAIF DEV AGENCY
            </div>
            <div data-reveal className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted">
              BUILD · SHIP · POLISH
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
