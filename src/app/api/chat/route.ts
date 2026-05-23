import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

// Check if the provided key is a placeholder or undefined
const isPlaceholderKey = !apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey === "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (isPlaceholderKey) {
      console.warn("GEMINI_API_KEY is not defined. Bypassing active Gemini API to use heuristic chat responses.");
      return NextResponse.json({
        text: "Hi there! I am Kaif's personal Studio Assistant. Mohammad Kaif is the founder and elite lead systems engineer behind Kaif Dev Agency. He is a full-stack visionary who crafts ultra-premium, high-performance web + AI systems using React 19, Next.js, TypeScript, Node.js, and MongoDB. How can I help connect you with Kaif or plan your next custom build today?"
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey! });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction: `
            You are "Kaif's Studio Assistant", a high-end personal AI systems architect built by Kaif Dev Agency.
            You are speaking directly to a prospective client in a warm, premium, conversational Apple-style voice.
            
            Specialization & Studio Knowledge:
            - Specialization: You specialize in Next.js, React, Node.js, TypeScript, and MongoDB. You write zero-bloat, production-ready systems!
            - Owner: Mohammad Kaif (often referred to simply as "Kaif"), a brilliant full-stack systems engineer and founder of Kaif Dev Agency. If asked who Kaif is or who your owner is, introduce him with pride, warmth, and high regard as the lead engineer and founder.
            - Tech Stack of this Website: Built using Next.js App Router (React Server Components, Server Actions), React 19 concurrent UI rendering, Node.js asynchronous backend routing, MongoDB Serverless database schemas, TypeScript compile-time safety, and Tailwind CSS v4 styling.
            
            Rules:
            - Respond directly to the user in a friendly, warm, conversational tone. Speak like a real human systems architect talking directly to another human.
            - Avoid tech cards or structured bullet logs unless specifically asked. Focus on natural human conversation and elite consultative architecture.
          `
        }
      });

      return NextResponse.json({
        text: response.text || "I was unable to compile a response. Let me know how else I can assist you."
      });
    } catch (apiErr: any) {
      console.error("Gemini Chat API call failed:", apiErr.message || apiErr);
      return NextResponse.json({
        text: "Hi there! I am Kaif's personal Studio Assistant. Mohammad Kaif is the founder and elite lead systems engineer behind Kaif Dev Agency. He is a full-stack visionary who crafts ultra-premium, high-performance web + AI systems using React 19, Next.js, TypeScript, Node.js, and MongoDB. How can I help connect you with Kaif or plan your next custom build today? (Offline Heuristic Mode Active)"
      });
    }

  } catch (err: any) {
    console.error("Studio Assistant Chat Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate chat response" },
      { status: 500 }
    );
  }
}
