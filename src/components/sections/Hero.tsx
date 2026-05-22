"use client";

import React, { useLayoutEffect, useRef } from "react";
import { ArrowRight, CheckCircle2, Terminal } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import Tilt from "@/components/motion/Tilt";
import Counter from "@/components/motion/Counter";
import TextReveal from "@/components/motion/TextReveal";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { getGsap } from "@/lib/motion/gsap";

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const scopeRef = useRef<HTMLElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  useRevealOnScroll(scopeRef, {
    selector: "[data-reveal]",
    y: 20,
    start: "top 88%",
    duration: 1.0,
    stagger: 0.09,
    once: true,
  });

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    const right = rightColRef.current;
    if (!scope || !right) return;
    if (prefersReducedMotion) return;

    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-hero-panel]");
      if (panels.length) {
        gsap.fromTo(
          panels,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.1,
            clearProps: "transform",
          }
        );
      }

      // Micro parallax on scroll (kept minimal to avoid jitter).
      const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      parallax.forEach((el, index) => {
        gsap.to(el, {
          y: -18 - index * 8,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "+=520",
            scrub: 0.8,
          },
        });
      });
    }, right);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={scopeRef} id="top" className="pt-28 sm:pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: cinematic headline + CTA */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-7 sm:p-10 border-white/8 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-56 w-[820px] -translate-x-1/2 rounded-full bg-cyber-blue/10 blur-3xl" />
            <div className="absolute -bottom-40 right-10 h-72 w-72 rounded-full bg-cyber-green/8 blur-3xl" />
          </div>

          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-25" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-green" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.28em] text-cyber-muted uppercase">
              Accepting two builds · May 2026
            </span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.12] tracking-[-0.03em] text-cyber-text">
            <TextReveal
              as="span"
              text="Premium product engineering for modern web + AI"
              className="block"
              delay={0.02}
              stagger={0.045}
              trigger="mount"
            />
          </h1>

          <p
            data-reveal
            className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-cyber-muted"
          >
            Kaif Dev Agency is a lean engineering studio. We design systems, ship code, and optimize
            the details that decide performance, polish, and conversion.
          </p>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic className="inline-block">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyber-blue px-6 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:brightness-105"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/2 px-6 py-3.5 text-sm font-semibold text-cyber-text transition-colors hover:bg-white/4"
            >
              View case studies
            </a>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono tracking-[0.22em] text-cyber-muted">
              <CheckCircle2 className="h-4 w-4 text-cyber-green" />
              <span>App Router · Tailwind · TypeScript</span>
            </div>
          </div>

          {/* Metrics */}
          <div data-reveal className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/2 px-4 py-4">
              <div className="text-2xl font-bold tracking-[-0.02em] text-cyber-text">
                <Counter to={99} suffix="+" />
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                LIGHTHOUSE
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/2 px-4 py-4">
              <div className="text-2xl font-bold tracking-[-0.02em] text-cyber-text">
                <Counter to={120} suffix="ms" />
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                API P95
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/2 px-4 py-4">
              <div className="text-2xl font-bold tracking-[-0.02em] text-cyber-text">
                <Counter to={0} />
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                CRASHES
              </div>
            </div>
          </div>
        </div>

        {/* Right: terminal panel + floating engineering UI */}
        <div
          ref={rightColRef}
          className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border-white/8 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-12 h-44 w-44 rounded-full bg-cyber-blue/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/6 blur-3xl" />
          </div>

          <Tilt className="relative" maxRotate={5}>
            <div data-hero-panel data-parallax className="rounded-2xl border border-white/10 bg-black/35 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyber-blue/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cyber-green/70" />
                </div>
                <div className="font-mono text-[10px] tracking-[0.28em] text-cyber-muted">
                  terminal · build
                </div>
              </div>

              <div className="px-4 py-4 font-mono text-[12px] leading-relaxed text-cyber-muted">
                <div className="text-cyber-text">$ pnpm ship --target=prod</div>
                <div className="mt-2">→ compiling routes…</div>
                <div>→ optimizing bundles…</div>
                <div className="text-cyber-green mt-2">✓ build stable</div>
                <div className="text-cyber-muted">✓ checks: types · lint · perf</div>
                <div className="mt-3 flex items-center gap-2 text-cyber-muted">
                  <Terminal className="h-4 w-4 text-cyber-blue" />
                  <span className="tracking-[0.22em] text-[10px]">READY · localhost:5000</span>
                </div>
              </div>
            </div>
          </Tilt>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div data-hero-panel className="rounded-2xl border border-white/10 bg-white/2 p-4" data-parallax>
              <div className="font-mono text-[10px] tracking-[0.32em] text-cyber-muted">STACK</div>
              <div className="mt-2 text-sm font-semibold text-cyber-text">Next.js · TS · DB</div>
              <div className="mt-1 text-xs text-cyber-muted">App Router, clean APIs, typed data.</div>
            </div>
            <div data-hero-panel className="rounded-2xl border border-white/10 bg-white/2 p-4" data-parallax>
              <div className="font-mono text-[10px] tracking-[0.32em] text-cyber-muted">MOTION</div>
              <div className="mt-2 text-sm font-semibold text-cyber-text">GSAP · Lenis</div>
              <div className="mt-1 text-xs text-cyber-muted">Scroll reveals with cleanup.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div data-reveal className="mt-6 glass-panel rounded-2xl border-white/8 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="marquee flex items-center gap-10 px-6 py-4">
            {[
              "ENGINEERING",
              "APP ROUTER",
              "PERFORMANCE",
              "AI INTEGRATIONS",
              "DESIGN SYSTEMS",
              "SHIP",
            ].map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] tracking-[0.32em] text-cyber-muted"
              >
                {t}
                <span className="ml-10 text-cyber-blue/60">•</span>
              </span>
            ))}
          </div>
          <div aria-hidden="true" className="marquee flex items-center gap-10 px-6 py-4">
            {[
              "ENGINEERING",
              "APP ROUTER",
              "PERFORMANCE",
              "AI INTEGRATIONS",
              "DESIGN SYSTEMS",
              "SHIP",
            ].map((t) => (
              <span
                key={`dup-${t}`}
                className="font-mono text-[11px] tracking-[0.32em] text-cyber-muted"
              >
                {t}
                <span className="ml-10 text-cyber-blue/60">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
