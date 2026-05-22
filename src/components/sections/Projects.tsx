"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink, Terminal, Sparkles, RefreshCw } from "lucide-react";
import Tilt from "@/components/motion/Tilt";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";
import { PROJECTS, type Project } from "@/content/projects";

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);

  const triggerAudit = async () => {
    setIsAuditing(true);
    setAuditData(null);
    try {
      const res = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "project-audit",
          projectTitle: project.title,
          projectCategory: project.category
        })
      });
      const json = await res.json();
      if (json.success) {
        setTimeout(() => {
          setAuditData(json.data);
          setIsAuditing(false);
        }, 1300);
      }
    } catch (err) {
      console.error(err);
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${project.title}`}
    >
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <motion.div
        className="relative w-full max-w-3xl glass-panel rounded-3xl border border-black/8 overflow-hidden flex flex-col max-h-[90vh]"
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="p-6 sm:p-7 border-b border-black/8 flex items-start justify-between gap-6 shrink-0 bg-black/[0.01]">
          <div>
            <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase">
              Under the hood
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-[-0.02em] text-cyber-text">
              {project.title}
            </h3>
            <div className="mt-2 text-sm font-semibold text-cyber-text">{project.category}</div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-black/8 bg-white px-4 py-2.5 text-sm font-mono tracking-[0.12em] font-bold text-cyber-text hover:text-cyber-blue hover:bg-black/[0.03] transition-colors shadow-sm cursor-pointer"
          >
            CLOSE
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-blue uppercase">
                Challenge
              </div>
              <p className="rounded-2xl border border-black/8 bg-white/70 p-4.5 text-sm sm:text-base leading-relaxed text-cyber-text font-medium shadow-sm">
                {project.underTheHood.challenge}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-green uppercase">
                Solution
              </div>
              <p className="rounded-2xl border border-black/8 bg-white/70 p-4.5 text-sm sm:text-base leading-relaxed text-cyber-text font-medium shadow-sm">
                {project.underTheHood.solution}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text uppercase">
              Metrics
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.underTheHood.metrics.map((m) => (
                <div
                  key={m}
                  className="rounded-2xl border border-black/8 bg-white/70 p-4 text-base sm:text-lg text-cyber-text font-black shadow-sm"
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Premium Gemini AI Audit Module */}
          <div className="border-t border-black/8 pt-6 mt-6">
            {isAuditing ? (
              <div className="rounded-2xl border border-cyber-blue/20 bg-black/[0.04] p-5 font-mono text-xs sm:text-sm leading-relaxed text-cyber-muted animate-pulse">
                <div className="text-cyber-text font-bold">$ pnpm ship --audit-project</div>
                <div className="text-cyber-blue font-bold mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                  → initiating automated Gemini architectural audit...
                </div>
                <div className="text-gray-400">→ parsing repository dependencies...</div>
              </div>
            ) : auditData ? (
              <div className="rounded-2xl border border-cyber-blue/30 bg-cyber-blue/[0.02] p-5 font-mono text-xs sm:text-sm leading-relaxed text-cyber-muted relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyber-blue/0 via-cyber-blue/0 to-cyber-blue/[0.03]" />
                
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-cyber-text font-bold">$ {auditData.command}</span>
                  <span className="text-[9px] text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2 py-0.5 rounded font-bold font-mono">
                    {auditData.offline ? "SIMULATED AUDIT" : "LIVE GEMINI"}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1 relative z-10">
                  {auditData.trace.map((line: string, idx: number) => (
                    <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                      {line}
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/8 pt-3 mt-3 relative z-10">
                  <div className="text-cyber-blue font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1 font-sans">
                    <Sparkles className="h-3.5 w-3.5 text-cyber-blue animate-pulse" />
                    GEMINI ARCHITECTURAL BRIEF:
                  </div>
                  <p className="text-cyber-text text-sm font-semibold leading-normal font-sans">
                    {auditData.result}
                  </p>
                </div>

                <button
                  onClick={() => setAuditData(null)}
                  className="mt-4 w-full py-2 px-3 text-xs font-bold rounded-xl border border-black/8 bg-white hover:bg-black/[0.03] text-cyber-text font-sans transition active:scale-[0.98] relative z-10 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 inline mr-1" />
                  Run New Audit
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-6 text-center">
                <div className="font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text uppercase mb-2">
                  ✨ Engineering Architecture Verification
                </div>
                <p className="text-sm text-cyber-muted max-w-lg mx-auto mb-4 font-medium">
                  Trigger an automated live system review via Google Gemini to analyze database performance, scaling bottlenecks, and code boundaries for this project.
                </p>
                <button
                  onClick={triggerAudit}
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyber-blue hover:brightness-105 px-6 py-3 text-sm font-bold text-white transition active:scale-[0.98] shadow-sm cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Generate AI Technical Review
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-black/8 flex gap-3 shrink-0">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyber-blue px-4 py-3 text-sm font-semibold text-white hover:brightness-105 transition"
            >
              Live Preview <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <div className="flex-1 rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3 text-sm text-center text-cyber-muted font-medium flex items-center justify-center">
              Private environment
            </div>
          )}
          <button
            onClick={onClose}
            className="rounded-2xl border border-black/8 bg-white px-6 py-3 text-sm font-bold text-cyber-text hover:bg-black/[0.03] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// High-fidelity CSS-simulated dashboard mockups for Apple Studio design
function HealthcareAiMockup() {
  return (
    <div className="relative w-full max-w-3xl aspect-[16/9.5] sm:aspect-[16/8.5] bg-white dark:bg-zinc-950 rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.06)] border border-black/5 dark:border-white/5 overflow-hidden flex flex-col mb-10 transition-transform duration-500 hover:scale-[1.01] hover:shadow-[0_32px_60px_-12px_rgba(0,0,0,0.08)]">
      {/* Chrome bar */}
      <div className="h-10 border-b border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex gap-1.5 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="text-[10px] font-mono font-bold text-cyber-text tracking-wider uppercase">
          🏥 intake-sanitization-pipeline
        </span>
        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-mono font-black tracking-wider uppercase">
          Safe-Pipe Active
        </span>
      </div>
      
      {/* Screen layout */}
      <div className="flex-1 flex min-h-0 bg-slate-50/[0.2] dark:bg-zinc-900/[0.2]">
        {/* Left Side: Intake Log */}
        <div className="w-2/5 border-r border-black/5 dark:border-white/5 p-4 flex flex-col gap-2 overflow-hidden text-left bg-white/40 dark:bg-zinc-900/20">
          <div className="text-[10px] font-mono font-bold text-cyber-text uppercase tracking-widest opacity-60">
            Raw Payload Input
          </div>
          <div className="flex-1 font-mono text-[10px] sm:text-xs leading-relaxed text-cyber-muted space-y-2 select-none">
            <div className="border-l-2 border-amber-400/40 pl-2 py-0.5">
              <span>Patient: </span>
              <span className="bg-zinc-950 text-zinc-950 dark:bg-white dark:text-white px-2 py-0.5 rounded font-black cursor-not-allowed select-none">
                REDACTED
              </span>
            </div>
            <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-2">
              Symptoms: "Constant high-fever & migraines..."
            </div>
            <div className="border-l-2 border-amber-400/40 pl-2 py-0.5">
              <span>Contact: </span>
              <span className="bg-zinc-950 text-zinc-950 dark:bg-white dark:text-white px-2 py-0.5 rounded font-black cursor-not-allowed select-none">
                REDACTED
              </span>
            </div>
            <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-2">
              History: "None noted, requests callback."
            </div>
          </div>
        </div>

        {/* Right Side: Vetted Output */}
        <div className="flex-1 p-4 flex flex-col gap-3 text-left justify-between bg-white/80 dark:bg-zinc-950/80">
          <div className="space-y-3 min-h-0 overflow-y-auto scrollbar-none">
            <div className="text-[10px] font-mono font-bold text-cyber-blue uppercase tracking-widest">
              Gemini Vetted Insights
            </div>
            
            {/* Sanitized fields */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center rounded-lg bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5">
                <span className="text-[10px] font-mono font-bold text-cyber-text">Sanitization Status</span>
                <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                  ✓ SECURE
                </span>
              </div>
              <div className="flex justify-between items-center rounded-lg bg-slate-50 dark:bg-zinc-900/40 px-3 py-1.5">
                <span className="text-[10px] font-mono font-bold text-cyber-text">Extracted Symptoms</span>
                <span className="text-[10px] font-semibold text-cyber-text">Fever, Migraine</span>
              </div>
              <div className="flex justify-between items-center rounded-lg bg-slate-50 dark:bg-zinc-900/40 px-3 py-1.5">
                <span className="text-[10px] font-mono font-bold text-cyber-text">Clinical Priority</span>
                <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                  ⚠️ HIGH URGENCY
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-black/5 dark:border-white/5 pt-2 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-cyber-muted">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero Leakage Enforced</span>
            </div>
            <div className="font-bold text-cyber-text">Latency: 0.8s</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmartFarmingMockup() {
  return (
    <div className="relative w-full max-w-3xl aspect-[16/9.5] sm:aspect-[16/8.5] bg-[#0b0c10] text-gray-300 rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col mb-10 transition-transform duration-500 hover:scale-[1.01]">
      {/* Chrome bar */}
      <div className="h-10 border-b border-white/5 bg-[#12131a] flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex gap-1.5 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase">
          🚜 IoT-TELEMETRY-NODES · PLOT 4-B
        </span>
        <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-mono font-black tracking-wider uppercase">
          1,500 Ingest/s
        </span>
      </div>

      {/* Screen layout with custom grid */}
      <div className="flex-1 flex min-h-0 bg-[#0e0f15] relative">
        {/* SVG telemetry graph lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Dynamic plot coordinates preview */}
        <div className="w-1/3 border-r border-white/5 p-4 flex flex-col justify-between overflow-hidden relative z-10 text-left bg-black/40">
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
              Live Coordinates
            </div>
            <div className="space-y-2">
              <div className="rounded-lg bg-white/5 px-3 py-1.5 flex justify-between items-center text-[10px] font-mono">
                <span className="opacity-60">Plot Alpha</span>
                <span className="text-emerald-400 font-bold">45.102, -122.34</span>
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-1.5 flex justify-between items-center text-[10px] font-mono">
                <span className="opacity-60">Plot Beta</span>
                <span className="text-sky-400 font-bold">45.105, -122.36</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-sky-500/5 border border-sky-500/10 p-2.5 font-mono text-[9px] leading-relaxed text-sky-400">
            <div>$ bucket --precompute</div>
            <div className="opacity-75">→ reduced raw writes by ~94%</div>
          </div>
        </div>

        {/* Aggregated dashboard stats & graphical nodes */}
        <div className="flex-1 p-4 flex flex-col justify-between relative z-10 text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
              Telemetry Microclimate
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Ingestion OK</span>
            </div>
          </div>

          {/* SVG Telemetry Curve representation */}
          <div className="flex-1 w-full flex items-center justify-center py-2 relative">
            <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 80">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Telemetry line */}
              <path
                d="M 10 50 Q 40 20, 80 60 T 150 25 T 190 40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-90"
              />
              <path
                d="M 10 50 Q 40 20, 80 60 T 150 25 T 190 40 L 190 75 L 10 75 Z"
                fill="url(#chartGrad)"
                className="opacity-40"
              />
              
              {/* Interactive Sensor Nodes */}
              <circle cx="80" cy="60" r="3.5" fill="#3b82f6" className="animate-pulse" />
              <circle cx="150" cy="25" r="3.5" fill="#10b981" />
              <line x1="80" y1="60" x2="150" y2="25" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            </svg>
            <div className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-[8px] font-mono border border-white/5">
              Query P95: <span className="text-white font-bold">250ms</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-[8px] font-mono text-gray-500 uppercase">Moisture</div>
              <div className="text-xs font-mono font-black text-emerald-400 mt-0.5">42.5%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-[8px] font-mono text-gray-500 uppercase">Temp</div>
              <div className="text-xs font-mono font-black text-orange-400 mt-0.5">24.8°C</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-[8px] font-mono text-gray-500 uppercase">Irrigation</div>
              <div className="text-xs font-mono font-black text-sky-400 mt-0.5">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebIdeMockup() {
  return (
    <div className="relative w-full max-w-3xl aspect-[16/9.5] sm:aspect-[16/8.5] bg-[#1a1b24] text-gray-300 rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col mb-10 transition-transform duration-500 hover:scale-[1.01]">
      {/* Chrome bar */}
      <div className="h-10 border-b border-[#252632] bg-[#14151c] flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex gap-1.5 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase">
          💻 IDE-SANDBOX.tsx · COMPILER
        </span>
        <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-black tracking-wider uppercase">
          Reload: 12ms
        </span>
      </div>

      {/* Screen layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left Side: Sidebar file tree */}
        <div className="w-1/4 border-r border-[#252632] p-3 flex flex-col gap-2 overflow-hidden text-left bg-[#15161d]/60 select-none">
          <div className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">
            Workspace Files
          </div>
          <div className="space-y-1.5 font-mono text-[9px] sm:text-[10px] text-gray-400">
            <div className="text-gray-500">📁 components/</div>
            <div className="pl-3 text-purple-400 font-semibold">📄 Sandbox.tsx</div>
            <div className="pl-3 opacity-75">📄 Terminal.tsx</div>
            <div className="text-gray-500">📁 lib/</div>
            <div className="pl-3 opacity-75">📄 vm-worker.ts</div>
          </div>
        </div>

        {/* Center/Right split layout */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#1a1b24]">
          {/* Main Code Editor Panel with AI suggestions */}
          <div className="flex-1 p-3 font-mono text-[10px] sm:text-xs leading-normal text-left overflow-y-auto scrollbar-none space-y-1 select-text">
            <div className="text-gray-500">// Code execution vetting layer</div>
            <div>
              <span className="text-purple-400">const</span> <span className="text-sky-400">result</span> = <span className="text-purple-400">await</span> sandboxVM.run(&#123;
            </div>
            <div className="pl-3 text-red-400/90 bg-red-950/20 border-l-2 border-red-500/50 py-0.5">
              - code: clientAuthoredScript,
            </div>
            <div className="pl-3 text-emerald-400 font-semibold bg-emerald-950/20 border-l-2 border-emerald-500/50 py-0.5">
              + code: sanitizePrimitives(clientAuthoredScript),
            </div>
            <div className="pl-3 text-emerald-400 font-semibold bg-emerald-950/20 border-l-2 border-emerald-500/50 py-0.5">
              + timeout: 15,
            </div>
            <div className="pl-3 text-emerald-400 font-semibold bg-emerald-950/20 border-l-2 border-emerald-500/50 py-0.5">
              + isolation: "iframe-sandbox"
            </div>
            <div>&#125;);</div>
          </div>

          {/* Sandbox Preview Output & AI Assistant Recommendation overlay */}
          <div className="border-t border-[#252632] bg-[#14151c] p-3 flex items-center justify-between text-left shrink-0 font-mono text-[9px] sm:text-[10px]">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Compile: SUCCESS</span>
            </div>
            <div className="text-purple-400 bg-purple-500/5 px-2 py-0.5 border border-purple-500/20 rounded font-bold">
              AI Token Optimization: ~60%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const scopeRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<Project | null>(null);

  useRevealOnScroll(scopeRef, {
    selector: "[data-reveal]",
    y: 18,
    start: "top 84%",
    duration: 0.95,
    stagger: 0.08,
    once: true,
  });

  const renderMockup = (id: string) => {
    switch (id) {
      case "healthcare-ai":
        return <HealthcareAiMockup />;
      case "smart-farming":
        return <SmartFarmingMockup />;
      case "ai-editor":
        return <WebIdeMockup />;
      default:
        return null;
    }
  };

  return (
    <section ref={scopeRef} id="projects" className="mt-20 sm:mt-24 max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <div
          data-reveal
          className="font-mono text-xs sm:text-sm tracking-[0.2em] font-bold text-cyber-text uppercase opacity-70"
        >
          Featured Build Architecture
        </div>
        <h2
          data-reveal
          className="text-4xl sm:text-5xl font-black tracking-[-0.03em] text-cyber-text max-w-3xl"
        >
          Case studies, not screenshots.
        </h2>
        <p data-reveal className="max-w-2xl text-base sm:text-lg leading-relaxed text-cyber-muted font-medium">
          Below is a live-simulated look at clinical security pipelines, high-volume bucketing charts, and isolated code sandbox VM compilers. Click <span className="text-cyber-blue font-bold">Read full architecture study ➔</span> to audit dependencies and run a live Gemini technical assessment.
        </p>
      </div>

      <div className="space-y-16 sm:space-y-24">
        {PROJECTS.map((proj) => (
          <div key={proj.id} data-reveal className="w-full">
            <article
              className="bg-[#fbfbfb] dark:bg-zinc-900/40 p-8 sm:p-12 md:p-16 rounded-[32px] transition-colors duration-300 flex flex-col items-center justify-between"
            >
              {/* CSS UI Interactive Dashboard Visual */}
              <div className="w-full flex justify-center">
                {renderMockup(proj.id)}
              </div>

              {/* Title & Info Centered */}
              <div className="mt-8 text-center max-w-2xl mx-auto space-y-4">
                <div className="flex justify-center items-center gap-3">
                  <span className="rounded-full border border-black/5 bg-black/[0.02] dark:border-white/5 dark:bg-white/[0.02] px-4 py-2 font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase">
                    {proj.category}
                  </span>
                  {proj.liveUrl ? (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-zinc-950 p-2 text-cyber-text hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
                      aria-label={`Open ${proj.title} live preview`}
                      title="Live preview"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-cyber-text tracking-[-0.02em]">
                  {proj.title}
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-cyber-muted font-medium">
                  {proj.description}
                </p>

                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 py-2">
                  {proj.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2 text-sm sm:text-base text-cyber-text font-semibold"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyber-blue/70 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setActive(proj)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-black/8 dark:border-white/8 font-mono text-xs sm:text-sm tracking-[0.15em] font-bold text-cyber-text hover:bg-black/[0.03] dark:hover:bg-white/[0.03] shadow-sm transition active:scale-[0.98] cursor-pointer"
                  >
                    <Terminal className="h-4 w-4 text-cyber-blue" />
                    Read full architecture study ➔
                  </button>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <CaseStudyModal project={active} onClose={() => setActive(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
