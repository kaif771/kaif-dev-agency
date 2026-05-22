import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid payload: messages must be a valid array." },
        { status: 400 }
      );
    }

    const latestMessageText = messages[messages.length - 1]?.text || "";
    const cleanText = latestMessageText.trim().toLowerCase().replace(/[?.,!]/g, "");

    const isWhoIsKaif = 
      cleanText === "who is kaif" || 
      cleanText === "tell me about the developer" || 
      cleanText === "who built this";

    if (isWhoIsKaif) {
      return NextResponse.json({
        success: true,
        reply: "Kaif is the lead Full-Stack Engineer and architect behind Kaif Dev Agency. Operating from Maharashtra, India, he pairs a formal BCA background with extensive hands-on expertise in Next.js, TypeScript, Tailwind CSS, and MongoDB. He specializes in turning complex business ideas into high-converting MVPs, autonomous AI tools, and enterprise-grade web applications with blistering delivery speeds."
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API Key is configured, make the live shoot
    if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        
        // Setup system prompt instructing the virtual assistant
        const systemInstruction = `You are the virtual assistant for Kaif Dev Agency. Your job is to answer questions about Kaif's tech stack, background, and services in a professional, brief, and highly encouraging manner.
        - Kaif Biography: Kaif is the lead Full-Stack Engineer and architect behind Kaif Dev Agency. Operating from Maharashtra, India, he pairs a formal BCA background with extensive hands-on expertise in Next.js, TypeScript, Tailwind CSS, and MongoDB. He specializes in turning complex business ideas into high-converting MVPs, autonomous AI tools, and enterprise-grade web applications with blistering delivery speeds.
        - Tech Stack: Elite full-stack systems architect & AI systems engineer (React, NodeJS, Next.js App Router, Express, MongoDB, TS, OpenAI API, Google Gemini, Custom RAG, Vector DBs, LangChain).
        - Services: High-performance web development, custom AI integrations, optimized database schemas, and robust automation pipelines.
        - Active Availability: Currently available for 2 new projects starting in May 2026.
        - Pricing: Cap-based fixed milestones, customized on video strategy calls.
        - Portfolio Projects: Healthcare AI Assistant, Smart Farming Application (live at https://smart-farming-lac.vercel.app/), and AI-Powered Full-Stack Editor (live at https://google-ai-mocha.vercel.app/).
        Keep responses highly concise (under 3-4 sentences where possible), technical yet user-friendly, and maintain a cyberpunk developer tone. Do not use markdown headers (# or ##), stick to bold/lists/bullets.`;

        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash", // stable, fast, low-latency successor model
          systemInstruction: systemInstruction,
        });

        // Convert messages to Gemini history format (excluding the very last prompt message)
        // Strictly filter to ensure it starts with a "user" role and alternates roles strictly
        const historyMessages = messages.slice(0, -1);
        const geminiHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];

        for (const msg of historyMessages) {
          const role = msg.sender === "user" ? "user" : "model";

          // Gemini requires the history to start with a "user" message
          if (geminiHistory.length === 0 && role !== "user") {
            continue;
          }

          // Gemini requires strict alternating turn roles (user -> model -> user -> model)
          if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === role) {
            continue;
          }

          geminiHistory.push({
            role: role,
            parts: [{ text: msg.text }],
          });
        }

        const latestMessageText = messages[messages.length - 1]?.text || "Hello";

        // Start chat session with history
        const chat = model.startChat({
          history: geminiHistory,
        });

        const result = await chat.sendMessage(latestMessageText);
        const responseText = result.response.text();

        return NextResponse.json({
          success: true,
          reply: responseText,
        });
      } catch (err: unknown) {
        console.error("Gemini SDK Execution Error:", err);
        // Fallback to mock response below if API fails
      }
    }

    // 2. Fallback matching logic on server side if Gemini key is absent
    const userQuery = messages[messages.length - 1]?.text || "";
    const lowerText = userQuery.toLowerCase();
    
    let reply = "I am the Kaif Dev Virtual Assistant. We build ultra-high performance MERN & Next.js systems and integrated AI chatbots. Fill out the Strategy Intake Form on the page to book a video session with Kaif!";

    if (lowerText.includes("stack") || lowerText.includes("tech") || lowerText.includes("technology")) {
      reply = "Kaif Dev Agency engineers on the MERN and Next.js Ecosystem: React, NodeJS, Express, MongoDB, TypeScript, and Tailwind CSS. We ensure complete modular compliance, zero redundant codebases, and high performance.";
    } else if (lowerText.includes("ai") || lowerText.includes("rag") || lowerText.includes("llm") || lowerText.includes("gemini") || lowerText.includes("google")) {
      reply = "Our AI integrations are custom-engineered. We deploy customized RAG (Retrieval-Augmented Generation) architectures, Google Gemini API, OpenAI APIs, vector databases (Pinecone/Chroma), and custom agents.";
    } else if (lowerText.includes("avail") || lowerText.includes("open") || lowerText.includes("free")) {
      reply = "Yes, we are actively taking on new work! We have 2 development slots open starting in May 2026. Fill out the contact form with your specs and budget to book a deep-dive strategy call.";
    }

    return NextResponse.json({
      success: true,
      mocked: true,
      reply
    });

  } catch (error: unknown) {
    console.error("Chat Serverless Route Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Internal Server Error: ${message}` },
      { status: 500 }
    );
  }
}
