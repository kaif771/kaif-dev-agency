"use client";

import React, { useMemo, useRef, useState } from "react";
import { ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";

type SubmitStatus = "idle" | "success" | "error";

type BudgetTier = {
  title: string;
  desc: string;
  colorClass: string;
};

function getBudgetTierLabel(budget: number): BudgetTier {
  if (budget < 500) {
    return {
      title: "Micro-build / Proof of concept",
      desc: "Fast validation with a clean, light production path.",
      colorClass: "text-cyber-green",
    };
  }

  if (budget < 1000) {
    return {
      title: "MVP / Core Release",
      desc: "Polished core functionality, reliable database, and custom UX.",
      colorClass: "text-cyber-blue",
    };
  }

  return {
    title: "Premium Production System",
    desc: "Complete production-ready build, high performance, and deep scaling integration.",
    colorClass: "text-cyber-blue",
  };
}

export default function Contact() {
  const scopeRef = useRef<HTMLElement | null>(null);

  useRevealOnScroll(scopeRef, {
    selector: "[data-reveal]",
    y: 18,
    start: "top 84%",
    duration: 0.95,
    stagger: 0.08,
    once: true,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: 500,
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Scope audit states
  const [isScopeAuditing, setIsScopeAuditing] = useState(false);
  const [scopeAuditData, setScopeAuditData] = useState<{
    command: string;
    trace: string[];
    result: string;
    complexity: string;
    offline?: boolean;
  } | null>(null);

  const budgetInfo = useMemo(() => getBudgetTierLabel(formData.budget), [formData.budget]);

  const handleScopeAudit = async () => {
    if (formData.details.length < 10) return;
    setIsScopeAuditing(true);
    setScopeAuditData(null);
    try {
      const response = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "scope-audit",
          name: formData.name || "Anonymous Client",
          budget: formData.budget,
          details: formData.details,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setScopeAuditData(data.data);
          setIsScopeAuditing(false);
        }, 1500);
      } else {
        setIsScopeAuditing(false);
      }
    } catch (error) {
      console.error("Scope audit failed:", error);
      setIsScopeAuditing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setStatusMessage(data.message || "Request received.");
        setFormData({ name: "", email: "", budget: 500, details: "" });
        setScopeAuditData(null); // Reset scope audit data
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.error || "Something went wrong.");
      }
    } catch {
      setSubmitStatus("error");
      setStatusMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={scopeRef} id="contact" className="mt-16 sm:mt-20 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div data-reveal className="lg:col-span-5 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 relative overflow-hidden shadow-sm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyber-blue/10 blur-3xl" />
            <div className="absolute -bottom-28 right-0 h-64 w-64 rounded-full bg-cyber-green/8 blur-3xl" />
          </div>

          <div className="relative">
            <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase">
              Project intake
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-[-0.02em] text-cyber-text">
              Let’s build something that feels expensive.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cyber-text font-medium">
              Share scope, constraints, and timeline. You’ll get a structured response with next
              steps and an honest technical plan.
            </p>

            <div className="mt-8 space-y-3 text-base text-cyber-text">
              {[
                { k: "Response", v: "Within 12 hours" },
                { k: "Slots", v: "2 active builds" },
                { k: "Engagement", v: "Milestone or fixed" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="flex items-center justify-between rounded-2xl border border-black/8 bg-white/70 px-4 py-3.5 shadow-sm"
                >
                  <span className="font-mono text-xs sm:text-sm tracking-[0.15em] uppercase text-cyber-text font-bold">
                    {item.k}
                  </span>
                  <span className="text-cyber-text font-black">{item.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-black/8 pt-5 font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text">
              SECURE FORM · API ROUTE · RESEND OPTIONAL
            </div>
          </div>
        </div>

        <div data-reveal className="lg:col-span-7 glass-panel rounded-3xl p-7 sm:p-9 border-black/8 shadow-sm">
          {submitStatus === "success" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-black/8 bg-white/70 p-6 shadow-sm">
                <div className="font-mono text-xs tracking-[0.24em] font-bold text-cyber-green uppercase">
                  Received
                </div>
                <div className="mt-2 text-xl font-bold text-cyber-text">
                  Thanks — I’ve got it.
                </div>
                <p className="mt-2 text-base leading-relaxed text-cyber-text font-medium">{statusMessage}</p>
              </div>

              <button
                onClick={() => setSubmitStatus("idle")}
                className="rounded-2xl border border-black/8 bg-white px-5 py-3.5 text-base font-bold text-cyber-text hover:bg-black/[0.03] transition-colors shadow-sm"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border-0 bg-slate-50 dark:bg-zinc-900/50 px-4 py-3.5 text-base font-semibold text-cyber-text placeholder:text-cyber-muted/40 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-cyber-blue/20 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="w-full rounded-2xl border-0 bg-slate-50 dark:bg-zinc-900/50 px-4 py-3.5 text-base font-semibold text-cyber-text placeholder:text-cyber-muted/40 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-cyber-blue/20 transition"
                  />
                </div>
              </div>

              <div className="rounded-3xl border-0 bg-slate-50 dark:bg-zinc-900/40 p-5.5">
                <div className="flex items-center justify-between gap-4">
                  <label className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase">
                    Budget Tier
                  </label>
                  <div className="rounded-full border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 px-4 py-2 text-sm sm:text-base font-mono text-cyber-text font-black shadow-sm">
                    ${formData.budget.toLocaleString()}
                  </div>
                </div>

                <input
                  type="range"
                  min={100}
                  max={1500}
                  step={100}
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, budget: parseInt(e.target.value, 10) }))
                  }
                  className="mt-4 w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-black/10 dark:bg-white/10 accent-cyber-blue"
                />

                <div className="mt-4">
                  <div className={`text-base font-black ${budgetInfo.colorClass}`}>
                    {budgetInfo.title}
                  </div>
                  <div className="mt-1 text-sm text-cyber-muted font-medium">{budgetInfo.desc}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="details"
                  className="block font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase"
                >
                  Project details
                </label>
                <textarea
                  id="details"
                  required
                  rows={5}
                  value={formData.details}
                  onChange={(e) => setFormData((p) => ({ ...p, details: e.target.value }))}
                  placeholder="What are we building? Timeline, integrations, constraints…"
                  className="w-full resize-none rounded-2xl border-0 bg-slate-50 dark:bg-zinc-900/50 px-4 py-3.5 text-base font-semibold text-cyber-text placeholder:text-cyber-muted/40 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-cyber-blue/20 transition"
                />
              </div>

              {/* Premium Gemini AI Scope Estimator Module */}
              <div className="rounded-3xl border-0 bg-slate-50 dark:bg-zinc-900/40 p-5.5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-cyber-text uppercase flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-cyber-blue animate-pulse" />
                      AI Scope Estimator
                    </div>
                    <div className="text-xs text-cyber-muted font-medium">
                      Get instant architecture suggestions and complexity estimation.
                    </div>
                  </div>
                  
                  {/* Custom green active/disabled styling on the Analyze Scope button based on details character validation */}
                  <button
                    type="button"
                    disabled={isScopeAuditing || formData.details.trim().length < 10}
                    onClick={handleScopeAudit}
                    className={`rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition duration-300 flex items-center justify-center gap-1.5 ${
                      formData.details.trim().length >= 10
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 cursor-pointer active:scale-[0.98]"
                        : "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600/55 dark:text-emerald-400/45 border border-emerald-500/10 cursor-not-allowed"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    {isScopeAuditing ? "Analyzing..." : "Analyze Scope"}
                  </button>
                </div>

                {isScopeAuditing && (
                  <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.04] dark:bg-white/[0.02] p-4.5 font-mono text-xs leading-relaxed text-cyber-muted animate-pulse">
                    <div className="text-cyber-text font-bold">$ pnpm ship --analyze-scope</div>
                    <div className="text-cyber-blue font-bold mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-ping"></span>
                      → consulting Gemini Systems Architect...
                    </div>
                    <div className="text-gray-400">→ inspecting complexity bounds and technical stack options...</div>
                  </div>
                )}

                {!isScopeAuditing && (
                  <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950 p-4.5 font-mono text-xs leading-relaxed text-cyber-muted relative overflow-hidden">
                    {formData.details.trim().length >= 10 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-cyber-text font-bold">
                            $ {scopeAuditData ? scopeAuditData.command : `pnpm ship --plan=${formData.budget < 500 ? "poc" : formData.budget < 1000 ? "mvp" : "production"} --budget=$${formData.budget}`}
                          </span>
                          <span className="text-[9px] text-cyber-blue border border-cyber-blue/30 bg-cyber-blue/5 px-2 py-0.5 rounded font-bold font-mono">
                            {scopeAuditData ? (scopeAuditData.offline ? "SIMULATED REVIEW" : "LIVE GEMINI") : "REAL-TIME LOGS"}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1">
                          {scopeAuditData ? (
                            scopeAuditData.trace?.map((line: string, idx: number) => (
                              <div key={idx} className={line.startsWith("✓") ? "text-cyber-green font-bold" : "text-cyber-muted"}>
                                {line}
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="text-amber-500 font-bold">→ Dynamic budget tier spec:</div>
                              <div className="text-cyber-green font-bold">✓ Target Budget: ${formData.budget} ({formData.budget < 500 ? "Proof of Concept" : formData.budget < 1000 ? "MVP Release" : "Premium Sharded Architecture"})</div>
                              <div className="text-cyber-muted">✓ Stack Recommendation: Next.js + {formData.budget < 500 ? "SQLite/KV" : formData.budget < 1000 ? "MongoDB Atlas (Indexed)" : "PostgreSQL/Redis Cluster"}</div>
                              <div className="text-cyber-muted">✓ Animation/Motion layer: Framer Motion + {formData.budget >= 1000 ? "Lenis Scroll & GSAP" : "Basic CSS Transitions"}</div>
                              <div className="text-cyber-blue font-bold">→ Ready for technical audit (click green button above)</div>
                            </>
                          )}
                        </div>

                        <div className="border-t border-black/5 dark:border-white/5 pt-3 mt-3 space-y-2">
                          <div className="flex items-center justify-between gap-4 font-sans text-xs">
                            <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-cyber-text">Complexity Tier</span>
                            <span className="font-black text-cyber-blue">
                              {scopeAuditData ? scopeAuditData.complexity : (formData.budget < 500 ? "Lightweight POC Tier" : formData.budget < 1000 ? "Standard MVP Tier" : "Premium Scaling Tier")}
                            </span>
                          </div>
                          
                          <div className="border-t border-black/5 pt-2">
                            <div className="text-cyber-blue font-bold text-[10px] uppercase tracking-wider mb-1 font-sans">
                              {scopeAuditData ? "GEMINI ARCHITECTURAL BRIEF:" : "PREVIEW SPEC:"}
                            </div>
                            <p className="text-cyber-text font-semibold leading-normal font-sans text-xs sm:text-sm">
                              {scopeAuditData ? scopeAuditData.result : (
                                formData.budget < 500
                                  ? "Fast PoC pathway optimized for low latency and zero server costs. Focuses on core product flow validation with clean, modular TypeScript handlers."
                                  : formData.budget < 1000
                                  ? "Standard release with a secure query routing pattern and clean server endpoints. Perfect for standard database aggregates, automated mailers, and premium visual components."
                                  : "Premium architecture featuring geo-distributed clusters, complete database indexing, caching strategies, and robust client/server safety gates."
                              )}
                            </p>
                          </div>
                        </div>

                        {scopeAuditData && (
                          <button
                            type="button"
                            onClick={handleScopeAudit}
                            className="mt-3 w-full py-2 px-3 text-[11px] font-bold rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-zinc-950 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-cyber-text font-sans transition active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Run New Scope Analysis
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-xs font-mono font-bold text-cyber-muted">
                        ⚠️ Describe your project details above (min 10 chars) to unlock the live AI architecture preview console
                      </div>
                    )}
                  </div>
                )}
              </div>

              {submitStatus === "error" ? (
                <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3.5 text-base font-semibold text-cyber-text">
                  {statusMessage}
                </div>
              ) : null}

              <Magnetic className="block">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-cyber-blue px-6 py-4.5 text-base font-bold text-white hover:brightness-105 disabled:opacity-60 transition shadow-md cursor-pointer"
                >
                  {isSubmitting ? "Sending…" : "Send request"}
                  <ChevronRight className="inline-block ml-2 h-4 w-4" />
                </button>
              </Magnetic>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
