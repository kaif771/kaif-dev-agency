export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  liveUrl?: string;
  underTheHood: {
    challenge: string;
    solution: string;
    metrics: string[];
  };
};

export const PROJECTS: Project[] = [
  {
    id: "healthcare-ai",
    title: "Healthcare AI Assistant",
    category: "AI Integration · Secure Dashboard",
    description:
      "A clinical support system that turns dense intake data into searchable insights — with strict privacy boundaries and fast operator UX.",
    highlights: [
      "TypeScript-first codebase",
      "Sanitized client payload pipeline",
      "Role-based dashboard surfaces",
    ],
    underTheHood: {
      challenge:
        "Parse unstructured medical notes while preventing PHI leakage and keeping response latency predictable.",
      solution:
        "Built a local sanitization step before LLM calls, enforced scoped server endpoints, and designed a minimal dashboard state model to avoid sensitive caching.",
      metrics: [
        "PHI redaction preflight",
        "< 1.2s median response",
        "No server-side message logs",
      ],
    },
  },
  {
    id: "smart-farming",
    title: "Smart Farming Telemetry",
    category: "Full‑Stack · IoT Data Platform",
    description:
      "A time-series telemetry dashboard for microclimate + irrigation decisions — designed for high write volume and stable reads.",
    highlights: [
      "Aggregation schema",
      "Indexed geo queries",
      "Realtime chart UX",
    ],
    liveUrl: "https://smart-farming-lac.vercel.app/",
    underTheHood: {
      challenge:
        "Sustain heavy ingestion without locking the database or creating dashboard jank.",
      solution:
        "Bucketed raw readings into pre-computed windows, added index strategy for geo lookups, and reduced client work via thin, typed payloads.",
      metrics: [
        "~94% write reduction",
        "~250ms query p95",
        "1,500+ updates/sec simulated",
      ],
    },
  },
  {
    id: "ai-editor",
    title: "AI‑Assisted Web IDE",
    category: "SaaS Dev Tool",
    description:
      "A browser IDE experience with isolated execution, fast refresh, and AI refactoring workflows.",
    highlights: [
      "Iframe sandbox",
      "postMessage bridge",
      "Context-aware orchestration",
    ],
    liveUrl: "https://google-ai-mocha.vercel.app/",
    underTheHood: {
      challenge:
        "Execute user-authored code in-browser without compromising the host app.",
      solution:
        "Shipped a dual-layer sandbox with strict messaging boundaries and a lightweight validator to block unsafe primitives.",
      metrics: [
        "Isolated execution",
        "< 15ms hot reload",
        "~60% token optimization",
      ],
    },
  },
];
