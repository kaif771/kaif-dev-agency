"use client";

import React, { useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import Magnetic from "@/components/motion/Magnetic";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";

type SubmitStatus = "idle" | "success" | "error";

type BudgetTier = {
  title: string;
  desc: string;
  colorClass: string;
};

function getBudgetTierLabel(budget: number): BudgetTier {
  if (budget < 3000) {
    return {
      title: "MVP / Proof of concept",
      desc: "Fast validation with a clean production path.",
      colorClass: "text-cyber-green",
    };
  }

  if (budget < 8000) {
    return {
      title: "Production build",
      desc: "Polished UX, database, deploy, and maintainable architecture.",
      colorClass: "text-cyber-blue",
    };
  }

  return {
    title: "High‑stakes systems",
    desc: "Performance, security, and scale with tighter engineering loops.",
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
    budget: 5000,
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const budgetInfo = useMemo(() => getBudgetTierLabel(formData.budget), [formData.budget]);

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
        setFormData({ name: "", email: "", budget: 5000, details: "" });
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
        <div data-reveal className="lg:col-span-5 glass-panel rounded-3xl p-7 sm:p-9 border-white/8 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyber-blue/10 blur-3xl" />
            <div className="absolute -bottom-28 right-0 h-64 w-64 rounded-full bg-cyber-green/8 blur-3xl" />
          </div>

          <div className="relative">
            <div className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase">
              Project intake
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.02em] text-cyber-text">
              Let’s build something that feels expensive.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-cyber-muted">
              Share scope, constraints, and timeline. You’ll get a structured response with next
              steps and an honest technical plan.
            </p>

            <div className="mt-8 space-y-3 text-sm text-cyber-muted">
              {[
                { k: "Response", v: "Within 12 hours" },
                { k: "Slots", v: "2 active builds" },
                { k: "Engagement", v: "Milestone or fixed" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/2 px-4 py-3"
                >
                  <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-cyber-muted">
                    {item.k}
                  </span>
                  <span className="text-cyber-text font-semibold">{item.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-5 font-mono text-[10px] tracking-[0.32em] text-cyber-muted">
              SECURE FORM · API ROUTE · RESEND OPTIONAL
            </div>
          </div>
        </div>

        <div data-reveal className="lg:col-span-7 glass-panel rounded-3xl p-7 sm:p-9 border-white/8">
          {submitStatus === "success" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/2 p-5">
                <div className="font-mono text-[10px] tracking-[0.35em] text-cyber-green uppercase">
                  Received
                </div>
                <div className="mt-2 text-lg font-bold text-cyber-text">
                  Thanks — I’ve got it.
                </div>
                <p className="mt-2 text-sm leading-relaxed text-cyber-muted">{statusMessage}</p>
              </div>

              <button
                onClick={() => setSubmitStatus("idle")}
                className="rounded-2xl border border-white/10 bg-white/2 px-5 py-3 text-sm font-semibold text-cyber-text hover:bg-white/4 transition-colors"
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
                    className="block font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/2 px-4 py-3 text-sm text-cyber-text placeholder:text-white/25 focus:outline-none focus:border-white/18 focus:bg-white/3 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/2 px-4 py-3 text-sm text-cyber-text placeholder:text-white/25 focus:outline-none focus:border-white/18 focus:bg-white/3 transition"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="flex items-center justify-between gap-4">
                  <label className="font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase">
                    Budget
                  </label>
                  <div className="rounded-full border border-white/10 bg-white/2 px-3 py-1.5 text-xs font-mono text-cyber-text">
                    ${formData.budget.toLocaleString()}
                  </div>
                </div>

                <input
                  type="range"
                  min={1000}
                  max={15000}
                  step={500}
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, budget: parseInt(e.target.value, 10) }))
                  }
                  className="mt-4 w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10 accent-cyber-blue"
                />

                <div className="mt-4">
                  <div className={`text-sm font-bold ${budgetInfo.colorClass}`}>
                    {budgetInfo.title}
                  </div>
                  <div className="mt-1 text-xs text-cyber-muted">{budgetInfo.desc}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="details"
                  className="block font-mono text-[10px] tracking-[0.35em] text-cyber-muted uppercase"
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
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/2 px-4 py-3 text-sm text-cyber-text placeholder:text-white/25 focus:outline-none focus:border-white/18 focus:bg-white/3 transition"
                />
              </div>

              {submitStatus === "error" ? (
                <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-cyber-text">
                  {statusMessage}
                </div>
              ) : null}

              <Magnetic className="block">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-cyber-blue px-6 py-4 text-sm font-semibold text-black hover:brightness-105 disabled:opacity-60 transition"
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
