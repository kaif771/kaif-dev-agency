"use client";

import React, { useRef } from "react";
import { Bot, Cpu, Database, Gauge } from "lucide-react";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";

const STACK = [
  "Next.js (App Router)",
  "React",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Tailwind CSS",
];

export default function Capabilities() {
  const scopeRef = useRef<HTMLElement | null>(null);

  useRevealOnScroll(scopeRef, {
    selector: "[data-reveal]",
    y: 18,
    start: "top 84%",
    duration: 0.95,
    stagger: 0.08,
    once: true,
  });

  return (
    <section ref={scopeRef} id="capabilities" className="mt-16 sm:mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div
            data-reveal
            className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase"
          >
            Capabilities
          </div>
          <h2
            data-reveal
            className="mt-3 text-3xl sm:text-4xl lg:text-[44px] font-black tracking-[-0.02em] text-cyber-text"
          >
            Built like an engineering studio.
          </h2>
        </div>

        <p
          data-reveal
          className="max-w-xl text-base sm:text-[18px] leading-relaxed text-cyber-text font-medium"
        >
          Minimal surface area. Strong types. Predictable performance. The goal is always the same:
          ship a product that feels expensive and stays fast.
        </p>
      </div>

      <div data-reveal className="mt-8 flex flex-wrap gap-2">
        {STACK.map((tech) => (
          <span
            key={tech}
            className="cyber-badge rounded-full px-4 py-2.5 text-sm font-mono font-bold tracking-[0.05em]"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div data-reveal className="md:col-span-7 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">
                ARCHITECTURE
              </div>
              <div className="mt-2 text-xl font-bold text-cyber-text">
                App Router systems that stay maintainable.
              </div>
              <p className="mt-3 text-base leading-relaxed text-cyber-text font-medium">
                Clean server/client boundaries, typed request contracts, and modular UI composition.
                The repo you get is the repo you can grow.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-blue shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Typed data model + validation",
              "Composable UI primitives",
              "API route isolation",
              "ESLint + strict TS",
            ].map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-black/8 bg-white/70 px-4 py-3 text-base font-semibold text-cyber-text shadow-sm"
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="md:col-span-5 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">
                AI SYSTEMS
              </div>
              <div className="mt-2 text-xl font-bold text-cyber-text">
                RAG and agents, without the chaos.
              </div>
              <p className="mt-3 text-base leading-relaxed text-cyber-text font-medium">
                Tooling that’s testable and observable: prompt boundaries, vector search, and safe
                serverless orchestration.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-green shrink-0">
              <Bot className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-4.5 font-mono text-sm text-cyber-muted font-medium">
            <div className="text-cyber-text font-semibold">pipeline.rag(query)</div>
            <div className="mt-2">→ retrieve · rerank · cite</div>
            <div>→ tool-call · guard</div>
            <div className="mt-2 text-cyber-green font-bold">✓ response stable</div>
          </div>
        </div>

        <div data-reveal className="md:col-span-5 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">
                PERFORMANCE
              </div>
              <div className="mt-2 text-xl font-bold text-cyber-text">
                Speed as a feature.
              </div>
              <p className="mt-3 text-base leading-relaxed text-cyber-text font-medium">
                Bundle discipline, predictable hydration, and motion that respects the main thread.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-blue shrink-0">
              <Gauge className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { k: "LCP", v: "≤ 2.5s" },
              { k: "CLS", v: "≤ 0.1" },
              { k: "TTFB", v: "low" },
              { k: "JS", v: "lean" },
            ].map((m) => (
              <div
                key={m.k}
                className="rounded-2xl border border-black/8 bg-white/70 px-4 py-3.5 shadow-sm"
              >
                <div className="font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text">
                  {m.k}
                </div>
                <div className="mt-1 text-base font-bold text-cyber-text">{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="md:col-span-7 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">
                DATA
              </div>
              <div className="mt-2 text-xl font-bold text-cyber-text">
                Schemas that scale cleanly.
              </div>
              <p className="mt-3 text-base leading-relaxed text-cyber-text font-medium">
                MongoDB models designed around query shape. Index strategy is part of the product.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-green shrink-0">
              <Database className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              "Index-first querying",
              "Aggregation pipelines",
              "Operational safety",
            ].map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-black/8 bg-white/70 px-4 py-3.5 text-base font-semibold text-cyber-text shadow-sm"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
