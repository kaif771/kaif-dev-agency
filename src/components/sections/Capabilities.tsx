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
            className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
          >
            Capabilities
          </div>
          <h2
            data-reveal
            className="mt-3 text-2xl sm:text-3xl font-black tracking-[-0.02em] text-cyber-text"
          >
            Built like an engineering studio.
          </h2>
        </div>

        <p
          data-reveal
          className="max-w-xl text-sm leading-relaxed text-cyber-muted"
        >
          Minimal surface area. Strong types. Predictable performance. The goal is always the same:
          ship a product that feels expensive and stays fast.
        </p>
      </div>

      <div data-reveal className="mt-8 flex flex-wrap gap-2">
        {STACK.map((tech) => (
          <span
            key={tech}
            className="cyber-badge rounded-full px-3 py-1.5 text-[11px] tracking-[0.12em]"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div data-reveal className="md:col-span-7 glass-panel rounded-3xl p-7 border-black/8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                ARCHITECTURE
              </div>
              <div className="mt-2 text-lg font-bold text-cyber-text">
                App Router systems that stay maintainable.
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cyber-muted">
                Clean server/client boundaries, typed request contracts, and modular UI composition.
                The repo you get is the repo you can grow.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-blue">
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
                className="rounded-2xl border border-black/8 bg-white/70 px-4 py-3 text-sm text-cyber-muted"
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="md:col-span-5 glass-panel rounded-3xl p-7 border-black/8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                AI SYSTEMS
              </div>
              <div className="mt-2 text-lg font-bold text-cyber-text">
                RAG and agents, without the chaos.
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cyber-muted">
                Tooling that’s testable and observable: prompt boundaries, vector search, and safe
                serverless orchestration.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-green">
              <Bot className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-4 font-mono text-[12px] text-cyber-muted">
            <div className="text-cyber-text">pipeline.rag(query)</div>
            <div className="mt-2">→ retrieve · rerank · cite</div>
            <div>→ tool-call · guard</div>
            <div className="mt-2 text-cyber-green">✓ response stable</div>
          </div>
        </div>

        <div data-reveal className="md:col-span-5 glass-panel rounded-3xl p-7 border-black/8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                PERFORMANCE
              </div>
              <div className="mt-2 text-lg font-bold text-cyber-text">
                Speed as a feature.
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cyber-muted">
                Bundle discipline, predictable hydration, and motion that respects the main thread.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-blue">
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
                className="rounded-2xl border border-black/8 bg-white/70 px-4 py-3"
              >
                <div className="font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                  {m.k}
                </div>
                <div className="mt-1 text-sm font-semibold text-cyber-text">{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="md:col-span-7 glass-panel rounded-3xl p-7 border-black/8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
                DATA
              </div>
              <div className="mt-2 text-lg font-bold text-cyber-text">
                Schemas that scale cleanly.
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cyber-muted">
                MongoDB models designed around query shape. Index strategy is part of the product.
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-3 text-cyber-green">
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
                className="rounded-2xl border border-black/8 bg-white/70 px-4 py-3 text-sm text-cyber-muted"
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
