import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Check if the provided key is a placeholder dummy or undefined
const isPlaceholderKey = !apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey === "";

function getHeuristicEstimate(details: string, budget: number) {
  const keywords = details.toLowerCase();
  let complexity = "Medium";
  let suggestedStack = ["Next.js", "Tailwind CSS v4", "TypeScript"];
  let estimatedHours = 80;
  let dbStrategy = "MongoDB Serverless Caching";
  let apiEngine = "NextJS Route Endpoints";
  let suggestions = [
    "Integrate dynamic context states using concurrent rendering handlers.",
    "Implement client-side data boundaries to control schema payload structures.",
    "Scale database collections using indexed MongoDB Atlas aggregates."
  ];
  let summary = `Based on your description, we recommend a **${complexity}** development cycle using a custom Next.js system.\n- Suggested Hours: ~${estimatedHours} hrs\n- Recommended Stack: ${suggestedStack.join(", ")}`;

  // Handle conversational questions about Kaif
  if (keywords.includes("kaif") || keywords.includes("owner")) {
    complexity = "Low";
    estimatedHours = 0;
    suggestedStack = ["Next.js", "React 19", "TypeScript", "Node.js", "MongoDB", "Tailwind v4"];
    dbStrategy = "No Database Required";
    apiEngine = "Conversational AI Interface";
    suggestions = [
      "Ask me to estimate a custom AI or database system for your company.",
      "Explore the capabilities section to learn about our engineering discipline.",
      "Schedule a consultation or fill out the intake form to launch your project."
    ];
    summary = "Hi there! I am Kaif's personal Studio Assistant. Mohammad Kaif is the founder and elite lead systems engineer behind Kaif Dev Agency. He is a full-stack visionary who crafts ultra-premium, high-performance web + AI systems. How can I help connect you with Kaif or plan your next custom build today?";
  }
  // Handle conversational questions about Tech Stack
  else if (keywords.includes("stack") || keywords.includes("tech") || keywords.includes("website")) {
    complexity = "Low";
    estimatedHours = 0;
    suggestedStack = ["Next.js", "React 19", "TypeScript", "Node.js", "MongoDB", "Tailwind v4"];
    dbStrategy = "MongoDB Serverless Schemas";
    apiEngine = "NextJS App Router API";
    suggestions = [
      "Explore our Capabilities section to see what each stack component delivers.",
      "Ask me how we optimize MongoDB compound indices for fast telemetry read-write metrics."
    ];
    summary = "Kaif Dev Agency is built exclusively upon an ultra-premium, modern full-stack: Next.js App Router (SSR & Server Actions), React 19 concurrent UI rendering, TypeScript compile-time type safety, Node.js asynchronous backend routing, MongoDB Serverless database architecture, and Tailwind CSS v4 performance styling. We write zero-bloat, production-ready systems!";
  }
  // Handle general AI or project words
  else if (keywords.includes("ai") || keywords.includes("gpt") || keywords.includes("gemini") || keywords.includes("llm") || keywords.includes("agent")) {
    complexity = "High";
    suggestedStack.push("Google Gemini 1.5 Brain", "Vercel AI SDK");
    estimatedHours = 120;
    dbStrategy = "MongoDB Atlas Indexed Aggregations";
    apiEngine = "FastAPI SSE Telemetry Stream";
    suggestions.unshift("Enforce streaming layout endpoints using edge-rendered streaming routes.");
  } else if (keywords.includes("simple") || keywords.includes("static") || keywords.includes("portfolio")) {
    complexity = "Low";
    estimatedHours = 40;
    dbStrategy = "Local JSON Storage API";
    apiEngine = "Client-Side Fetch Heuristics";
  }

  if (keywords.includes("mobile") || keywords.includes("app") && !keywords.includes("kaif") && !keywords.includes("stack")) {
    suggestedStack.push("React Native", "Expo");
  }

  return {
    success: true,
    complexity,
    suggestedStack,
    estimatedHours,
    dbStrategy,
    apiEngine,
    breakdown: {
      planning: Math.round(estimatedHours * 0.15),
      design: Math.round(estimatedHours * 0.20),
      coding: Math.round(estimatedHours * 0.50),
      ship: Math.round(estimatedHours * 0.15)
    },
    suggestions,
    fallbackMode: true,
    summary
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { details, budget } = body;

    if (!details) {
      return NextResponse.json(
        { error: "Project description is required to estimate scope." },
        { status: 400 }
      );
    }

    if (isPlaceholderKey) {
      console.warn("GEMINI_API_KEY is not defined or using a placeholder. Bypassing active Gemini API to use heuristic estimator.");
      return NextResponse.json(getHeuristicEstimate(details, budget));
    }

    try {
      // Initialize Gemini AI with active key
      const ai = new GoogleGenerativeAI(apiKey!);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are "Kaif's Studio Assistant", a high-end personal AI systems architect built by Kaif Dev Agency.
        You are speaking directly to a prospective client in a warm, premium, conversational Apple-style voice.
        
        Important Studio Knowledge:
        - Owner: Mohammad Kaif (often referred to simply as "Kaif"), a brilliant full-stack systems engineer and founder of Kaif Dev Agency. If asked who Kaif is or who your owner is, introduce him with pride, warmth, and high regard as the lead engineer and founder.
        - Tech Stack of this Website: Built using Next.js App Router, React 19 (Concurrent UI), Node.js, MongoDB, TypeScript, and Tailwind CSS v4. If asked about your tech stack, outline these exact technologies.
        - Your Role: You help clients scope projects, estimate timelines, recommend architecture setups, and consult on their digital product ideas.
        
        User Query:
        "${details}"
        
        Target Budget:
        $${budget || "Not Specified"} USD
        
        Analyze the query. If the query is conversational (e.g. greeting you, asking about Kaif, asking about the website's tech stack, or asking who you are), respond directly to their question in the "summary" field with a highly personalized, warm, and professional conversational response. Speak like a real person talking directly to another person.
        
        You MUST respond ONLY with a valid JSON object matching the schema below. No other text or markdown wrappers besides raw JSON.
        
        Schema:
        {
          "complexity": "Low" | "Medium" | "High",
          "suggestedStack": ["Tech1", "Tech2", ...],
          "estimatedHours": number,
          "dbStrategy": string,
          "apiEngine": string,
          "breakdown": {
            "planning": number (hours),
            "design": number (hours),
            "coding": number (hours),
            "ship": number (hours)
          },
          "suggestions": ["Suggestion 1", "Suggestion 2", ...],
          "summary": "Your warm, highly personal and conversational response. Address the user directly, answer any questions (like who Kaif is or what the tech stack is) elegantly, or summarize the software project plan in an elite, premium personal tone."
        }
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      const responseText = result.response.text();
      const parsedData = JSON.parse(responseText);

      return NextResponse.json({
        success: true,
        ...parsedData,
        fallbackMode: false
      });
    } catch (apiErr: any) {
      console.warn("Gemini AI API call failed, falling back to local heuristic:", apiErr.message || apiErr);
      return NextResponse.json(getHeuristicEstimate(details, budget));
    }

  } catch (err: any) {
    console.error("Gemini AI API Estimator Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze project scope with Gemini AI" },
      { status: 500 }
    );
  }
}
