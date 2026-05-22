"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Terminal, Sparkles, RefreshCw } from "lucide-react";
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

  const [aiOptimizeData, setAiOptimizeData] = useState<{
    command: string;
    trace: string[];
    recommendation: string;
    offline?: boolean;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiOptimize = async () => {
    setIsAiLoading(true);
    setAiOptimizeData(null);

    const targets = ["Next.js Hydration & CLS", "Database Query Scans", "Dynamic Chunks & Webpack", "Tailwind CSS Compilation"];
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];

    try {
      const res = await fetch("/api/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: randomTarget }),
      });
      const json = await res.json();
      if (json.success) {
        setTimeout(() => {
          setAiOptimizeData({
            command: json.data.command,
            trace: json.data.trace,
            recommendation: json.data.recommendation,
            offline: !!json.offline,
          });
          setIsAiLoading(false);
        }, 1200);
      }
    } catch (e) {
      console.error("AI compile error", e);
      setIsAiLoading(false);
    }
  };

  const handleResetTerminal = () => {
    setAiOptimizeData(null);
    setIsAiLoading(false);
  };

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
        <div className="lg:col-span-7 glass-panel rounded-3xl p-7 sm:p-10 border-black/8 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-56 w-[820px] -translate-x-1/2 rounded-full bg-cyber-blue/10 blur-3xl" />
            <div className="absolute -bottom-40 right-10 h-72 w-72 rounded-full bg-cyber-green/8 blur-3xl" />
          </div>

          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-black/[0.02] px-3.5 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-25" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-green" />
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-[0.18em] text-cyber-text font-bold uppercase">
              Accepting two builds · May 2026
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[54px] font-black leading-[1.1] tracking-[-0.03em] text-cyber-text">
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
            className="mt-6 max-w-xl text-base sm:text-[18px] leading-relaxed text-cyber-text font-medium"
          >
            Kaif Dev Agency is a lean engineering studio. We design systems, ship code, and optimize
            the details that decide performance, polish, and conversion.
          </p>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic className="inline-block">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-cyber-blue px-6 py-3.5 text-base font-semibold text-white transition-transform duration-300 hover:brightness-105"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-2xl border border-black/8 bg-white px-6 py-3.5 text-base font-semibold text-cyber-text transition-colors hover:bg-black/[0.03]"
            >
              View case studies
            </a>

            <div className="hidden sm:flex items-center gap-2 text-sm font-mono tracking-[0.15em] text-cyber-text font-bold">
              <CheckCircle2 className="h-4 w-4 text-cyber-green" />
              <span>App Router · Tailwind · TypeScript</span>
            </div>
          </div>

          {/* Metrics */}
          <div data-reveal className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-black/8 bg-white/70 px-4 py-4 shadow-sm">
              <div className="text-4xl font-black tracking-[-0.02em] text-cyber-text">
                <Counter to={99} suffix="+" />
              </div>
              <div className="mt-1.5 font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text">
                LIGHTHOUSE
              </div>
            </div>
            <div className="rounded-2xl border border-black/8 bg-white/70 px-4 py-4 shadow-sm">
              <div className="text-4xl font-black tracking-[-0.02em] text-cyber-text">
                <Counter to={120} suffix="ms" />
              </div>
              <div className="mt-1.5 font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text">
                API P95
              </div>
            </div>
            <div className="rounded-2xl border border-black/8 bg-white/70 px-4 py-4 shadow-sm">
              <div className="text-4xl font-black tracking-[-0.02em] text-cyber-text">
                <Counter to={0} />
              </div>
              <div className="mt-1.5 font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text">
                CRASHES
              </div>
            </div>
          </div>
        </div>

        {/* Right: terminal panel + floating engineering UI */}
        <div
          ref={rightColRef}
          className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border-black/8 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-12 h-44 w-44 rounded-full bg-cyber-blue/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-black/[0.02] blur-3xl" />
          </div>

          <Tilt className="relative" maxRotate={5}>
            <div data-hero-panel data-parallax className="rounded-2xl border border-black/8 bg-black/[0.04] overflow-hidden shadow-sm flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-black/8 bg-black/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyber-blue/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cyber-green/70" />
                </div>
                <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">
                  terminal · build
                </div>
              </div>

              <div className="px-5 py-5 font-mono text-sm leading-relaxed text-cyber-muted font-medium min-h-[175px]">
                {isAiLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="text-cyber-text font-bold">$ pnpm ship --optimize-ai</div>
                    <div className="text-cyber-blue font-bold flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                      → consulting Google Gemini AI...
                    </div>
                    <div className="text-gray-400">→ parsing bundle optimization paths...</div>
                    <div className="text-gray-400">→ optimizing component boundaries...</div>
                  </div>
                ) : aiOptimizeData ? (
                  <div className="space-y-2">
                    <div className="text-cyber-text font-bold flex items-center justify-between">
                      <span>$ pnpm ship --{aiOptimizeData.command}</span>
                      <span className="text-[9px] sm:text-[10px] text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded-md font-mono font-bold tracking-wider">
                        {aiOptimizeData.offline ? "SIMULATED AI" : "LIVE GEMINI"}
                      </span>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {aiOptimizeData.trace.map((line, idx) => (
                        <div
                          key={idx}
                          className={
                            line.startsWith("✓")
                              ? "text-cyber-green font-bold"
                              : line.startsWith("✗")
                              ? "text-red-500 font-bold"
                              : "text-cyber-muted"
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-black/8 pt-3 mt-3">
                      <div className="text-cyber-blue font-bold text-xs uppercase tracking-wider flex items-center gap-1 font-sans">
                        <Sparkles className="h-3.5 w-3.5 text-cyber-blue" />
                        GEMINI COMPILED ADVICE:
                      </div>
                      <p className="text-cyber-text text-sm font-semibold mt-1 leading-normal">
                        {aiOptimizeData.recommendation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-cyber-text font-semibold">$ pnpm ship --target=prod</div>
                    <div className="mt-2">→ compiling routes…</div>
                    <div>→ optimizing bundles…</div>
                    <div className="text-cyber-green mt-2 font-bold">✓ build stable</div>
                    <div className="text-cyber-muted">✓ checks: types · lint · perf</div>
                    <div className="mt-3.5 flex items-center gap-2 text-cyber-muted">
                      <Terminal className="h-4 w-4 text-cyber-blue" />
                      <span className="tracking-[0.15em] text-xs sm:text-sm font-bold text-cyber-text">READY · localhost:5000</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex border-t border-black/8 bg-black/[0.02] p-2 gap-2">
                {aiOptimizeData ? (
                  <button
                    onClick={handleResetTerminal}
                    className="flex-1 py-2 px-3 text-xs font-bold font-mono rounded-xl bg-white hover:bg-black/[0.03] border border-black/8 text-cyber-text flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset Compiler
                  </button>
                ) : (
                  <button
                    onClick={handleAiOptimize}
                    disabled={isAiLoading}
                    className="flex-1 py-2 px-3 text-xs font-bold font-mono rounded-xl bg-cyber-blue hover:brightness-105 text-white flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-50 active:scale-[0.98]"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    Optimize with Gemini AI
                  </button>
                )}
              </div>
            </div>
          </Tilt>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div data-hero-panel className="rounded-2xl border border-black/8 bg-white/70 p-4 shadow-sm" data-parallax>
              <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">STACK</div>
              <div className="mt-2 text-base font-bold text-cyber-text">Next.js · TS · DB</div>
              <div className="mt-1 text-base text-cyber-text font-medium">App Router, clean APIs, typed data.</div>
            </div>
            <div data-hero-panel className="rounded-2xl border border-black/8 bg-white/70 p-4 shadow-sm" data-parallax>
              <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">MOTION</div>
              <div className="mt-2 text-base font-bold text-cyber-text">GSAP · Lenis</div>
              <div className="mt-1 text-base text-cyber-text font-medium">Scroll reveals with cleanup.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div data-reveal className="mt-6 glass-panel rounded-2xl border-black/8 overflow-hidden">
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
                className="font-mono text-xs sm:text-sm tracking-[0.2em] text-cyber-text font-semibold"
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
                className="font-mono text-xs sm:text-sm tracking-[0.2em] text-cyber-text font-semibold"
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
