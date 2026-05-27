"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Sparkles,
  Code,
  FileText,
  Send,
  Loader2,
  X,
  Play,
  ArrowRight,
  ChevronRight,
  Maximize2,
  CheckCircle,
  HelpCircle,
  Database,
  Cpu,
  Layers,
  Activity,
  Workflow,
  Globe,
  HeartPulse,
  Sprout,
  ArrowUpRight
} from "lucide-react";

export default function Home() {
  // IDE State
  const [selectedFile, setSelectedFile] = useState("nodes.tsx");
  const [consoleOutput, setConsoleOutput] = useState("SYSTEM READY: Listening on port 5000...");

  // Side Sheet Panel Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "system"; text: string; estimation?: any }>>([
    {
      sender: "system",
      text: "Welcome to Kaif Studio Assistant. Describe your project requirements, target stack, or database needs. I will compile a complete, high-end technical architecture blueprint and development hours estimate instantly."
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Work showcase interactive states
  const [activeWorkTab, setActiveWorkTab] = useState<"editor" | "farming">("editor");
  const [activeWorkImageIndex, setActiveWorkImageIndex] = useState(0);

  const workTabs = ["editor", "farming"] as const;
  const handleNextTab = () => {
    const currentIndex = workTabs.indexOf(activeWorkTab);
    const nextIndex = (currentIndex + 1) % workTabs.length;
    setActiveWorkTab(workTabs[nextIndex]);
    setActiveWorkImageIndex(0);
  };
  const handlePrevTab = () => {
    const currentIndex = workTabs.indexOf(activeWorkTab);
    const prevIndex = (currentIndex - 1 + workTabs.length) % workTabs.length;
    setActiveWorkTab(workTabs[prevIndex]);
    setActiveWorkImageIndex(0);
  };

  // Intake Form details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState(800);
  const [details, setDetails] = useState("");
  const [systemConstraints, setSystemConstraints] = useState("No major latency bottlenecks; support high concurrency.");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Reactive Estimator Calculation based on slider & constraints
  const getReactiveEstimate = () => {
    let complexity = "Medium";
    let estHours = 80;
    let stack = ["Next.js", "Tailwind CSS v4", "TypeScript"];
    let dbStrategy = "MongoDB Serverless Caching";
    let apiEngine = "NextJS Route Endpoints";

    if (budget < 400) {
      complexity = "Low";
      estHours = 40;
      stack = ["Next.js (Static Export)", "Tailwind CSS", "TypeScript"];
      dbStrategy = "Local JSON Storage API";
      apiEngine = "Client-Side Fetch Heuristics";
    } else if (budget >= 1000) {
      complexity = "High";
      estHours = 120;
      stack = ["Next.js App Router", "TypeScript", "Vercel AI SDK", "Google Gemini 1.5 Brain"];
      dbStrategy = "MongoDB Atlas Indexed Aggregations";
      apiEngine = "FastAPI SSE Telemetry Stream";
    }

    // Adjust based on project details keywords if any
    const lowerDetails = details.toLowerCase();
    if (lowerDetails.includes("ai") || lowerDetails.includes("agent") || lowerDetails.includes("llm") || lowerDetails.includes("gemini")) {
      complexity = "High";
      if (!stack.includes("Google Gemini 1.5 Brain")) {
        stack.push("Google Gemini 1.5 Brain", "Vercel AI SDK");
      }
    }
    if (lowerDetails.includes("mobile") || lowerDetails.includes("app")) {
      stack.push("React Native", "Expo");
    }

    return { complexity, estHours, stack, dbStrategy, apiEngine };
  };

  const reactiveEstimate = getReactiveEstimate();

  // IDE mock files
  const files: Record<string, { name: string; lang: string; content: string }> = {
    "nodes.tsx": {
      name: "nodes.tsx",
      lang: "TypeScript",
      content: `import { createNode } from "@/lib/engine";\nimport { connectToDatabase } from "@/lib/db";\n\nexport async function initNodeStream() {\n  const db = await connectToDatabase();\n  \n  // Establish telemetry hooks\n  const telemetryNode = createNode({\n    id: "healthcare-ai-node",\n    driver: "gemini-1.5-flash",\n    telemetry: true,\n    onPulse: async (metrics) => {\n      await db.collection("telemetry").insertOne({\n        node: "healthcare",\n        latency: metrics.latency,\n        accuracy: metrics.accuracy,\n        timestamp: new Date()\n      });\n    }\n  });\n\n  return telemetryNode.pulse();\n}`
    },
    "medusa_redis.json": {
      name: "medusa_redis.json",
      lang: "JSON",
      content: `{\n  "service": "redis_medusa",\n  "version": "2.4.1",\n  "cluster": "kaif-dev-agency-cluster",\n  "persistence": "appendonly",\n  "maxmemory": "2gb",\n  "eviction_policy": "allkeys-lru",\n  "active_connections": 24,\n  "cache_hit_ratio": "99.8%"\n}`
    },
    "package.json": {
      name: "package.json",
      lang: "JSON",
      content: `{\n  "name": "kaif-dev-agency",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build",\n    "start": "next start",\n    "ship": "pnpm ship --target=prod"\n  },\n  "dependencies": {\n    "next": "16.2.6",\n    "react": "19.2.4",\n    "mongodb": "^6.3.0",\n    "@google/generative-ai": "^0.21.0"\n  }\n}`
    },
    "README.md": {
      name: "README.md",
      lang: "Markdown",
      content: `# Kaif Studio AI Code Editor\n\nA modern, full-stack systems platform leaning into robust engineering logic, lightning fast data caching, and absolute visual polish.\n\n### Core Palette\n- Base Canvas: #F8F9FA\n- Pitch Black: #000000\n- Secondary Copy: slate-500`
    }
  };

  // Compile Dev Simulation
  const handleRunCompiler = () => {
    setConsoleOutput("COMPILING ROUTES...\nOPTIMIZING BUNDLES...\n✓ BUILD STABLE\n✓ CHECKS: TYPES · LINT · PERF PASSED\nREADY · localhost:5000");
  };

  // Chat/Estimate handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      if (res.ok && data.text) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: data.text
          }
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "system", text: `I encountered an issue compiling a response: ${data.error || "Please try again."}` }
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "system", text: "Connection failed. Please check your network and API configurations." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Intake Form submit
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !details) {
      setFormError("All fields (Name, Email, Phone, Project Details) are required.");
      return;
    }

    setFormSubmitting(true);
    setFormError("");
    setFormSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          budget,
          details: `${details}\n\n[Project Details & Features]: ${systemConstraints}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        // Reset fields
        setName("");
        setEmail("");
        setPhone("");
        setDetails("");
        setSystemConstraints("");
      } else {
        setFormError(data.error || "Intake order failed. Please retry.");
      }
    } catch (err) {
      setFormError("Server error. Please verify your connection.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#1D1D1F] selection:text-white relative">

      {/* 1. Unified Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FBFBFD]/80 backdrop-blur-md border-b border-[#E8E8ED] px-4 sm:px-8 lg:px-16 py-4 md:py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-1.5 group">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1D1D1F]">Kaif Dev Agency</span>
          </a>

          {/* Minimalist text navigation links */}
          <nav className="hidden md:flex items-center space-x-10 text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
            <a href="#capabilities" className="hover:text-[#1D1D1F] transition-colors">Capabilities</a>
            <a href="#work" className="hover:text-[#1D1D1F] transition-colors">Work</a>
            <a href="#expertise" className="hover:text-[#1D1D1F] transition-colors">Studio</a>
            <a href="#intake" className="hover:text-[#1D1D1F] transition-colors">Apply</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Single bold black CTA button (hidden on mobile, inside mobile drawer instead) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="hidden sm:block text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-[#1D1D1F] text-white hover:bg-[#1D1D1F]/90 transition-all shadow-sm"
            >
              Consult Agent ⚡
            </button>

            {/* Hamburger button visible only on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden flex-col gap-1.5 justify-center items-center h-8 w-8 text-[#1D1D1F] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <span className={`h-0.5 w-5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-[5px]" : ""}`}></span>
              <span className={`h-0.5 w-5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
              <span className={`h-0.5 w-5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown Overlay (Premium Full-Screen Sheets Menu) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 h-screen w-screen bg-[#FBFBFD] z-50 flex flex-col p-6 pt-24 gap-6 text-xl font-bold uppercase tracking-wide text-[#1D1D1F] animate-fade-in select-none">
          {/* Header row inside full-screen menu to close */}
          <div className="absolute top-4 right-4 sm:right-8 flex items-center justify-between w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)]">
            <span className="text-lg font-extrabold tracking-tight">Kaif Dev Agency</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-8 w-8 hover:bg-black/5 flex items-center justify-center text-[#1D1D1F] border border-[#E8E8ED] rounded-full"
              aria-label="Close Menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 mt-8">
            <a
              href="#capabilities"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#0071E3] transition-colors border-b border-[#E8E8ED] pb-4"
            >
              Capabilities
            </a>
            <a
              href="#work"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#0071E3] transition-colors border-b border-[#E8E8ED] pb-4"
            >
              Work
            </a>
            <a
              href="#expertise"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#0071E3] transition-colors border-b border-[#E8E8ED] pb-4"
            >
              Studio
            </a>
            <a
              href="#intake"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#0071E3] transition-colors pb-4"
            >
              Apply
            </a>
          </nav>

          <div className="mt-auto pb-12 w-full">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
              className="w-full text-center text-xs font-bold uppercase tracking-widest py-4 bg-[#1D1D1F] text-white hover:bg-[#1D1D1F]/90 transition-all shadow-md rounded-full"
            >
              Consult Agent ⚡
            </button>
          </div>
        </div>
      )}

      {/* Centered Main Layout Container */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 w-full flex flex-col">

        {/* 2. Product-First Hero Section */}
        <section className="text-center py-16 md:py-24 lg:py-32 flex flex-col items-center gap-6 md:gap-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-[#1D1D1F]">
            Premium Product Engineering.
          </h1>

          <p className="text-lg md:text-xl font-normal text-[#6E6E73] max-w-2xl mx-auto leading-relaxed">
            A full-stack systems studio for modern web + AI. We eliminate codebase bloat to deliver blazing-fast, secure, and production-ready digital products. From custom LLM integrations to robust database design, we write the code that powers modern business.
          </p>

          <div className="pt-2">
            <a
              href="https://k-studio-dev.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1D1D1F] text-white font-bold text-xs uppercase tracking-widest px-8 py-4.5 rounded-full hover:bg-[#1D1D1F]/90 transition-all shadow-sm transform hover:scale-105 active:scale-95 duration-200"
            >
              Launch Studio Editor ⚡
              <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
            </a>
          </div>

          {/* Flagship Mockup Asset sitting immediately below hero copy */}
          <div className="w-full max-w-4xl mx-auto my-16 bg-white border border-[#E8E8ED] shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-[380px] sm:h-[480px] rounded-lg relative text-left">
            {/* Title bar controls */}
            <div className="bg-[#FBFBFD] border-b border-[#E8E8ED] px-4 py-3.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-black/10"></div>
                <div className="h-3 w-3 rounded-full bg-black/10"></div>
                <div className="h-3 w-3 rounded-full bg-black/10"></div>
              </div>

              <div className="text-[10px] font-mono tracking-wider uppercase text-[#6E6E73] flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[#6E6E73]" />
                Kaif Studio IDE Mockup
              </div>

              <div className="flex bg-black/5 rounded px-2 py-0.5 text-[9px] font-mono font-bold text-[#6E6E73] uppercase">
                {selectedFile}
              </div>
            </div>

            {/* IDE workspace layout columns */}
            <div className="flex flex-1 overflow-hidden min-h-0">
              {/* File sidebar list */}
              <div className="hidden sm:flex w-48 bg-[#FBFBFD] border-r border-[#E8E8ED] p-4 flex flex-col gap-3 select-none overflow-y-auto">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#6E6E73] px-2">Project files</span>
                <div className="flex flex-col gap-0.5">
                  {Object.keys(files).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setSelectedFile(filename)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs font-mono transition-colors ${selectedFile === filename
                          ? "bg-black/5 font-semibold text-[#1D1D1F]"
                          : "text-[#6E6E73] hover:bg-black/2"
                        }`}
                    >
                      <FileText className="h-3.5 w-3.5 opacity-55" />
                      <span className="truncate">{filename}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code window block */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="bg-[#FBFBFD]/40 border-b border-[#E8E8ED] px-5 py-2.5 flex items-center justify-between text-[10px] text-[#6E6E73] font-mono">
                  <span>src/components/{files[selectedFile].name}</span>

                  {/* File switcher dropdown visible only on mobile screens */}
                  <div className="sm:hidden relative">
                    <select
                      value={selectedFile}
                      onChange={(e) => setSelectedFile(e.target.value)}
                      className="bg-[#FBFBFD] border border-[#E8E8ED] px-2 py-0.5 text-[9px] font-mono font-semibold text-[#6E6E73] rounded-sm outline-none cursor-pointer hover:bg-black/5 active:bg-black/10 transition-colors"
                    >
                      {Object.keys(files).map((filename) => (
                        <option key={filename} value={filename}>
                          {filename}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-[10px] sm:text-[11px] leading-relaxed text-[#1D1D1F] whitespace-pre select-text">
                  {files[selectedFile].content}
                </div>

                {/* Simulated runtime terminal bar */}
                <div className="bg-[#FBFBFD] border-t border-[#E8E8ED] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-[#6E6E73] truncate">
                      {consoleOutput.split("\n")[consoleOutput.split("\n").length - 1]}
                    </span>
                  </div>
                  <button
                    onClick={handleRunCompiler}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold px-4 py-1.5 bg-[#1D1D1F] hover:bg-[#1D1D1F]/90 text-white rounded transition-colors"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    npm run dev
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Capabilities Section */}
        <section id="capabilities" className="py-24 border-t border-[#E8E8ED] flex flex-col gap-12 animate-fade-in">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-2">01 / Capabilities</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1D1D1F] mb-4 sm:mb-6">
              Engineered with modern architectural discipline.
            </h2>
          </div>

          <p className="text-sm md:text-[15px] font-normal text-[#6E6E73] leading-relaxed max-w-2xl">
            We build exclusively with high-performance frameworks, typing system runtime environments, and lightning-fast database structures to ensure your application remains bracingly fast under heavy production traffic.
          </p>

          {/* Clean foundational stack showcase with premium descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 mt-4">
            {[
              {
                name: "Next.js",
                desc: "Architecting secure web applications using React Server Components to reduce bundle sizes. We enforce asynchronous Server Actions with runtime schema validation, localized loading states, and edge-rendered streaming layout routes."
              },
              {
                name: "React 19",
                desc: "Building dynamic interfaces utilizing concurrent rendering UI architecture. We engineer highly optimized client-side hook handlers, clean state boundaries, and modular component presentation layers for fluid interactivity."
              },
              {
                name: "TypeScript",
                desc: "Enforcing absolute static type coverage across the entire data pipeline. We design strictly typed component contracts, comprehensive global interfaces, and strict request validation parameters to catch bugs at compile-time."
              },
              {
                name: "Node.js",
                desc: "Engineering lightweight, high-throughput backend services. We construct modular asynchronous routers, secure JSON Web Token access control middlewares, CORS protection policies, and global operational exception handlers."
              },
              {
                name: "MongoDB",
                desc: "Designing non-relational database models optimized around complex application query shapes. We write durable Mongoose schemas, deploy compound indexing strategies, and construct aggregation pipelines for fast read-write metrics."
              },
              {
                name: "Tailwind v4",
                desc: "Styling production platforms using a utility-first design engine. We maximize CSS performance, eliminate redundant design tokens, and deliver fully responsive layouts that load instantly on all modern device viewports."
              }
            ].map((tech) => (
              <div key={tech.name} className="flex flex-col gap-2">
                <span className="text-lg font-bold tracking-tight text-[#1D1D1F]">{tech.name}</span>
                <span className="text-sm md:text-[15px] text-[#6E6E73] leading-relaxed font-normal">{tech.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Expertise Section */}
        <section id="expertise" className="py-24 border-t border-[#E8E8ED] flex flex-col gap-12 animate-fade-in">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-2">02 / Expertise</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1D1D1F] mb-4 sm:mb-6">
              Multi-disciplinary technical logic.
            </h2>
          </div>

          {/* Borderless spacious grid columns detailing strengths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-4">
            <div className="flex flex-col gap-3">
              <div className="h-8 w-8 bg-[#1D1D1F]/5 rounded flex items-center justify-center text-[#1D1D1F] mb-1">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F] mb-2">Custom AI Integrations</h3>
              <p className="text-sm md:text-[15px] font-normal text-[#6E6E73] leading-relaxed">
                Supercharge your workflows with intelligent automation. We build custom serverless vector pipelines, low-latency streaming LLM chat structures, and highly specialized RAG (Retrieval-Augmented Generation) systems using enterprise models. Turn unstructured data into active business assets instantly.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-8 w-8 bg-[#1D1D1F]/5 rounded flex items-center justify-center text-[#1D1D1F] mb-1">
                <Code className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F] mb-2">Full-Stack Engineering</h3>
              <p className="text-sm md:text-[15px] font-normal text-[#6E6E73] leading-relaxed">
                Maintainable architectures are non-negotiable. Every repository we deliver conforms to strict ESLint parameters, clean module segregation, and rigorous separation of API routes from presentation logic. The codebase you receive is a stable infrastructure built to scale seamlessly.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-8 w-8 bg-[#1D1D1F]/5 rounded flex items-center justify-center text-[#1D1D1F] mb-1">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F] mb-2">Performance Optimization</h3>
              <p className="text-sm md:text-[15px] font-normal text-[#6E6E73] leading-relaxed">
                Performance directly dictates user retention, conversion rates, and organic SEO ranking. We deploy highly optimized, server-rendered production bundles designed to maintain flawless core web vitals, sub-100ms database response metrics, and fluid client-side navigation.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Process Section */}
        <section id="process" className="py-24 border-t border-[#E8E8ED] flex flex-col gap-12 animate-fade-in">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-2">03 / Process</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1D1D1F] mb-4 sm:mb-6">
              Disciplined delivery method.
            </h2>
          </div>

          {/* Flat horizontal timeline connected by simple lines and dots */}
          <div className="relative flex flex-col md:flex-row items-start justify-between gap-8 mt-12 pl-4 md:pl-0">
            {/* Horizontal line for desktop connecting the nodes */}
            <div className="hidden md:block absolute top-[9px] left-2.5 right-[25%] h-[2.5px] bg-[#E8E8ED] z-0"></div>

            {[
              { label: "Concept", step: "Phase 01 // Concept", desc: "System constraints mapping, schema definition, and concrete technical specification blueprinting." },
              { label: "Design", step: "Phase 02 // Design", desc: "High-fidelity interactive UI wireframing, component token planning, and visual engineering alignment." },
              { label: "Code", step: "Phase 03 // Code", desc: "Test-driven development loops, strictly typed code modules, and daily staging git deployments." },
              { label: "Ship", step: "Phase 04 // Ship", desc: "Production edge pipeline compilation, performance stress-testing, and automated gateway tracking." }
            ].map((node, index) => (
              <div key={node.label} className={`flex-1 flex flex-col gap-2 items-start relative w-full ${index === 3 ? "border-l-2 border-transparent pb-0" : "border-l-2 border-[#E8E8ED] pb-8"} md:border-l-0 pl-6 md:pl-0 md:pb-0`}>
                {/* Visual step bullet dot on mobile timeline */}
                <div className="md:hidden absolute -left-[7px] top-[4px] h-3 w-3 rounded-full bg-[#1D1D1F] border-2 border-white"></div>

                {/* Visual step bullet dot on desktop timeline */}
                <div className="hidden md:flex items-center justify-start mb-4 relative z-10">
                  <div className="h-5 w-5 rounded-full bg-white border-2 border-[#1D1D1F] flex items-center justify-center transition-transform duration-300 hover:scale-125 cursor-pointer shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#1D1D1F]"></span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#6E6E73]">
                    {node.step.split(" // ")[0]}
                  </span>
                </div>
                <h4 className="text-lg font-bold tracking-tight text-[#1D1D1F]">{node.label}</h4>
                <p className="text-sm md:text-[15px] font-normal text-[#6E6E73] leading-relaxed mt-2 pr-4">{node.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Work Section (Flagship Showcase) */}
        <section id="work" className="py-24 border-t border-[#E8E8ED] flex flex-col gap-12 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#E8E8ED]">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-2">04 / Featured Work</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
                Production-grade software products.
              </h2>
            </div>

            {/* Premium Segmented Capsule Switcher */}
            <div className="bg-[#F5F5F7] p-1 rounded-full flex gap-1 border border-[#E8E8ED] w-full max-w-[280px] self-start md:self-end">
              <button
                onClick={() => {
                  setActiveWorkTab("editor");
                  setActiveWorkImageIndex(0);
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 flex-1 text-center ${activeWorkTab === "editor"
                    ? "bg-white text-[#1D1D1F] shadow-xs"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
              >
                AI Code Editor
              </button>
              <button
                onClick={() => {
                  setActiveWorkTab("farming");
                  setActiveWorkImageIndex(0);
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 flex-1 text-center ${activeWorkTab === "farming"
                    ? "bg-white text-[#1D1D1F] shadow-xs"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
              >
                Smart Farming
              </button>
            </div>
          </div>

          {/* Dynamic Project Details & Screenshot showcases using public folder assets */}
          <div className="mt-4 flex flex-col gap-8 w-full bg-transparent border-0 p-0">

            {activeWorkTab === "farming" && (
              <div className="flex flex-col items-center text-center w-full">
                {/* Product details top centered */}
                <div className="flex flex-col items-center max-w-3xl mb-8">
                  <span className="text-[11px] font-mono font-bold text-[#0066CC] tracking-wider uppercase mb-2">
                    FULL-STACK • IoT DATA PLATFORM
                  </span>
                  <a
                    href="https://smart-farming-lac.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] tracking-tight group-hover:text-[#0071E3] transition-colors mb-3">
                      Smart Farming Telemetry ➔
                    </h3>
                  </a>
                  <p className="text-sm md:text-[15px] font-normal text-[#6E6E73] leading-relaxed max-w-2xl">
                    A high-performance time-series dashboard for microclimate and automated irrigation management. Built with optimized aggregation pipelines to handle heavy sensor write metrics alongside seamless read latency.
                  </p>

                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-mono font-bold text-[#8E8E93] uppercase mt-4">
                    <span>FastAPI</span>
                    <span className="text-[#E8E8ED] font-sans font-normal">|</span>
                    <span>IoT Sensors</span>
                    <span className="text-[#E8E8ED] font-sans font-normal">|</span>
                    <span>MongoDB Caching</span>
                  </div>
                </div>

                {/* Centered screen mockup container (uncropped, natural sizing) */}
                <a
                  href="https://smart-farming-lac.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-white shadow-[0_24px_50px_rgba(0,0,0,0.08)] border border-[#E8E8ED] transition-transform duration-500 hover:scale-[1.005] block"
                >
                  <div className="relative w-full h-auto aspect-[16/10] bg-[#FBFBFD]">
                    <img
                      src={activeWorkImageIndex === 0 ? "/ai-farming-1.png" : "/ai-farming-2.png"}
                      alt="Smart Farming Telemetry Mockup"
                      className="w-full h-full object-contain"
                    />

                    {/* Absolute arrow overlays inside image container frame */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveWorkImageIndex((prev) => (prev === 0 ? 1 : 0));
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/60 hover:bg-black/85 text-white rounded-full flex items-center justify-center font-mono font-bold transition-all z-10 shadow-sm"
                      aria-label="Previous Image"
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveWorkImageIndex((prev) => (prev === 0 ? 1 : 0));
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/60 hover:bg-black/85 text-white rounded-full flex items-center justify-center font-mono font-bold transition-all z-10 shadow-sm"
                      aria-label="Next Image"
                    >
                      →
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      <button
                        onClick={() => setActiveWorkImageIndex(0)}
                        className={`h-1.5 w-1.5 rounded-full ${activeWorkImageIndex === 0 ? "bg-white" : "bg-white/40"
                          }`}
                      />
                      <button
                        onClick={() => setActiveWorkImageIndex(1)}
                        className={`h-1.5 w-1.5 rounded-full ${activeWorkImageIndex === 1 ? "bg-white" : "bg-white/40"
                          }`}
                      />
                    </div>
                  </div>
                </a>
              </div>
            )}

            {activeWorkTab === "editor" && (
              <div className="flex flex-col items-center text-center w-full">
                {/* Product details top centered */}
                <div className="flex flex-col items-center max-w-3xl mb-8">
                  <span className="text-[11px] font-mono font-bold text-[#0066CC] tracking-wider uppercase mb-2">
                    SAAS DEVELOPER TOOL • SANDBOX EXECUTION
                  </span>
                  <a
                    href="https://https://k-studio-dev.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] tracking-tight group-hover:text-[#0071E3] transition-colors mb-3">
                      AI-Assisted Web IDE ➔
                    </h3>
                  </a>
                  <p className="text-sm md:text-[15px] font-normal text-[#6E6E73] leading-relaxed max-w-2xl">
                    A secure browser-based code editing platform featuring isolated iframe script execution, context-aware AI refactoring prompt streams, and an instantaneous postMessage state bridge.
                  </p>

                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-mono font-bold text-[#8E8E93] uppercase mt-4">
                    <span>Next.js 16</span>
                    <span className="text-[#E8E8ED] font-sans font-normal">|</span>
                    <span>TypeScript</span>
                    <span className="text-[#E8E8ED] font-sans font-normal">|</span>
                    <span>Gemini AI</span>
                  </div>
                </div>

                {/* Centered screen mockup container (uncropped, natural sizing) */}
                <a
                  href="https://https://k-studio-dev.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-white shadow-[0_24px_50px_rgba(0,0,0,0.08)] border border-[#E8E8ED] transition-transform duration-500 hover:scale-[1.005] block"
                >
                  <div className="relative w-full h-auto aspect-[16/10] bg-[#FBFBFD]">
                    <img
                      src={activeWorkImageIndex === 0 ? "/ai-code-editor-1.png" : "/ai-code-editor2.png"}
                      alt="AI Code Editor Sandbox Mockup"
                      className="w-full h-full object-contain"
                    />

                    {/* Absolute arrow overlays inside image container frame */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveWorkImageIndex((prev) => (prev === 0 ? 1 : 0));
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/60 hover:bg-black/85 text-white rounded-full flex items-center justify-center font-mono font-bold transition-all z-10 shadow-sm"
                      aria-label="Previous Image"
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveWorkImageIndex((prev) => (prev === 0 ? 1 : 0));
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/60 hover:bg-black/85 text-white rounded-full flex items-center justify-center font-mono font-bold transition-all z-10 shadow-sm"
                      aria-label="Next Image"
                    >
                      →
                    </button>

                    {/* Double-screenshot pagination subdots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      <button
                        onClick={() => setActiveWorkImageIndex(0)}
                        className={`h-1.5 w-1.5 rounded-full ${activeWorkImageIndex === 0 ? "bg-white" : "bg-white/40"
                          }`}
                      />
                      <button
                        onClick={() => setActiveWorkImageIndex(1)}
                        className={`h-1.5 w-1.5 rounded-full ${activeWorkImageIndex === 1 ? "bg-white" : "bg-white/40"
                          }`}
                      />
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Sub-Header Assistant Dock Layout Link */}
          <div className="mt-4 flex justify-center w-full my-12">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2.5 font-mono text-xs font-bold text-[#6E6E73] hover:text-[#1D1D1F] tracking-wide border-b border-dashed border-[#E8E8ED] hover:border-[#1D1D1F] pb-1.5 transition-all duration-300 animate-pulse"
            >
              Studio Assistant Online | Consult Interactive Agent ➔
            </button>
          </div>
        </section>

        {/* 7. Intake Form Section */}
        <section id="intake" className="py-24 border-t border-[#E8E8ED] flex flex-col gap-12 animate-fade-in">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-2">05 / Start Engine</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1D1D1F] mb-4 sm:mb-6">
              Launch your system intake order.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-stretch mt-4">

            {/* Elegant Form Left Column */}
            <div className="md:col-span-7 min-h-[520px] flex flex-col justify-between p-6 sm:p-8 bg-white border border-[#E8E8ED] rounded-lg">
              {formSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-12 h-full my-auto">
                  <div className="h-12 w-12 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#1D1D1F]">Intake Successfully Submitted!</h4>
                  <p className="text-xs text-[#6E6E73] max-w-xs mt-2 leading-relaxed font-mono">
                    CLIENT BLUEPRINT STORED ON MONGODB ATLAS AND DELIVERED VIA RESEND MAIL.
                  </p>
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="text-xs font-bold uppercase tracking-wider px-6 py-2.5 bg-[#1D1D1F] text-white hover:bg-[#1D1D1F]/90 transition-colors mt-6"
                  >
                    Submit another spec
                  </button>
                </div>
              ) : (
                <form onSubmit={handleIntakeSubmit} className="flex flex-col gap-6 justify-between h-full w-full">
                  <div className="flex flex-col gap-5">
                    {/* Name, Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="client-name" className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest">
                          Name / Entity
                        </label>
                        <input
                          id="client-name"
                          type="text"
                          placeholder="e.g., John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-[#FBFBFD] hover:bg-black/2 border border-[#E8E8ED] p-3 text-sm md:text-[15px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono text-black"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="client-email" className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest">
                          Email Coordinates
                        </label>
                        <input
                          id="client-email"
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-[#FBFBFD] hover:bg-black/2 border border-[#E8E8ED] p-3 text-sm md:text-[15px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono text-black"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="client-phone" className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest">
                          Phone Coordinates
                        </label>
                        <input
                          id="client-phone"
                          type="tel"
                          placeholder="WhatsApp / Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="bg-[#FBFBFD] hover:bg-black/2 border border-[#E8E8ED] p-3 text-sm md:text-[15px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono text-black"
                        />
                      </div>
                    </div>

                    {/* Dynamic Range Budget Slider */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest">
                          Estimated Allocation
                        </span>
                        <span className="text-xs font-extrabold bg-[#1D1D1F] text-white px-3 py-1 font-mono">
                          ${budget.toLocaleString()} USD
                        </span>
                      </div>
                      <input
                        id="budget-slider"
                        type="range"
                        min="100"
                        max="1500"
                        step="50"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full cursor-pointer accent-[#1D1D1F]"
                      />
                      <div className="flex justify-between text-[9px] text-[#6E6E73] font-mono font-bold">
                        <span>$100</span>
                        <span>$800</span>
                        <span>$1,500</span>
                      </div>
                    </div>

                    {/* Project Details & Features */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="client-constraints" className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest">
                        Project Details & Features
                      </label>
                      <input
                        id="client-constraints"
                        type="text"
                        placeholder="e.g. Real-time chat, payment gateway, dark mode, or mobile responsive viewports."
                        value={systemConstraints}
                        onChange={(e) => setSystemConstraints(e.target.value)}
                        className="bg-[#FBFBFD] hover:bg-black/2 border border-[#E8E8ED] p-3 text-sm md:text-[15px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono text-black"
                      />
                    </div>

                    {/* Details Project Requirements */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="project-details" className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest">
                        Project Specifications
                      </label>
                      <textarea
                        id="project-details"
                        rows={4}
                        placeholder="Tell us about your project idea. What core features do you need? Do you have a specific deadline or target delivery timeline?"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        required
                        className="bg-[#FBFBFD] hover:bg-black/2 border border-[#E8E8ED] p-3 text-sm md:text-[15px] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono resize-none leading-relaxed text-black"
                      ></textarea>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex flex-col gap-3 mt-4">
                    {formError && (
                      <p className="text-xs font-semibold text-red-600 border border-red-100 bg-red-50 p-3 font-mono">
                        {formError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1D1D1F] hover:bg-[#1D1D1F]/95 text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 shadow-sm mt-2"
                    >
                      {formSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : (
                        <Send className="h-4 w-4 text-white" />
                      )}
                      DISPATCH SYSTEM INTAKE ➔
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Reactive AI Scope Estimator Panel Right Column */}
            <div className="md:col-span-5 min-h-[520px] flex flex-col justify-between p-6 sm:p-8 bg-white border border-[#E8E8ED] rounded-lg">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-[#E8E8ED] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#1D1D1F]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F]">
                      Live Analysis Summary
                    </h3>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>

                <div className="bg-[#FBFBFD] border border-[#E8E8ED] p-3 text-sm md:text-[15px] font-medium text-[#6E6E73] leading-relaxed font-mono">
                  Estimator online. Describe your project requirements in the text area to calibrate the project scope, development timeline, and tech setup recommendations in real time.
                </div>

                {/* Outputs */}
                <div className="flex flex-col gap-3 mt-2">
                  <div className="bg-[#FBFBFD] border border-[#E8E8ED] p-3 flex flex-col">
                    <span className="text-[9px] font-mono text-[#6E6E73] uppercase font-bold">Project Scope</span>
                    <span className="text-sm font-bold text-[#1D1D1F] mt-1 font-mono uppercase">
                      {reactiveEstimate.complexity}
                    </span>
                  </div>

                  <div className="bg-[#FBFBFD] border border-[#E8E8ED] p-3 flex flex-col">
                    <span className="text-[9px] font-mono text-[#6E6E73] uppercase font-bold">Development Timeline</span>
                    <span className="text-sm font-bold text-[#1D1D1F] mt-1 font-mono">
                      ~{reactiveEstimate.estHours} hrs ({Math.ceil(reactiveEstimate.estHours / 20)} weeks)
                    </span>
                  </div>

                  <div className="bg-[#FBFBFD] border border-[#E8E8ED] p-3 flex flex-col">
                    <span className="text-[9px] font-mono text-[#6E6E73] uppercase font-bold">Recommended Tech Setup</span>
                    <span className="text-xs font-bold text-[#1D1D1F] mt-1 font-mono">
                      {reactiveEstimate.apiEngine}
                    </span>
                  </div>

                  <div className="bg-[#FBFBFD] border border-[#E8E8ED] p-3 flex flex-col">
                    <span className="text-[9px] font-mono text-[#6E6E73] uppercase font-bold">Database Strategy</span>
                    <span className="text-xs font-bold text-[#1D1D1F] mt-1 font-mono">
                      {reactiveEstimate.dbStrategy}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-4 border-t border-[#E8E8ED]">
                <span className="text-[9px] font-mono text-[#6E6E73] uppercase font-bold">Recommended Architecture:</span>
                <div className="flex flex-wrap gap-1">
                  {reactiveEstimate.stack.map((tech) => (
                    <span key={tech} className="bg-[#1D1D1F] text-white text-[9px] font-mono px-2 py-0.5">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer block */}
      <footer className="border-t border-[#E8E8ED] py-12 px-4 sm:px-8 lg:px-16 bg-[#FBFBFD]/50 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1D1D1F]">Kaif Dev Agency</span>
            <span className="text-xs text-[#6E6E73] font-mono">· Clean Apple Architecture</span>
          </div>

          <div className="flex gap-8 text-xs text-[#6E6E73] font-semibold">
            <span>© 2026 Kaif. All rights reserved.</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Side sheet drawer overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 8. Zero-Rounded Corner Side Sheet Panel Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white border-l border-[#1D1D1F] z-50 flex flex-col shadow-2xl drawer-transition rounded-none ${isDrawerOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
      >
        {/* Drawer header */}
        <div className="px-6 py-5 border-b border-[#E8E8ED] flex items-center justify-between bg-[#FBFBFD]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-[#1D1D1F]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1D1D1F]">
              Studio Assistant Drawer
            </h3>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="h-8 w-8 hover:bg-black/5 flex items-center justify-center text-[#1D1D1F] border border-[#E8E8ED]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Chat log stream */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#FBFBFD]/30">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
            >
              <div
                className={`p-4 text-xs leading-relaxed font-normal rounded-2xl ${msg.sender === "user"
                    ? "bg-[#1D1D1F] text-white font-medium rounded-tr-none"
                    : "bg-white border border-[#E8E8ED] text-[#1D1D1F] shadow-xs rounded-tl-none"
                  }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Dynamic scopes estimated in side chat bubble */}
                {msg.estimation && msg.estimation.estimatedHours > 0 && (
                  <div className="mt-4 border-t border-[#E8E8ED] pt-4 flex flex-col gap-4 text-[#1D1D1F]">
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="bg-black/5 p-2 border border-[#E8E8ED]">
                        <span className="text-[#6E6E73] block uppercase">Complexity</span>
                        <strong className="text-xs">{msg.estimation.complexity}</strong>
                      </div>
                      <div className="bg-black/5 p-2 border border-[#E8E8ED]">
                        <span className="text-[#6E6E73] block uppercase">Total Hours</span>
                        <strong className="text-xs">{msg.estimation.estimatedHours} hrs</strong>
                      </div>
                    </div>

                    {msg.estimation.breakdown && (
                      <div className="flex flex-col gap-1 text-[10px]">
                        <span className="font-bold text-[#6E6E73] uppercase">Phase Hours:</span>
                        <div className="flex gap-2">
                          <span className="bg-black/5 px-2 py-0.5">Planning: {msg.estimation.breakdown.planning}h</span>
                          <span className="bg-black/5 px-2 py-0.5">Coding: {msg.estimation.breakdown.coding}h</span>
                        </div>
                      </div>
                    )}

                    {msg.estimation.suggestedStack && (
                      <div className="flex flex-col gap-1 text-[10px]">
                        <span className="font-bold text-[#6E6E73] uppercase">Stack Suggestions:</span>
                        <div className="flex flex-wrap gap-1">
                          {msg.estimation.suggestedStack.map((tech: string) => (
                            <span key={tech} className="bg-[#1D1D1F] text-white px-2 py-0.5 text-[9px] font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.estimation.suggestions && (
                      <div className="flex flex-col gap-1 text-[10px]">
                        <span className="font-bold text-[#6E6E73] uppercase">Recommendations:</span>
                        <ul className="list-disc pl-4 text-[#6E6E73] flex flex-col gap-0.5">
                          {msg.estimation.suggestions.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[9px] font-mono text-[#6E6E73] mt-1 uppercase tracking-wider">
                {msg.sender === "user" ? "Client Spec" : "Studio Brain"}
              </span>
            </div>
          ))}

          {/* Loading status */}
          {chatLoading && (
            <div className="self-start flex items-center gap-2 text-xs font-mono text-[#6E6E73] bg-white border border-[#E8E8ED] px-4 py-2.5 shadow-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1D1D1F]" />
              <span>Analyzing layout specs...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Drawer footer input and proposal intake */}
        <div className="border-t border-[#1D1D1F] p-5 flex flex-col gap-4 bg-white">
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type specs (e.g. build an ecommerce app)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              className="flex-1 bg-[#FBFBFD] border border-[#E8E8ED] px-4 py-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/20 transition-all font-mono text-[#1D1D1F]"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="h-10 w-10 bg-[#1D1D1F] hover:bg-[#1D1D1F]/90 text-white flex items-center justify-center disabled:opacity-40 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Quick-submit intake inside assistant drawer */}
          <div className="border-t border-[#E8E8ED] pt-3">
            <div className="flex items-center justify-between text-[9px] font-mono text-[#6E6E73] font-bold uppercase tracking-widest mb-2">
              <span>Lock Project Order</span>
            </div>

            <a
              href="#intake"
              onClick={() => setIsDrawerOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1D1D1F] hover:bg-[#1D1D1F]/90 text-white font-bold text-xs uppercase tracking-widest transition-colors text-center"
            >
              Go to Intake Form ➔
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
