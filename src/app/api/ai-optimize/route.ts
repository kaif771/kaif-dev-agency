import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const PERFORMANCE_FALLBACKS = [
  {
    command: "optimize --target=bundle-size",
    trace: [
      "→ analyzing Webpack chunks...",
      "→ found heavy load in dynamic lucide-react icons",
      "→ splitting chunks using next/dynamic...",
      "✓ initial bundle size reduced by 34.2%",
    ],
    recommendation: "Use next/dynamic for heavy client side modules to improve LCP by up to 0.8s."
  },
  {
    command: "optimize --target=db-latency",
    trace: [
      "→ evaluating MongoDB Atlas query shape...",
      "→ detected COLLSCAN on leads query filter",
      "→ building compound index on { budget: 1, createdAt: -1 }...",
      "✓ index built successfully in 12ms",
    ],
    recommendation: "Avoid query collections scans. Run compound indexes on high-frequency query filters."
  },
  {
    command: "optimize --target=cls-shift",
    trace: [
      "→ profiling client Cumulative Layout Shift...",
      "→ detected layout jump in custom dynamic fonts",
      "→ introducing system font fallback loading stack...",
      "✓ CLS rating reduced from 0.18 to 0.01",
    ],
    recommendation: "Use next/font or standard local system font stacks to eliminate layout shifting during hydration."
  }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { target } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

        const prompt = `You are an Elite AI Compiler and code optimization assistant.
Generate an elite engineering performance optimization tip for ${target || "Next.js / TypeScript / Databases"}.
Format it STRICTLY as a JSON object with this exact typescript structure:
{
  "command": string, // short terminal command, e.g. "optimize --target=image-cache"
  "trace": string[], // 3-4 log steps, each starting with "→ " or "✓ " or "✗ "
  "recommendation": string // 1-2 sentence extremely direct, technical and high-end recommendation
}
Ensure the output is valid JSON only. Do not wrap in markdown or backticks. Avoid conversational words or friendly preambles. Keep the advice deeply technical.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Remove potential markdown code wrappers in the response if Gemini added them
        const cleanJson = responseText
          .replace(/^```json\s*/i, "")
          .replace(/```$/, "")
          .trim();

        const parsed = JSON.parse(cleanJson);
        if (parsed.command && Array.isArray(parsed.trace) && parsed.recommendation) {
          return NextResponse.json({
            success: true,
            data: parsed,
            offline: false
          });
        }
      } catch (err) {
        console.warn("Gemini SDK error in optimizer route, using pre-cooked fallbacks", err);
      }
    }

    // Offline or fallback matching logic
    const idx = Math.floor(Math.random() * PERFORMANCE_FALLBACKS.length);
    const selected = PERFORMANCE_FALLBACKS[idx];

    return NextResponse.json({
      success: true,
      data: selected,
      offline: true
    });

  } catch (error: any) {
    console.error("AI Optimizer API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}
