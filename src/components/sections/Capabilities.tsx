"use client";

import React, { useRef, useState, useEffect } from "react";
import { Bot, Cpu, Database, Gauge, Sparkles, RefreshCw } from "lucide-react";
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

  const [activeTab, setActiveTab] = useState<"schema" | "budget" | "domain" | "ai-audit">("schema");
  const [dbStats, setDbStats] = useState({
    totalLeads: 13,
    averageBudget: 850,
    indexStrategy: "budget_1_createdAt_-1",
    queryExecutionTimeMs: 0.45,
    offline: false,
  });
  const [pipelineOutput, setPipelineOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // AI Index Audit states
  const [isDbAiLoading, setIsDbAiLoading] = useState(false);
  const [dbAiAuditData, setDbAiAuditData] = useState<any>(null);

  const handleDbAiAudit = async () => {
    setIsDbAiLoading(true);
    setDbAiAuditData(null);
    try {
      const res = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "db-audit",
          leadsCount: dbStats.totalLeads,
          averageBudget: dbStats.averageBudget,
          queryExecutionTimeMs: dbStats.queryExecutionTimeMs,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTimeout(() => {
          setDbAiAuditData(json.data);
          setIsDbAiLoading(false);
        }, 1300);
      } else {
        setIsDbAiLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsDbAiLoading(false);
    }
  };

  // AI Audit States for remaining Bento Cards
  const [isArchLoading, setIsArchLoading] = useState(false);
  const [archAuditData, setArchAuditData] = useState<any>(null);

  const [isAiSysLoading, setIsAiSysLoading] = useState(false);
  const [aiSysAuditData, setAiSysAuditData] = useState<any>(null);
  const [selectedRagQuery, setSelectedRagQuery] = useState("");

  const [isPerfLoading, setIsPerfLoading] = useState(false);
  const [perfAuditData, setPerfAuditData] = useState<any>(null);
  const [selectedPerfMetric, setSelectedPerfMetric] = useState<string | null>(null);

  const handleCapabilitiesAudit = async (type: string, options?: { metric?: string; query?: string }) => {
    if (type === "architecture") {
      setIsArchLoading(true);
      setArchAuditData(null);
      try {
        const res = await fetch("/api/ai-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });
        const json = await res.json();
        if (json.success) {
          setTimeout(() => {
            setArchAuditData(json.data);
            setIsArchLoading(false);
          }, 1200);
        }
      } catch (err) {
        console.error(err);
        setIsArchLoading(false);
      }
    } else if (type === "ai-systems") {
      setIsAiSysLoading(true);
      setAiSysAuditData(null);
      const queryText = options?.query || "Analyze conversion rates";
      setSelectedRagQuery(queryText);
      try {
        const res = await fetch("/api/ai-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, query: queryText }),
        });
        const json = await res.json();
        if (json.success) {
          setTimeout(() => {
            setAiSysAuditData(json.data);
            setIsAiSysLoading(false);
          }, 1400);
        }
      } catch (err) {
        console.error(err);
        setIsAiSysLoading(false);
      }
    } else if (type === "performance") {
      setIsPerfLoading(true);
      setPerfAuditData(null);
      const metric = options?.metric || "LCP";
      setSelectedPerfMetric(metric);
      try {
        const res = await fetch("/api/ai-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, metric }),
        });
        const json = await res.json();
        if (json.success) {
          setTimeout(() => {
            setPerfAuditData(json.data);
            setIsPerfLoading(false);
          }, 1000);
        }
      } catch (err) {
        console.error(err);
        setIsPerfLoading(false);
      }
    }
  };

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

  const handleTabChange = async (tab: "schema" | "budget" | "domain" | "ai-audit") => {
    setActiveTab(tab);
    if (tab === "schema") {
      setPipelineOutput(null);
      return;
    }

    if (tab === "ai-audit") {
      setPipelineOutput(null);
      if (!dbAiAuditData) {
        handleDbAiAudit();
      }
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
        {/* ARCHITECTURE CARD (Interactive AI Code Inspector) */}
        <div data-reveal className="md:col-span-7 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm flex flex-col justify-between">
          <div>
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

            {isArchLoading ? (
              <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-5 font-mono text-xs sm:text-sm leading-relaxed text-cyber-muted animate-pulse min-h-[175px]">
                <div className="text-cyber-text font-bold">$ pnpm ship --inspect-architecture</div>
                <div className="text-cyber-blue font-bold mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                  → consulting Gemini Code Inspector...
                </div>
                <div className="text-gray-400">→ parsing page boundaries...</div>
              </div>
            ) : archAuditData ? (
              <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-5 font-mono text-xs sm:text-sm leading-relaxed text-cyber-muted min-h-[175px]">
                <div className="text-cyber-text font-bold flex justify-between">
                  <span>$ {archAuditData.command}</span>
                  <span className="text-[9px] text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded font-bold font-mono">
                    {archAuditData.offline ? "SIMULATED INSPECT" : "LIVE GEMINI"}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {archAuditData.trace.map((line: string, idx: number) => (
                    <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                      {line}
                    </div>
                  ))}
                </div>
                <div className="border-t border-black/8 pt-3 mt-3">
                  <div className="text-cyber-blue font-bold text-xs uppercase tracking-wider mb-1 font-sans">
                    GEMINI ARCHITECTURE RECOMMENDATION:
                  </div>
                  <p className="text-cyber-text font-semibold leading-normal font-sans">
                    {archAuditData.result}
                  </p>
                </div>
                <button
                  onClick={() => setArchAuditData(null)}
                  className="mt-4 w-full py-2 px-3 text-xs font-bold rounded-xl border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition active:scale-[0.98] cursor-pointer"
                >
                  Reset Inspector
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Typed data model + validation",
                    "Composable UI primitives",
                    "API route isolation",
                    "ESLint + strict TS",
                  ].map((t) => (
                    <div
                      key={t}
                      className="rounded-2xl border border-black/8 bg-white/70 px-4 py-3 text-sm sm:text-base font-semibold text-cyber-text shadow-sm"
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleCapabilitiesAudit("architecture")}
                  className="rounded-2xl border border-cyber-blue/20 bg-cyber-blue hover:brightness-105 px-4.5 py-4 text-xs sm:text-sm font-bold font-mono tracking-wider text-white shadow-sm flex items-center justify-center gap-1.5 transition duration-300 active:scale-[0.98] shrink-0 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Inspect Code
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI SYSTEMS CARD (Interactive Gemini RAG Sandbox) */}
        <div data-reveal className="md:col-span-5 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm flex flex-col justify-between">
          <div>
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

            {isAiSysLoading ? (
              <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-4.5 font-mono text-xs sm:text-sm text-cyber-muted font-medium animate-pulse min-h-[160px] flex flex-col justify-between">
                <div>
                  <div className="text-cyber-text font-bold">pipeline.rag("{selectedRagQuery}")</div>
                  <div className="text-cyber-green font-bold mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping"></span>
                    → running semantic retrieval...
                  </div>
                  <div className="text-gray-400">→ querying Pinecone index matches...</div>
                </div>
              </div>
            ) : aiSysAuditData ? (
              <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-4.5 font-mono text-xs sm:text-sm text-cyber-muted font-medium min-h-[160px] flex flex-col justify-between">
                <div>
                  <div className="text-cyber-text font-bold flex justify-between">
                    <span>pipeline.rag("{selectedRagQuery}")</span>
                    <span className="text-[8px] text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded font-bold font-mono">
                      {aiSysAuditData.offline ? "SIMULATED RAG" : "LIVE RAG"}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {aiSysAuditData.trace.map((line: string, idx: number) => (
                      <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/8 pt-2.5 mt-2.5">
                    <div className="text-cyber-green font-bold text-[10px] uppercase tracking-wider mb-0.5 font-sans">
                      CITATION SYNTHESIS:
                    </div>
                    <p className="text-cyber-text text-xs leading-relaxed font-semibold font-sans">
                      {aiSysAuditData.result}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAiSysAuditData(null)}
                  className="mt-3.5 w-full py-1.5 px-3 text-[11px] font-bold rounded-xl border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition active:scale-[0.98] cursor-pointer"
                >
                  Reset Pipeline
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-black/8 bg-black/[0.04] p-4.5 font-mono text-xs sm:text-sm text-cyber-muted font-medium">
                  <div className="text-cyber-text font-semibold">pipeline.rag(query)</div>
                  <div className="mt-2">→ retrieve · rerank · cite</div>
                  <div>→ tool-call · guard</div>
                  <div className="mt-2 text-cyber-green font-bold">✓ response stable</div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-cyber-text tracking-wider uppercase">✨ TEST RAG QUERIES:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      "Analyze conversion rates",
                      "Classify high-budget leads",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleCapabilitiesAudit("ai-systems", { query: q })}
                        className="py-2 px-2 text-[11px] font-bold rounded-xl border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text hover:text-cyber-green hover:border-cyber-green/30 text-left transition active:scale-[0.98] truncate cursor-pointer"
                      >
                        ⚡ {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PERFORMANCE CARD (Interactive Web Vital Optimizer) */}
        <div data-reveal className="md:col-span-5 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm flex flex-col justify-between">
          <div>
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

            {isPerfLoading ? (
              <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-5 font-mono text-xs sm:text-sm leading-relaxed text-cyber-muted animate-pulse min-h-[180px]">
                <div className="text-cyber-text font-bold">$ pnpm ship --optimize-{selectedPerfMetric?.toLowerCase()}</div>
                <div className="text-cyber-blue font-bold mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                  → compiling Web Vital trace...
                </div>
              </div>
            ) : perfAuditData ? (
              <div className="mt-6 rounded-2xl border border-black/8 bg-black/[0.04] p-5 font-mono text-xs sm:text-sm leading-relaxed text-cyber-muted min-h-[180px]">
                <div className="text-cyber-text font-bold flex justify-between">
                  <span>$ {perfAuditData.command}</span>
                  <span className="text-[9px] text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2 py-0.5 rounded font-bold font-mono">
                    {perfAuditData.offline ? "SIMULATED CACHE" : "LIVE GEMINI"}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  {perfAuditData.trace.map((line: string, idx: number) => (
                    <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                      {line}
                    </div>
                  ))}
                </div>
                <div className="border-t border-black/8 pt-3 mt-3">
                  <div className="text-cyber-blue font-bold text-xs uppercase tracking-wider mb-1 font-sans">
                    CORE WEB VITAL ADVICE:
                  </div>
                  <p className="text-cyber-text font-semibold leading-normal font-sans">
                    {perfAuditData.result}
                  </p>
                </div>
                <button
                  onClick={() => setPerfAuditData(null)}
                  className="mt-4 w-full py-2 px-3 text-xs font-bold rounded-xl border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition active:scale-[0.98]"
                >
                  Reset Web Vital Optimizer
                </button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k: "LCP", v: "≤ 2.5s", desc: "Largest Contentful Paint" },
                  { k: "CLS", v: "≤ 0.1", desc: "Cumulative Layout Shift" },
                  { k: "TTFB", v: "low", desc: "Time to First Byte" },
                  { k: "JS", v: "lean", desc: "Bundle Discipline" },
                ].map((m) => (
                  <button
                    key={m.k}
                    onClick={() => handleCapabilitiesAudit("performance", { metric: m.k })}
                    className="text-left rounded-2xl border border-black/8 bg-white/70 hover:border-cyber-blue/30 hover:bg-cyber-blue/[0.01] px-4 py-3 shadow-sm hover:shadow transition group cursor-pointer active:scale-[0.97] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text">
                        {m.k}
                      </span>
                      <span className="font-mono text-[8px] font-bold text-cyber-blue tracking-wider bg-cyber-blue/5 group-hover:bg-cyber-blue/10 px-1 py-0.5 rounded transition">
                        ✨ OPTIMIZE
                      </span>
                    </div>
                    <div className="mt-2 text-base font-bold text-cyber-text">{m.v}</div>
                    <div className="text-[10px] font-medium text-cyber-muted truncate mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            )}
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
                <div className="flex border-b border-black/8 bg-black/[0.02] p-1 gap-1 flex-wrap sm:flex-nowrap">
                  {[
                    { id: "schema", label: "Schema" },
                    { id: "budget", label: "Budget tiers" },
                    { id: "domain", label: "Domains" },
                    { id: "ai-audit", label: "✨ AI Index Audit" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTabChange(t.id as any)}
                      className={`flex-1 py-1.5 px-1.5 text-[10px] sm:text-xs font-bold font-mono rounded-lg transition text-center truncate ${
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

                  {activeTab === "ai-audit" && (
                    <div className="space-y-2 h-full flex flex-col justify-between">
                      {isDbAiLoading ? (
                        <div className="space-y-2 animate-pulse py-2">
                          <div className="text-cyber-text font-bold">$ pnpm ship --inspect-database</div>
                          <div className="text-cyber-blue font-bold flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                            → auditing live database stats...
                          </div>
                          <div className="text-gray-400">→ verifying Compound Index structures...</div>
                        </div>
                      ) : dbAiAuditData ? (
                        <div className="space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-cyber-text font-bold flex justify-between items-center">
                              <span>$ {dbAiAuditData.command}</span>
                              <span className="text-[8px] text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded font-bold font-mono">
                                {dbAiAuditData.offline ? "SIMULATED INSPECT" : "LIVE GEMINI"}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1">
                              {dbAiAuditData.trace.map((line: string, idx: number) => (
                                <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                                  {line}
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-black/8 pt-2.5 mt-2.5">
                              <div className="text-cyber-blue font-bold text-[10px] uppercase tracking-wider mb-1 font-sans">
                                GEMINI DATABASE ADVICE:
                              </div>
                              <p className="text-cyber-text text-xs leading-relaxed font-semibold font-sans">
                                {dbAiAuditData.result}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleDbAiAudit}
                            className="mt-3.5 w-full py-1.5 px-3 text-[11px] font-bold rounded-xl border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Run New Database Audit
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                          <p className="text-[11px] text-cyber-muted font-medium mb-3">
                            Review index efficiency, collection scans, and scaling guidelines.
                          </p>
                          <button
                            onClick={handleDbAiAudit}
                            className="py-1.5 px-4 text-xs font-bold rounded-xl bg-cyber-blue hover:brightness-105 text-white transition active:scale-[0.98] cursor-pointer"
                          >
                            ✨ Start Gemini Database Audit
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab !== "schema" && activeTab !== "ai-audit" && pipelineOutput && (
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
