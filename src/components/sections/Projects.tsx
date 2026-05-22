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

  return (
    <section ref={scopeRef} id="projects" className="mt-16 sm:mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div
            data-reveal
            className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase"
          >
            Work
          </div>
          <h2
            data-reveal
            className="mt-3 text-3xl sm:text-4xl font-black tracking-[-0.02em] text-cyber-text"
          >
            Case studies, not screenshots.
          </h2>
        </div>

        <p data-reveal className="max-w-xl text-base sm:text-[17px] leading-relaxed text-cyber-text font-medium">
          Click <span className="text-cyber-text font-bold">Under the hood</span> for the engineering story:
          constraints, solution shape, and what moved the needle.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PROJECTS.map((proj) => (
          <Tilt key={proj.id} className="h-full">
            <article
              data-reveal
              className="glass-panel h-full rounded-3xl p-7 border-black/8 transition-colors duration-300 hover:bg-black/[0.01] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-black/8 bg-black/[0.02] px-4 py-2.5 font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase">
                    {proj.category}
                  </span>
                  {proj.liveUrl ? (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-black/8 bg-white p-2 text-cyber-text hover:bg-black/[0.03] transition-colors"
                      aria-label={`Open ${proj.title} live preview`}
                      title="Live preview"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                <h3 className="mt-5 text-xl font-bold text-cyber-text tracking-[-0.01em]">
                  {proj.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-cyber-text font-medium">
                  {proj.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {proj.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2 text-base text-cyber-text font-semibold"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyber-blue/70 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7">
                <button
                  onClick={() => setActive(proj)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-base font-bold text-cyber-text hover:bg-black/[0.03] transition-colors shadow-sm"
                >
                  <Terminal className="h-4 w-4 text-cyber-blue" />
                  Under the hood
                  <ArrowRight className="h-4 w-4 text-cyber-muted" />
                </button>
              </div>
            </article>
          </Tilt>
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
