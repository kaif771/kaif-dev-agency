import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const STACK_FALLBACKS = [
  {
    command: "optimize --target=db-latency",
    trace: [
      "→ evaluating MongoDB Atlas query shape...",
      "→ detected COLLSCAN on leads query filter",
      "→ building compound index on { budget: 1, createdAt: -1 }...",
      "✓ compound index built successfully in 12ms",
    ],
    recommendation: "Avoid query collection scans. Run compound indexes on high-frequency filters to scale read operations."
  },
  {
    command: "optimize --target=hydration-contracts",
    trace: [
      "→ profiling next/headers & dynamic routing...",
      "→ caught async props mismatch in server component hydration",
      "→ standardizing response serializers for typed contracts...",
      "✓ server/client rendering matched perfectly in 4ms",
    ],
    recommendation: "Ensure strict serialization boundaries. Never pass rich Mongoose documents directly to client components without mapping."
  }
];

const MOTION_FALLBACKS = [
  {
    command: "optimize --target=gsap-rendering",
    trace: [
      "→ profiling main thread scroll listeners...",
      "→ detected memory leak in unmounted ScrollTrigger boundaries",
      "→ wrapping GSAP contexts and compiling explicit cleanup return...",
      "✓ scroll performance reclaimed 14.5% idle cycles",
    ],
    recommendation: "Always encapsulate GSAP anims in useLayoutEffect and return ctx.revert() to prevent memory leaks and main thread blocks."
  },
  {
    command: "optimize --target=smooth-scroll",
    trace: [
      "→ tracking Lenis frame rate under synthetic scroll events...",
      "→ detected layout thrashing from will-change dynamic injections",
      "→ tuning Lenis damping factors and standardizing CSS hardware layers...",
      "✓ scroll jitter eliminated (60fps lock achieved)",
    ],
    recommendation: "Tether Lenis hooks safely and utilize will-change layout hints sparingly on animated containers to offload rendering to the GPU."
  }
];

const GENERAL_FALLBACKS = [
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
    const { target, category } = body;

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

    // Offline fallback selection based on category
    let selected;
    if (category === "stack") {
      const idx = Math.floor(Math.random() * STACK_FALLBACKS.length);
      selected = STACK_FALLBACKS[idx];
    } else if (category === "motion") {
      const idx = Math.floor(Math.random() * MOTION_FALLBACKS.length);
      selected = MOTION_FALLBACKS[idx];
    } else {
      const idx = Math.floor(Math.random() * GENERAL_FALLBACKS.length);
      selected = GENERAL_FALLBACKS[idx];
    }

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

