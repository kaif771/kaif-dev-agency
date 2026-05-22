"use client";

import React, { useRef, useState, useEffect } from "react";
import { Bot, Cpu, Database, Gauge, Sparkles, RefreshCw, ChevronRight } from "lucide-react";
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

  // AI Audit States for remaining Cards
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
    <section ref={scopeRef} id="capabilities" className="py-24 sm:py-32 border-t border-black/5 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16">
          <div>
            <div data-reveal className="font-mono text-xs tracking-[0.2em] font-bold text-cyber-text uppercase">
              CAPABILITIES
            </div>
            <h2 data-reveal className="mt-3 text-4xl sm:text-5xl font-black tracking-[-0.03em] text-cyber-text">
              Built like an engineering studio.
            </h2>
          </div>

          <p data-reveal className="max-w-xl text-base sm:text-lg leading-relaxed text-cyber-muted font-medium">
            Minimal surface area. Strong types. Predictable performance. The goal is always the same:
            ship a product that feels expensive, stays fast, and scales predictably.
          </p>
        </div>

        {/* Tech Stack Subtle Badges Row */}
        <div data-reveal className="flex flex-wrap gap-2.5 pb-16 select-none border-b border-black/5">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-50 border border-black/6 px-4 py-2 text-xs font-bold tracking-wider text-cyber-text/80"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Breathable Unbordered Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16">
          
          {/* COLUMN 1: Architecture & AI Systems Combined Panel */}
          <div data-reveal className="lg:col-span-7 bg-[#fafafa] rounded-3xl p-8 sm:p-10 space-y-12">
            
            {/* Architecture Section */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-cyber-muted">01 · ARCHITECTURE</span>
                  <h3 className="text-xl font-bold text-cyber-text mt-1">App Router systems that stay maintainable.</h3>
                  <p className="text-sm leading-relaxed text-cyber-muted mt-2 font-medium">
                    Clean server/client boundaries, typed request contracts, and modular UI composition. The repository you get is the codebase you can easily scale out.
                  </p>
                </div>
                <div className="rounded-full bg-white border border-black/6 p-3 text-cyber-blue shrink-0">
                  <Cpu className="h-5 w-5" />
                </div>
              </div>

              {isArchLoading ? (
                <div className="rounded-2xl border border-black/6 bg-black/[0.03] p-5 font-mono text-xs leading-relaxed text-cyber-muted animate-pulse">
                  <div className="text-cyber-text font-bold">$ pnpm ship --inspect-architecture</div>
                  <div className="text-cyber-blue font-bold mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                    → consulting Gemini Code Inspector...
                  </div>
                </div>
              ) : archAuditData ? (
                <div className="rounded-2xl border border-black/6 bg-white p-5 font-mono text-xs leading-relaxed text-cyber-muted">
                  <div className="text-cyber-text font-bold flex justify-between">
                    <span>$ {archAuditData.command}</span>
                    <span className="text-[8px] text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                      {archAuditData.offline ? "SIMULATED" : "GEMINI"}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {archAuditData.trace.map((line: string, idx: number) => (
                      <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/5 pt-3 mt-3">
                    <div className="text-cyber-blue font-bold text-[10px] uppercase tracking-wider mb-1 font-sans">
                      CODE TIP SUMMARY:
                    </div>
                    <p className="text-cyber-text font-semibold leading-normal font-sans text-xs">
                      {archAuditData.result}
                    </p>
                  </div>
                  <button
                    onClick={() => setArchAuditData(null)}
                    className="mt-4 w-full py-2 px-3 text-[10px] font-bold rounded-lg border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition cursor-pointer"
                  >
                    Reset Inspector
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="flex-1 grid grid-cols-2 gap-2 text-xs font-semibold text-cyber-text">
                    {["Typed Data Models", "Composable Primitives", "Isolated API Routes", "Strict TS Rules"].map((t) => (
                      <div key={t} className="rounded-xl border border-black/5 bg-white px-4 py-3 shadow-sm select-none">
                        {t}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCapabilitiesAudit("architecture")}
                    className="rounded-xl bg-black text-white hover:bg-black/90 px-4.5 py-3 text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Inspect
                  </button>
                </div>
              )}
            </div>

            {/* AI Systems Section */}
            <div className="space-y-4 pt-6 border-t border-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-cyber-muted">02 · AI SYSTEMS</span>
                  <h3 className="text-xl font-bold text-cyber-text mt-1">RAG and agents, without the chaos.</h3>
                  <p className="text-sm leading-relaxed text-cyber-muted mt-2 font-medium">
                    Tooling that’s testable and observable: custom semantic retrieval models, vector database synchronization pipelines, and LLM-guardrail protocols.
                  </p>
                </div>
                <div className="rounded-full bg-white border border-black/6 p-3 text-cyber-green shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
              </div>

              {isAiSysLoading ? (
                <div className="rounded-2xl border border-black/6 bg-black/[0.03] p-5 font-mono text-xs leading-relaxed text-cyber-muted animate-pulse">
                  <div className="text-cyber-text font-bold">pipeline.rag("{selectedRagQuery}")</div>
                  <div className="text-cyber-green font-bold mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping"></span>
                    → running semantic retrieval queries...
                  </div>
                </div>
              ) : aiSysAuditData ? (
                <div className="rounded-2xl border border-black/6 bg-white p-5 font-mono text-xs leading-relaxed text-cyber-muted">
                  <div className="text-cyber-text font-bold flex justify-between">
                    <span>pipeline.rag("{selectedRagQuery}")</span>
                    <span className="text-[8px] text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                      {aiSysAuditData.offline ? "SIMULATED" : "GEMINI"}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {aiSysAuditData.trace.map((line: string, idx: number) => (
                      <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/5 pt-3 mt-3">
                    <div className="text-cyber-green font-bold text-[10px] uppercase tracking-wider mb-1 font-sans">
                      CITATION RAG RESPONSE:
                    </div>
                    <p className="text-cyber-text font-semibold leading-normal font-sans text-xs">
                      {aiSysAuditData.result}
                    </p>
                  </div>
                  <button
                    onClick={() => setAiSysAuditData(null)}
                    className="mt-4 w-full py-2 px-3 text-[10px] font-bold rounded-lg border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition cursor-pointer"
                  >
                    Reset Pipeline
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 pt-2 items-stretch">
                  <div className="flex-1 rounded-xl border border-black/5 bg-white p-4 font-mono text-[11px] text-cyber-muted select-none flex flex-col justify-center">
                    <div><span className="text-cyber-text font-bold">pipeline.rag(query)</span></div>
                    <div className="mt-1">→ retrieve · rerank · cite</div>
                    <div className="text-cyber-green font-bold mt-1">✓ response stable</div>
                  </div>
                  
                  <div className="flex flex-col justify-center gap-1.5 shrink-0">
                    {["Analyze conversion rates", "Classify high-budget leads"].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleCapabilitiesAudit("ai-systems", { query: q })}
                        className="py-2.5 px-3 text-left text-xs font-bold rounded-lg border border-black/6 bg-white hover:bg-black/[0.03] text-cyber-text hover:text-cyber-green hover:border-cyber-green/20 transition cursor-pointer flex items-center gap-1"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* COLUMN 2: Performance Optimizer Panel */}
          <div data-reveal className="lg:col-span-5 bg-[#fafafa] rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
            
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-cyber-muted">03 · PERFORMANCE</span>
                  <h3 className="text-xl font-bold text-cyber-text mt-1">Speed as a feature.</h3>
                  <p className="text-sm leading-relaxed text-cyber-muted mt-2 font-medium">
                    Bundle discipline, predictive dynamic hydration, and scroll mechanics that respect the main rendering thread.
                  </p>
                </div>
                <div className="rounded-full bg-white border border-black/6 p-3 text-cyber-blue shrink-0">
                  <Gauge className="h-5 w-5" />
                </div>
              </div>

              {isPerfLoading ? (
                <div className="rounded-2xl border border-black/6 bg-black/[0.03] p-5 font-mono text-xs leading-relaxed text-cyber-muted animate-pulse min-h-[180px]">
                  <div className="text-cyber-text font-bold">$ pnpm ship --optimize-{selectedPerfMetric?.toLowerCase()}</div>
                  <div className="text-cyber-blue font-bold mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                    → generating Web Vital diagnostic logs...
                  </div>
                </div>
              ) : perfAuditData ? (
                <div className="rounded-2xl border border-black/6 bg-white p-5 font-mono text-xs leading-relaxed text-cyber-muted min-h-[180px]">
                  <div className="text-cyber-text font-bold flex justify-between">
                    <span>$ {perfAuditData.command}</span>
                    <span className="text-[8px] text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                      {perfAuditData.offline ? "SIMULATED" : "GEMINI"}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {perfAuditData.trace.map((line: string, idx: number) => (
                      <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/5 pt-3 mt-3">
                    <div className="text-cyber-blue font-bold text-[10px] uppercase tracking-wider mb-1 font-sans">
                      DIAGNOSTIC RECOMMENDATION:
                    </div>
                    <p className="text-cyber-text font-semibold leading-normal font-sans text-xs">
                      {perfAuditData.result}
                    </p>
                  </div>
                  <button
                    onClick={() => setPerfAuditData(null)}
                    className="mt-4 w-full py-2 px-3 text-[10px] font-bold rounded-lg border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition cursor-pointer"
                  >
                    Reset Web Vital Optimizer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2 select-none">
                  {[
                    { k: "LCP", v: "≤ 2.5s", desc: "Largest Contentful Paint" },
                    { k: "CLS", v: "≤ 0.1", desc: "Cumulative Layout Shift" },
                    { k: "TTFB", v: "low", desc: "Time to First Byte" },
                    { k: "JS", v: "lean", desc: "Bundle Discipline" },
                  ].map((m) => (
                    <button
                      key={m.k}
                      onClick={() => handleCapabilitiesAudit("performance", { metric: m.k })}
                      className="text-left rounded-xl border border-black/6 bg-white hover:border-cyber-blue/30 p-4 transition cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-xs font-bold text-cyber-text">{m.k}</span>
                        <span className="font-mono text-[8px] font-bold text-cyber-blue bg-cyber-blue/5 px-1 py-0.5 rounded">
                          OPTIMIZE
                        </span>
                      </div>
                      <div className="mt-2 text-base font-black text-cyber-text">{m.v}</div>
                      <div className="text-[10px] font-medium text-cyber-muted truncate mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* FULL-WIDTH ROW: Database Aggregations (DATA) */}
        <div data-reveal className="bg-[#fafafa] rounded-3xl p-8 sm:p-10 space-y-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-cyber-muted">04 · DATA PLATFORMS</span>
              <h3 className="text-2xl font-bold text-cyber-text mt-1">Schemas that scale cleanly.</h3>
              <p className="text-sm leading-relaxed text-cyber-muted mt-2 font-medium max-w-2xl">
                MongoDB query models designed around dynamic aggregation shapes. Indexing strategy is part of the product, preventing structural bottlenecks in live production.
              </p>
            </div>
            <div className="rounded-full bg-white border border-black/6 p-3 text-cyber-green shrink-0">
              <Database className="h-5 w-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Live metrics widgets */}
            <div className="lg:col-span-4 rounded-2xl border border-black/6 bg-white p-5 flex flex-col justify-between gap-4 select-none">
              <div className="flex items-center justify-between text-[10px] tracking-wider text-cyber-text font-mono font-bold">
                <span>LIVE ATLAS DB METRICS</span>
                <span className="flex items-center gap-1.5 text-cyber-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>
                  ACTIVE
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 border border-black/5 rounded-xl p-2.5">
                  <div className="text-[9px] font-mono font-bold text-cyber-muted tracking-wider">INTAKES</div>
                  <div className="text-lg font-black text-cyber-text mt-0.5">{dbStats.totalLeads}</div>
                </div>
                <div className="bg-slate-50 border border-black/5 rounded-xl p-2.5">
                  <div className="text-[9px] font-mono font-bold text-cyber-muted tracking-wider">AVG PROJECT</div>
                  <div className="text-lg font-black text-cyber-text mt-0.5">${dbStats.averageBudget}</div>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-[10px] font-bold text-cyber-text">
                <div className="flex justify-between bg-slate-50 border border-black/5 rounded-lg px-2.5 py-1.5">
                  <span>Compound Index</span>
                  <span className="text-cyber-green">budget_1_createdAt_-1</span>
                </div>
                <div className="flex justify-between bg-slate-50 border border-black/5 rounded-lg px-2.5 py-1.5">
                  <span>Query Latency</span>
                  <span className="text-cyber-blue">{dbStats.queryExecutionTimeMs} ms</span>
                </div>
              </div>
            </div>

            {/* Aggregation interactive tabs console */}
            <div className="lg:col-span-8 flex flex-col rounded-2xl border border-black/6 bg-white overflow-hidden min-h-[220px]">
              
              {/* Tab Selector buttons */}
              <div className="flex border-b border-black/6 bg-slate-50/50 p-1 gap-1 select-none flex-wrap sm:flex-nowrap">
                {[
                  { id: "schema", label: "Schema" },
                  { id: "budget", label: "Budget tiers" },
                  { id: "domain", label: "Domains" },
                  { id: "ai-audit", label: "✨ AI Index Audit" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTabChange(t.id as any)}
                    className={`flex-1 py-1.5 px-2 text-[10px] sm:text-xs font-bold font-mono rounded-lg transition text-center truncate cursor-pointer ${
                      activeTab === t.id
                        ? "bg-white border border-black/8 text-cyber-blue shadow-sm"
                        : "text-cyber-text hover:bg-white/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Console output display */}
              <div className="flex-1 p-4 font-mono text-[10px] sm:text-[11px] overflow-y-auto text-cyber-text relative bg-white">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-4 h-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[9px] font-bold text-cyber-blue uppercase tracking-wider">Aggregating...</span>
                    </div>
                  </div>
                ) : null}

                {activeTab === "schema" && (
                  <pre className="leading-normal text-left">
                    <span className="text-purple-600 font-bold">const</span> <span className="text-blue-600 font-bold">LeadSchema</span> = <span className="text-purple-600 font-bold">new</span> <span className="text-blue-600">Schema</span>(&#123;<br />
                    &nbsp;&nbsp;name: &#123; <span className="text-teal-600">type</span>: String, <span className="text-teal-600">required</span>: <span className="text-red-500">true</span> &#125;,<br />
                    &nbsp;&nbsp;email: &#123; <span className="text-teal-600">type</span>: String, <span className="text-teal-600">unique</span>: <span className="text-red-500">true</span> &#125;,<br />
                    &nbsp;&nbsp;budget: &#123; <span className="text-teal-600">type</span>: Number, <span className="text-teal-600">index</span>: <span className="text-red-500">true</span> &#125;,<br />
                    &nbsp;&nbsp;createdAt: &#123; <span className="text-teal-600">type</span>: Date, <span className="text-teal-600">default</span>: Date.now &#125;<br />
                    &#125;);<br />
                    <span className="text-gray-400">// Index strategy compiled safely inside Atlas</span><br />
                    LeadSchema.index(&#123; budget: <span className="text-amber-600">1</span>, createdAt: <span className="text-amber-600">-1</span> &#125;);
                  </pre>
                )}

                {activeTab === "ai-audit" && (
                  <div className="space-y-2 h-full flex flex-col justify-between text-left">
                    {isDbAiLoading ? (
                      <div className="space-y-2 animate-pulse py-2">
                        <div className="text-cyber-text font-bold">$ pnpm ship --inspect-database</div>
                        <div className="text-cyber-blue font-bold flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                          → auditing live database metrics...
                        </div>
                      </div>
                    ) : dbAiAuditData ? (
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-cyber-text font-bold flex justify-between items-center">
                            <span>$ {dbAiAuditData.command}</span>
                            <span className="text-[8px] text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded font-mono font-bold">
                              {dbAiAuditData.offline ? "SIMULATED" : "GEMINI"}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {dbAiAuditData.trace.map((line: string, idx: number) => (
                              <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                                {line}
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-black/5 pt-2.5 mt-2.5">
                            <div className="text-cyber-blue font-bold text-[9px] uppercase tracking-wider mb-1 font-sans">
                              GEMINI PERFORMANCE INSIGHTS:
                            </div>
                            <p className="text-cyber-text font-semibold leading-normal font-sans">
                              {dbAiAuditData.result}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleDbAiAudit}
                          className="mt-3.5 w-full py-1.5 px-3 text-[10px] font-bold rounded-lg border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Re-run Audit
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}

                {activeTab !== "schema" && activeTab !== "ai-audit" && pipelineOutput && (
                  <div className="space-y-2 text-left">
                    <div className="text-purple-600 font-bold text-[10px] break-all leading-normal">
                      {pipelineOutput.query}
                    </div>
                    <div className="border-t border-black/5 pt-1.5 leading-normal">
                      <span className="text-gray-400 font-bold">// Latency: {pipelineOutput.latencyMs} ms</span>
                      <pre className="text-cyber-green font-semibold mt-1 overflow-x-auto">
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
    </section>
  );
}
