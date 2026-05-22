"use client";

import React, { useState } from "react";
import { ArrowRight, Terminal as TerminalIcon, Sparkles, RefreshCw, Cpu, Database, Eye } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import Counter from "@/components/motion/Counter";
import TextReveal from "@/components/motion/TextReveal";

export default function Hero() {
  const [visualMode, setVisualMode] = useState<"terminal" | "studio">("terminal");
  const [aiOptimizeData, setAiOptimizeData] = useState<{
    command: string;
    trace: string[];
    recommendation: string;
    offline?: boolean;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"general" | "stack" | "motion" | null>(null);

  // Studio IDE interactive state
  const [activeFile, setActiveFile] = useState("HealthcareAi.tsx");
  const [ideLog, setIdeLog] = useState<string | null>(null);
  const [isIdeLoading, setIsIdeLoading] = useState(false);

  const handleAiOptimize = async (category: "general" | "stack" | "motion" = "general") => {
    setIsAiLoading(true);
    setActiveCategory(category);
    setAiOptimizeData(null);

    let target = "Next.js / TypeScript / Databases";
    if (category === "stack") {
      target = "Next.js dynamic routes, TypeScript strict contracts, and MongoDB query index strategy";
    } else if (category === "motion") {
      target = "GSAP scroll animations, ScrollTrigger cleanup, and Lenis smooth scrolling refresh cycles";
    } else {
      const targets = ["Next.js Hydration & CLS", "Database Query Scans", "Dynamic Chunks & Webpack", "Tailwind CSS Compilation"];
      target = targets[Math.floor(Math.random() * targets.length)];
    }

    try {
      const res = await fetch("/api/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, category }),
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
    setActiveCategory(null);
  };

  const openStudioAssistant = () => {
    window.dispatchEvent(new CustomEvent("open-studio-assistant"));
  };

  const handleIdeTrigger = (action: string) => {
    setIsIdeLoading(true);
    setIdeLog(null);
    setTimeout(() => {
      setIsIdeLoading(false);
      if (action === "healthcare") {
        setIdeLog("✓ Database connection active. REDAX PHI filters compiled (100% HIPAA compliant).");
      } else if (action === "telemetry") {
        setIdeLog("✓ GeoJSON points loaded. Computed bucket queries in ~240ms with index boundary.");
      }
    }, 1000);
  };

  return (
    <section id="top" className="pt-32 sm:pt-36 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center">
        
        {/* Cinematic Announcement Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-black/6 bg-slate-50 px-4 py-2 select-none shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-30 animate-pulse" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-green" />
          </span>
          <span className="font-mono text-xs tracking-[0.18em] text-cyber-text font-bold uppercase">
            Accepting two builds · Summer 2026
          </span>
        </div>

        {/* Confident Headings */}
        <h1 className="mt-8 text-4xl sm:text-6xl lg:text-[72px] font-black leading-[1.05] tracking-[-0.03em] text-cyber-text text-center max-w-4xl">
          <TextReveal
            as="span"
            text="Premium Product Engineering."
            className="block"
            delay={0.02}
            stagger={0.045}
            trigger="mount"
          />
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-cyber-muted font-medium text-center max-w-2xl leading-relaxed">
          A full-stack systems studio for modern web + AI. Leaning engineering, robust logic, exceptional polish.
        </p>

        {/* Pill CTAs & Assistant Trigger */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setVisualMode(visualMode === "terminal" ? "studio" : "terminal")}
            className="inline-flex items-center gap-2 rounded-full bg-black text-white hover:bg-black/90 px-6.5 py-3.5 text-base font-semibold transition-all duration-300 shadow-md cursor-pointer active:scale-95"
          >
            {visualMode === "terminal" ? "Launch Studio Editor" : "View Terminal Build"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={openStudioAssistant}
            className="inline-flex items-center gap-1.5 text-base font-semibold text-cyber-blue hover:text-cyber-blue/80 transition-colors group cursor-pointer"
          >
            Studio Assistant
            <Sparkles className="h-4 w-4 text-cyber-blue group-hover:scale-110 transition-transform animate-pulse" />
          </button>
        </div>

        {/* Flagship Visual Canvas - Massive whitespace and width */}
        <div className="mt-16 w-full max-w-5xl py-4">
          
          {/* Visual Container header tabs */}
          <div className="w-full bg-[#fcfcfd] border border-black/8 rounded-t-2xl px-5 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-1.5 select-none">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            
            {/* Display View Tabs */}
            <div className="flex gap-1.5 bg-black/[0.03] p-0.5 rounded-lg border border-black/5 font-mono text-[10px] sm:text-xs">
              <button
                onClick={() => setVisualMode("terminal")}
                className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1 cursor-pointer ${
                  visualMode === "terminal"
                    ? "bg-white text-cyber-blue shadow-sm border border-black/5"
                    : "text-cyber-muted hover:text-black"
                }`}
              >
                <TerminalIcon className="h-3 w-3" />
                terminal.sh
              </button>
              <button
                onClick={() => setVisualMode("studio")}
                className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1 cursor-pointer ${
                  visualMode === "studio"
                    ? "bg-white text-cyber-blue shadow-sm border border-black/5"
                    : "text-cyber-muted hover:text-black"
                }`}
              >
                <Eye className="h-3 w-3" />
                Kaif Studio IDE
              </button>
            </div>

            <div className="font-mono text-[10px] tracking-widest text-cyber-muted font-bold uppercase select-none">
              {visualMode === "terminal" ? "build · log" : "live · preview"}
            </div>
          </div>

          {/* VIEW A: Compiler Terminal Mode */}
          {visualMode === "terminal" && (
            <div className="w-full bg-white border-x border-b border-black/8 rounded-b-2xl shadow-lg flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-black/8 overflow-hidden min-h-[380px]">
              
              {/* Terminal Code logs pane */}
              <div className="flex-1 p-6 font-mono text-sm leading-relaxed text-cyber-muted bg-white min-h-[260px] flex flex-col justify-between">
                <div>
                  {isAiLoading ? (
                    <div className="space-y-2.5 animate-pulse">
                      <div className="text-cyber-text font-bold">
                        $ pnpm ship --optimize-{activeCategory || "general"}
                      </div>
                      <div className="text-cyber-blue font-bold flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                        → consulting Google Gemini AI...
                      </div>
                      <div className="text-gray-400">→ parsing bundle optimization bounds...</div>
                    </div>
                  ) : aiOptimizeData ? (
                    <div className="space-y-2.5">
                      <div className="text-cyber-text font-bold flex items-center justify-between">
                        <span>$ pnpm ship --{aiOptimizeData.command}</span>
                        <span className="text-[9px] text-cyber-green border border-cyber-green/30 bg-cyber-green/5 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
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
                        <p className="text-cyber-text text-sm font-semibold mt-1 leading-normal font-sans">
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
                      <div className="mt-4 flex items-center gap-2 text-cyber-muted">
                        <TerminalIcon className="h-4 w-4 text-cyber-blue" />
                        <span className="tracking-[0.15em] text-xs sm:text-sm font-bold text-cyber-text">READY · localhost:5000</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 flex gap-2">
                  {aiOptimizeData ? (
                    <button
                      onClick={handleResetTerminal}
                      className="w-full py-2.5 px-4 text-xs font-bold font-mono rounded-xl bg-slate-50 hover:bg-black/[0.03] border border-black/8 text-cyber-text flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reset Compiler
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAiOptimize("general")}
                      disabled={isAiLoading}
                      className="w-full py-2.5 px-4 text-xs font-bold font-mono rounded-xl bg-black text-white hover:bg-black/90 flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      Optimize with Gemini AI
                    </button>
                  )}
                </div>
              </div>

              {/* Quick AI Audit Cards panel */}
              <div className="w-full md:w-[260px] p-6 bg-slate-50/50 flex flex-col gap-3 select-none">
                <p className="text-[10px] text-cyber-muted font-mono font-bold tracking-wider uppercase">Interactive Audits</p>
                
                <button
                  onClick={() => !isAiLoading && handleAiOptimize("stack")}
                  disabled={isAiLoading}
                  className={`text-left rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    activeCategory === "stack"
                      ? "border-cyber-blue bg-white shadow-sm ring-1 ring-cyber-blue/10"
                      : "border-black/6 bg-white hover:border-cyber-blue/30"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-widest font-bold text-cyber-text">STACK</span>
                      <span className="text-[8px] font-bold text-cyber-blue bg-cyber-blue/5 px-1 py-0.5 rounded">AI AUDIT</span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-cyber-text">Next.js · TS · DB</div>
                    <p className="mt-1 text-[11px] text-cyber-muted font-medium leading-snug">App Router, typed database contracts.</p>
                  </div>
                </button>

                <button
                  onClick={() => !isAiLoading && handleAiOptimize("motion")}
                  disabled={isAiLoading}
                  className={`text-left rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    activeCategory === "motion"
                      ? "border-cyber-green bg-white shadow-sm ring-1 ring-cyber-green/10"
                      : "border-black/6 bg-white hover:border-cyber-blue/30"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-widest font-bold text-cyber-text">MOTION</span>
                      <span className="text-[8px] font-bold text-cyber-green bg-cyber-green/5 px-1 py-0.5 rounded">AI AUDIT</span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-cyber-text">GSAP · Lenis</div>
                    <p className="mt-1 text-[11px] text-cyber-muted font-medium leading-snug">Scroll hooks with memory cleanup cycles.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* VIEW B: Simulated Studio IDE Sandbox Mode */}
          {visualMode === "studio" && (
            <div className="w-full bg-white border-x border-b border-black/8 rounded-b-2xl shadow-lg flex divide-x divide-black/8 overflow-hidden min-h-[380px] font-mono text-xs">
              
              {/* Left pane: Explorer files tree */}
              <div className="w-[180px] hidden sm:flex flex-col bg-slate-50/50 p-4 text-cyber-muted select-none">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase mb-3">WORKSPACE</span>
                
                <div className="space-y-2 font-medium">
                  <div className="text-[11px] font-bold">📁 src</div>
                  <div className="pl-3 space-y-1.5">
                    <div className="text-[11px] font-bold">📁 sections</div>
                    <div className="pl-3 space-y-1">
                      <button
                        onClick={() => setActiveFile("HealthcareAi.tsx")}
                        className={`block text-left w-full truncate cursor-pointer hover:text-black ${
                          activeFile === "HealthcareAi.tsx" ? "text-cyber-blue font-bold" : ""
                        }`}
                      >
                        ✨ HealthcareAi.tsx
                      </button>
                      <button
                        onClick={() => setActiveFile("SmartTelemetry.tsx")}
                        className={`block text-left w-full truncate cursor-pointer hover:text-black ${
                          activeFile === "SmartTelemetry.tsx" ? "text-cyber-blue font-bold" : ""
                        }`}
                      >
                        ✨ SmartTelemetry.tsx
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-400">⚙️ next.config.ts</div>
                  <div className="text-[11px] text-gray-400">📄 package.json</div>
                </div>
              </div>

              {/* Center pane: Code editor */}
              <div className="flex-1 p-5 flex flex-col justify-between bg-white text-left leading-relaxed text-cyber-muted">
                <div className="overflow-x-auto">
                  <div className="border-b border-black/5 pb-2 mb-3 flex items-center justify-between text-[10px] text-gray-400 select-none">
                    <span>Active File: src/sections/{activeFile}</span>
                    <span>UTF-8 · TypeScript</span>
                  </div>

                  {activeFile === "HealthcareAi.tsx" ? (
                    <pre className="text-[11px]">
                      <span className="text-purple-600 font-bold">import</span> React <span className="text-purple-600 font-bold">from</span> <span className="text-teal-600">"react"</span>;<br />
                      <span className="text-purple-600 font-bold">import</span> &#123; GeminiAI &#125; <span className="text-purple-600 font-bold">from</span> <span className="text-teal-600">"@google/genai"</span>;<br /><br />
                      <span className="text-purple-600 font-bold">export default function</span> <span className="text-blue-600">HealthcareAI</span>() &#123;<br />
                      &nbsp;&nbsp;<span className="text-gray-400">// Strict PHI Sanitization Pipeline</span><br />
                      &nbsp;&nbsp;<span className="text-purple-600 font-bold">const</span> sanitize = (payload) =&gt; redax(payload);<br /><br />
                      &nbsp;&nbsp;<span className="text-purple-600 font-bold">return</span> &lt;<span className="text-blue-600 font-bold">clinical-guard</span> /&gt;;<br />
                      &#125;
                    </pre>
                  ) : (
                    <pre className="text-[11px]">
                      <span className="text-purple-600 font-bold">import</span> &#123; Database &#125; <span className="text-purple-600 font-bold">from</span> <span className="text-teal-600">"mongodb"</span>;<br /><br />
                      <span className="text-purple-600 font-bold">export async function</span> <span className="text-blue-600">getTelemetry</span>(req) &#123;<br />
                      &nbsp;&nbsp;<span className="text-gray-400">// Bucketing write queries</span><br />
                      &nbsp;&nbsp;<span className="text-purple-600 font-bold">const</span> stats = <span className="text-purple-600 font-bold">await</span> db.collection(<span className="text-teal-600">'readings'</span>)<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;.explain(<span className="text-teal-600">'executionStats'</span>);<br /><br />
                      &nbsp;&nbsp;<span className="text-purple-600 font-bold">return</span> Response.json(stats);<br />
                      &#125;
                    </pre>
                  )}
                </div>

                {/* Simulated compile logs output */}
                <div className="border-t border-black/8 pt-3 mt-4">
                  <div className="text-[10px] text-cyber-blue font-bold tracking-wider mb-1 flex items-center gap-1 font-sans">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    SIMULATED STUDIO PREVIEW OUTPUT:
                  </div>
                  
                  {isIdeLoading ? (
                    <div className="text-cyber-muted font-bold animate-pulse text-[11px]">
                      $ compile --target={activeFile.toLowerCase()}...
                    </div>
                  ) : ideLog ? (
                    <div className="text-cyber-green font-bold text-[11px]">
                      {ideLog}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-[11px]">
                      Click an interactive component on the right to simulate live deployment testing.
                    </div>
                  )}
                </div>
              </div>

              {/* Right pane: simulated live product outputs */}
              <div className="w-full md:w-[240px] p-5 bg-slate-50/50 flex flex-col gap-3 shrink-0 select-none">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase mb-1">LIVE PREVIEWS</span>
                
                {/* Healthcare AI assistant preview */}
                <div className="border border-black/6 bg-white rounded-xl p-3.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-cyber-text">Healthcare AI</span>
                    <Cpu className="h-3.5 w-3.5 text-cyber-blue" />
                  </div>
                  <p className="text-[10px] text-cyber-muted font-sans font-medium">HIPAA Sanitized clinical compiler assistant dashboard.</p>
                  <button
                    onClick={() => handleIdeTrigger("healthcare")}
                    className="w-full py-1.5 px-2 text-[10px] font-bold rounded-lg bg-cyber-blue hover:brightness-105 text-white transition cursor-pointer text-center"
                  >
                    Connect cluster
                  </button>
                </div>

                {/* Smart farmingTelemetry preview */}
                <div className="border border-black/6 bg-white rounded-xl p-3.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-cyber-text">Telemetry Data</span>
                    <Database className="h-3.5 w-3.5 text-cyber-green" />
                  </div>
                  <p className="text-[10px] text-cyber-muted font-sans font-medium">Time-series climate aggregation database pipeline.</p>
                  <button
                    onClick={() => handleIdeTrigger("telemetry")}
                    className="w-full py-1.5 px-2 text-[10px] font-bold rounded-lg border border-black/8 bg-white hover:bg-black/[0.02] text-cyber-text transition cursor-pointer text-center"
                  >
                    Learn details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacious, unbordered Horizontal Metrics Grid */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 font-mono text-xs sm:text-sm tracking-[0.2em] font-black text-cyber-text/80 uppercase">
          <div className="flex items-center gap-2">
            <span>LIGHTHOUSE</span>
            <span className="text-cyber-blue">99+</span>
          </div>
          <span className="text-black/10 hidden sm:inline select-none">•</span>
          <div className="flex items-center gap-2">
            <span>API P95</span>
            <span className="text-cyber-green">120MS</span>
          </div>
          <span className="text-black/10 hidden sm:inline select-none">•</span>
          <div className="flex items-center gap-2">
            <span>DEPLOYMENTS</span>
            <span className="text-cyber-blue">DAILY</span>
          </div>
        </div>

      </div>
    </section>
  );
}
