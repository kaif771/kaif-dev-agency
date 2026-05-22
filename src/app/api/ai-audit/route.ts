import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

// High-fidelity fallback presets for offline/error situations
const FALLBACKS = {
  architecture: {
    command: "inspect --target=layout-boundaries",
    trace: [
      "→ auditing page.tsx static bundle entry points...",
      "→ detected layout prop drilling across 4 server layers",
      "→ injecting React server component async context boundaries...",
      "✓ component serialization verified (TS safe)",
    ],
    result: "Decouple heavy state from the root layout. Use localized react state components or dynamic dynamic imports to prevent full page re-renders during route transitions."
  },
  "ai-systems": {
    command: "pipeline --run=vector-rag",
    trace: [
      "→ computing query vectors using text-embedding-004...",
      "→ scanning Pinecone vector space index (cosine similarity)...",
      "→ performing Cohere v3 reranking on top 10 matches...",
      "✓ extracted 3 primary documentation citations"
    ],
    result: "RAG pipeline execution verified. Prompt inputs wrapped in strict system boundaries with LLM-guard to eliminate jailbreaks. Latency: 324ms."
  },
  performance: {
    LCP: {
      command: "optimize --metric=LCP",
      trace: [
        "→ parsing critical rendering path HTML...",
        "→ detected fetch priority bottleneck on hero banner element",
        "→ injecting fetchpriority='high' and preconnect links...",
        "✓ Largest Contentful Paint target reduced by 650ms",
      ],
      result: "Ensure above-the-fold hero images are configured with high fetch priority and are never lazy-loaded. Preconnect critical CDNs to eliminate handshakes."
    },
    CLS: {
      command: "optimize --metric=CLS",
      trace: [
        "→ measuring page layout shifting coordinates...",
        "→ found dynamic height injection on header navbar components",
        "→ reserving explicit aspect-ratio wrappers and min-heights...",
        "✓ Cumulative Layout Shift stabilized to 0.005",
      ],
      result: "Always declare strict aspect-ratios or height limits on dynamic items (e.g. ad banners, lazy elements) to stabilize the layout viewport."
    },
    TTFB: {
      command: "optimize --metric=TTFB",
      trace: [
        "→ tracing dynamic Edge cache headers...",
        "→ caught non-stale caching on geo-distributed server routes",
        "→ configuring Cache-Control s-maxage and stale-while-revalidate...",
        "✓ Time To First Byte optimized to 42ms",
      ],
      result: "Run cacheable fetch operations at the Edge. Utilize Next.js s-maxage headers alongside ISR (Incremental Static Regeneration) for high dynamic throughput."
    },
    JS: {
      command: "optimize --metric=JS-size",
      trace: [
        "→ inspecting webpack chunks index map...",
        "→ detected heavy third-party parsing dependencies inside core bundle",
        "→ refactoring third-party scripts to next/script worker threads...",
        "✓ initial JavaScript load reduced by 48.6kB",
      ],
      result: "Offload heavy analytics scripts to background service workers using next/script's worker strategy. Audit bundle sizes using @next/bundle-analyzer."
    }
  },
  "project-audit": {
    command: "audit --target=project-architecture",
    trace: [
      "→ tracing repository structure & dependency graph...",
      "→ verifying dynamic hydration transitions...",
      "→ evaluating database models query throughput...",
      "✓ structural review compiled successfully"
    ],
    result: "This architecture is highly optimized. To scale further, offload heavy read queries onto specialized Redis read caches and build a localized component hydration system."
  },
  "db-audit": {
    command: "db.leads.explain('executionStats')",
    trace: [
      "→ auditing query execution plan...",
      "→ verifying compound index boundaries on { budget: 1, createdAt: -1 }...",
      "✓ index scan (IXSCAN) verified for compound filter"
    ],
    result: "Compound index budget_1_createdAt_-1 verified. To optimize further at scale, leverage partial index filters for dynamic pipeline stages and separate archive collections for leads over 2 years old."
  },
  "scope-audit": {
    command: "analyze --scope-complexity",
    trace: [
      "→ checking integration requirements...",
      "→ analyzing complexity boundaries...",
      "✓ architecture requirements compiled successfully"
    ],
    result: "We recommend a Serverless Next.js App Router setup with Mongo compound indexing. Use Vercel Edge functions for low-latency intakes, and Resend for transactional hooks.",
    complexity: "Core Product MVP"
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { type, metric, projectTitle, projectCategory, query, name, budget, details, leadsCount, averageBudget, queryExecutionTimeMs } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

        let prompt = "";

        if (type === "architecture") {
          prompt = `You are an Elite AI Compiler and code inspector.
Generate a technical refactoring code tip for a modern Next.js 16/React 19 App Router system.
Format it STRICTLY as a JSON object with this exact structure:
{
  "command": "refactor --target=async-boundaries", // a short shell command
  "trace": [
    "→ analyzing page.tsx static entry points...",
    "→ caught prop-drilling in deep layout hierarchies...",
    "✓ component serialization verified (TS safe)"
  ], // 3-4 log steps, each starting with "→ " or "✓ " or "✗ "
  "result": "the technical code recommendation or brief" // 1-2 sentence extremely direct, technical and high-end refactoring recommendation
}
Ensure the output is valid JSON only. Do not wrap in markdown or backticks. Keep the advice deeply technical.`;
        } else if (type === "ai-systems") {
          prompt = `You are an Elite AI Agent system. Simulating a RAG (Retrieval-Augmented Generation) query run for: "${query || "Get user stats pipeline"}".
Format it STRICTLY as a JSON object with this exact structure:
{
  "command": "pipeline --run=semantic-retrieval",
  "trace": [
    "→ computing query vector embedding...",
    "→ scanning Pinecone index matches...",
    "✓ retrieved 3 primary citations"
  ], // 3-4 log steps of RAG pipeline
  "result": "a high-end concise answer summarizing what was retrieved and processed" // 1-2 sentence technical answer to the query, acting like a live agent response
}
Ensure the output is valid JSON only. Do not wrap in markdown or backticks. Keep the advice deeply technical.`;
        } else if (type === "performance") {
          prompt = `You are an Elite Web Vital Optimizer. Generate a specific optimization tip for the Core Web Vital metric: "${metric || "LCP"}".
Format it STRICTLY as a JSON object with this exact structure:
{
  "command": "optimize --metric=${metric || "LCP"}",
  "trace": [
    "→ scanning critical render paths...",
    "→ detected layout shifts or caching lag...",
    "✓ performance target reached"
  ], // 3-4 steps of profiling and optimizing that metric
  "result": "an elite code tip or optimization suggestion for that metric in Next.js"
}
Ensure the output is valid JSON only. Do not wrap in markdown or backticks. Keep the advice deeply technical.`;
        } else if (type === "project-audit") {
          prompt = `You are an Elite Technical Auditor. Generate an architectural review and technical audit brief for the project titled "${projectTitle || "Enterprise Dashboard"}" in the category "${projectCategory || "SaaS Portal"}".
Format it STRICTLY as a JSON object with this exact structure:
{
  "command": "audit --project=${(projectTitle || "App").toLowerCase().replace(/\s+/g, "-")}",
  "trace": [
    "→ scanning database schemas...",
    "→ analyzing state synchronization...",
    "✓ core engineering architecture verified"
  ], // 3-4 steps of auditing the project
  "result": "an elite technical review explaining how to scale this specific SaaS/App and resolve typical architectural bottlenecks"
}
Ensure the output is valid JSON only. Do not wrap in markdown or backticks. Keep the advice deeply technical.`;
        } else if (type === "db-audit") {
          prompt = `You are an Elite MongoDB Database Architect and Indexing Strategist.
Generate a performance optimization audit and query indexing plan for a database with these current stats:
- Leads Count: ${leadsCount || 13}
- Average Budget: $${averageBudget || 850}
- Query Latency: ${queryExecutionTimeMs || 0.45}ms
- Current Index: budget_1_createdAt_-1

Format it STRICTLY as a JSON object with this exact structure:
{
  "command": "db.leads.explain('executionStats')",
  "trace": [
    "→ analyzing query execution plan...",
    "→ verifying compound index boundaries on { budget: 1, createdAt: -1 }...",
    "✓ index scan (IXSCAN) verified for compound filter"
  ], // 3-4 steps of auditing the database queries/indices
  "result": "the technical database indexing recommendation or aggregation pipeline optimization tips"
}
Ensure the output is valid JSON only. Do not wrap in markdown or backticks. Keep the advice deeply technical.`;
        } else if (type === "scope-audit") {
          prompt = `You are an Elite Systems Architect and Engineering Lead.
Audit this prospective client project scope proposal:
- Client Name: ${name || "Anonymous Client"}
- Proposed Budget: $${budget || 500}
- Scope Details: "${details || "No details provided"}"

Format it STRICTLY as a JSON object with this exact structure:
{
  "command": "analyze --scope-complexity",
  "trace": [
    "→ checking integration requirements...",
    "→ analyzing complexity boundaries...",
    "✓ architecture requirements compiled successfully"
  ],
  "result": "estimated tech stack & architecture suggestion",
  "complexity": "MVP / Core Release" // e.g. "Micro MVP", "Core Product", "Scalable Enterprise"
}
Ensure the output is valid JSON only. Do not wrap in markdown or backticks. Keep the advice deeply technical.`;
        }

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Clean markdown wrapper elements
        const cleanJson = responseText
          .replace(/^```json\s*/i, "")
          .replace(/```$/, "")
          .trim();

        const parsed = JSON.parse(cleanJson);
        if (parsed.command && Array.isArray(parsed.trace) && parsed.result) {
          return NextResponse.json({
            success: true,
            data: parsed,
            offline: false
          });
        }
      } catch (err) {
        console.warn("Gemini SDK error in audit route, using fallbacks", err);
      }
    }

    // Offline fallbacks logic
    let selectedFallback: any;
    if (type === "architecture") {
      selectedFallback = FALLBACKS.architecture;
    } else if (type === "ai-systems") {
      selectedFallback = FALLBACKS["ai-systems"];
    } else if (type === "performance") {
      const metricKey = (metric || "LCP") as keyof typeof FALLBACKS.performance;
      selectedFallback = FALLBACKS.performance[metricKey] || FALLBACKS.performance.LCP;
    } else if (type === "db-audit") {
      selectedFallback = FALLBACKS["db-audit"];
    } else if (type === "scope-audit") {
      selectedFallback = FALLBACKS["scope-audit"];
    } else {
      selectedFallback = FALLBACKS["project-audit"];
    }

    return NextResponse.json({
      success: true,
      data: selectedFallback,
      offline: true
    });

  } catch (error: any) {
    console.error("AI Audit API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}
