"use client";

import React, { useRef, useState, useEffect } from "react";
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

  const [activeTab, setActiveTab] = useState<"schema" | "budget" | "domain">("schema");
  const [dbStats, setDbStats] = useState({
    totalLeads: 13,
    averageBudget: 850,
    indexStrategy: "budget_1_createdAt_-1",
    queryExecutionTimeMs: 0.45,
    offline: false,
  });
  const [pipelineOutput, setPipelineOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/data-stats?action=stats");
        const json = await res.json();
        if (json.success) {
          setDbStats({
            totalLeads: json.data.totalLeads,
            averageBudget: json.data.averageBudget,
            indexStrategy: json.data.indexStrategy,
            queryExecutionTimeMs: json.data.queryExecutionTimeMs,
            offline: !!json.offline,
          });
        }
      } catch (err) {
        console.warn("Failed to fetch database metrics", err);
      }
    };
    fetchStats();
  }, []);

  const handleTabChange = async (tab: "schema" | "budget" | "domain") => {
    setActiveTab(tab);
    if (tab === "schema") {
      setPipelineOutput(null);
      return;
    }

    setIsLoading(true);
    try {
      const action = tab === "budget" ? "pipeline-budget" : "pipeline-domains";
      const res = await fetch(`/api/data-stats?action=${action}`);
      const json = await res.json();
      if (json.success) {
        setPipelineOutput({
          query: json.query,
          latencyMs: json.queryExecutionTimeMs,
          results: json.results,
          offline: !!json.offline,
        });
      }
    } catch (err) {
      console.warn("Failed to execute pipeline", err);
    } finally {
      setIsLoading(false);
    }
  };

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

        <div data-reveal className="md:col-span-7 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm flex flex-col justify-between">
          <div>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {/* Real-time stats indicators */}
                <div className="flex-1 rounded-2xl border border-black/8 bg-black/[0.02] p-4 flex flex-col justify-between gap-3 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] tracking-wider text-cyber-text font-mono font-bold">
                    <span>LIVE DB METRICS</span>
                    <span className="flex items-center gap-1.5 text-cyber-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>
                      {dbStats.offline ? "SIMULATED" : "ATLAS"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white border border-black/8 rounded-xl p-2 sm:p-2.5 shadow-sm">
                      <div className="text-[10px] font-mono font-bold text-cyber-muted tracking-wider">INTAKES</div>
                      <div className="text-lg sm:text-xl font-black text-cyber-text mt-0.5">{dbStats.totalLeads}</div>
                    </div>
                    <div className="bg-white border border-black/8 rounded-xl p-2 sm:p-2.5 shadow-sm">
                      <div className="text-[10px] font-mono font-bold text-cyber-muted tracking-wider">AVG PROJECT</div>
                      <div className="text-lg sm:text-xl font-black text-cyber-text mt-0.5">${dbStats.averageBudget}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-cyber-text">
                    <div className="flex justify-between bg-white/70 border border-black/8 rounded-xl px-2.5 py-1.5 shadow-sm">
                      <span>Index State</span>
                      <span className="text-cyber-green">budget_1_createdAt_-1</span>
                    </div>
                    <div className="flex justify-between bg-white/70 border border-black/8 rounded-xl px-2.5 py-1.5 shadow-sm">
                      <span>Query Latency</span>
                      <span className="text-cyber-blue">{dbStats.queryExecutionTimeMs} ms</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col rounded-2xl border border-black/8 overflow-hidden min-h-[220px]">
                {/* Pipeline Interactive Tabs */}
                <div className="flex border-b border-black/8 bg-black/[0.02] p-1 gap-1">
                  {[
                    { id: "schema", label: "Schema" },
                    { id: "budget", label: "Budget tiers" },
                    { id: "domain", label: "Domains" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTabChange(t.id as any)}
                      className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-lg transition ${
                        activeTab === t.id
                          ? "bg-white border border-black/8 text-cyber-blue shadow-sm"
                          : "text-cyber-text hover:bg-white/40"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Code/Pipeline Console */}
                <div className="flex-1 bg-white p-3 font-mono text-[11px] overflow-y-auto text-cyber-text relative scrollbar-thin">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-4 h-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-bold text-cyber-blue uppercase tracking-wider">Aggregating...</span>
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "schema" && (
                    <pre className="leading-normal">
                      <span className="text-purple-600 font-bold">const</span> <span className="text-blue-600 font-bold">LeadSchema</span> = <span className="text-purple-600 font-bold">new</span> <span className="text-blue-600">Schema</span>(&#123;
  name: &#123; <span className="text-teal-600">type</span>: String, <span className="text-teal-600">required</span>: <span className="text-red-500">true</span> &#125;,
  email: &#123; <span className="text-teal-600">type</span>: String, <span className="text-teal-600">unique</span>: <span className="text-red-500">true</span> &#125;,
  budget: &#123; <span className="text-teal-600">type</span>: Number, <span className="text-teal-600">index</span>: <span className="text-red-500">true</span> &#125;,
  createdAt: &#123; <span className="text-teal-600">type</span>: Date, <span className="text-teal-600">default</span>: Date.now &#125;
&#125;);
<span className="text-gray-400">// Index strategy compiled safely inside Atlas</span>
LeadSchema.index(&#123; budget: <span className="text-amber-600">1</span>, createdAt: <span className="text-amber-600">-1</span> &#125;);
                    </pre>
                  )}

                  {activeTab !== "schema" && pipelineOutput && (
                    <div className="space-y-2">
                      <div className="text-purple-600 font-bold text-[10px] break-all leading-normal">
                        {pipelineOutput.query}
                      </div>
                      <div className="border-t border-black/5 pt-1.5 leading-normal">
                        <span className="text-gray-400 font-bold">// Latency: {pipelineOutput.latencyMs} ms</span>
                        <pre className="text-emerald-600 font-semibold mt-1 overflow-x-auto">
                          {JSON.stringify(pipelineOutput.results, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
