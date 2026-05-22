"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink, Terminal } from "lucide-react";
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
        className="relative w-full max-w-3xl glass-panel rounded-3xl border border-black/8 overflow-hidden"
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="p-6 sm:p-7 border-b border-black/8 flex items-start justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase">
              Under the hood
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-[-0.02em] text-cyber-text">
              {project.title}
            </h3>
            <div className="mt-2 text-sm text-cyber-muted">{project.category}</div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-black/8 bg-white px-3 py-2 text-xs font-mono tracking-[0.18em] text-cyber-muted hover:text-cyber-text hover:bg-black/[0.03] transition-colors"
          >
            CLOSE
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyber-blue uppercase">
              Challenge
            </div>
            <p className="rounded-2xl border border-black/8 bg-white/70 p-4 text-sm leading-relaxed text-cyber-muted">
              {project.underTheHood.challenge}
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyber-green uppercase">
              Solution
            </div>
            <p className="rounded-2xl border border-black/8 bg-white/70 p-4 text-sm leading-relaxed text-cyber-muted">
              {project.underTheHood.solution}
            </p>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase">
              Metrics
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.underTheHood.metrics.map((m) => (
                <div
                  key={m}
                  className="rounded-2xl border border-black/8 bg-white/70 p-4 text-sm text-cyber-text font-bold"
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-black/8 flex gap-3">
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
            <div className="flex-1 rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3 text-sm text-center text-cyber-muted">
              Private environment
            </div>
          )}
          <button
            onClick={onClose}
            className="rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-cyber-text hover:bg-black/[0.03] transition-colors"
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
            className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
          >
            Work
          </div>
          <h2
            data-reveal
            className="mt-3 text-2xl sm:text-3xl font-black tracking-[-0.02em] text-cyber-text"
          >
            Case studies, not screenshots.
          </h2>
        </div>

        <p data-reveal className="max-w-xl text-sm leading-relaxed text-cyber-muted">
          Click <span className="text-cyber-text">Under the hood</span> for the engineering story:
          constraints, solution shape, and what moved the needle.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PROJECTS.map((proj) => (
          <Tilt key={proj.id} className="h-full">
            <article
              data-reveal
              className="glass-panel h-full rounded-3xl p-6 border-black/8 transition-colors duration-300 hover:bg-black/[0.01]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-black/8 bg-black/[0.02] px-3 py-1.5 font-mono text-[10px] tracking-[0.28em] text-cyber-muted uppercase">
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

              <h3 className="mt-5 text-lg font-bold text-cyber-text tracking-[-0.01em]">
                {proj.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cyber-muted">
                {proj.description}
              </p>

              <ul className="mt-5 space-y-2">
                {proj.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-[12px] text-cyber-muted"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-blue/70" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <button
                  onClick={() => setActive(proj)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-cyber-text hover:bg-black/[0.03] transition-colors"
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
