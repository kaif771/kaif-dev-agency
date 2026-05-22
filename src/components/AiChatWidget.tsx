"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User, Terminal, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const PRE_BAKED_QUESTIONS = [
  { text: "What is your main tech stack?", key: "stack" },
  { text: "Tell me about your AI capabilities", key: "ai" },
  { text: "Who is Kaif?", key: "agency" },
  { text: "Are you available for new projects?", key: "availability" },
];

const BOT_RESPONSES: Record<string, string> = {
  stack: "We build high-performance web systems with a pragmatic stack: Next.js (App Router), TypeScript, Node.js, and MongoDB — with careful UI engineering using Tailwind.",
  ai: "We ship production AI features: RAG pipelines, vector DB integration, LLM orchestration (LangChain/LlamaIndex), and guardrails for reliability.",
  agency: "Kaif leads the engineering work at Kaif Dev Agency from Maharashtra, India — focused on building fast, maintainable, conversion-ready products.",
  availability: "Yes — currently taking a small number of new builds. Use the intake form to share scope and timeline.",
  default: "Happy to help. Ask about stack, timelines, performance, or AI — or use the intake form for a detailed plan.",
};

export default function AiChatWidget() {
  const messageIdRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Studio assistant online. What are you building — and what constraints matter most (speed, scale, SEO, AI, integrations)?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Listen to open event from navbar or hero assistant link
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen((prev) => !prev);
    
    window.addEventListener("open-studio-assistant", handleOpen);
    window.addEventListener("toggle-studio-assistant", handleToggle);
    
    return () => {
      window.removeEventListener("open-studio-assistant", handleOpen);
      window.removeEventListener("toggle-studio-assistant", handleToggle);
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    messageIdRef.current += 1;
    const userMsgId = `m${messageIdRef.current}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: text,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsTyping(false);
        messageIdRef.current += 1;
        const newMsgId = `m${messageIdRef.current}`;
        setMessages((prev) => [
          ...prev,
          {
            id: newMsgId,
            sender: "ai",
            text: data.reply,
          },
        ]);
        return;
      }
    } catch (err) {
      console.warn("Serverless chat endpoint unavailable, falling back to local brain", err);
    }

    // Local fallback matching logic
    const lowerText = text.toLowerCase();
    let matchedKey = "";

    if (lowerText.includes("stack") || lowerText.includes("technology") || lowerText.includes("framework") || lowerText.includes("mern") || lowerText.includes("next")) {
      matchedKey = "stack";
    } else if (lowerText.includes("ai") || lowerText.includes("llm") || lowerText.includes("rag") || lowerText.includes("openai") || lowerText.includes("agent")) {
      matchedKey = "ai";
    } else if (lowerText.includes("who") || lowerText.includes("kaif") || lowerText.includes("agency")) {
      matchedKey = "agency";
    } else if (lowerText.includes("available") || lowerText.includes("availability") || lowerText.includes("hire") || lowerText.includes("open")) {
      matchedKey = "availability";
    }

    const responseText = matchedKey ? BOT_RESPONSES[matchedKey] : BOT_RESPONSES.default;

    setTimeout(() => {
      setIsTyping(false);
      messageIdRef.current += 1;
      const newMsgId = `m${messageIdRef.current}`;
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId,
          sender: "ai",
          text: responseText,
        },
      ]);
    }, 650);
  };

  return (
    <>
      {/* Backdrop (visible only when drawer is open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Flat Slide-Out side panel from the right edge */}
      <div
        className={`fixed top-0 right-0 h-screen w-[420px] max-w-full z-50 bg-white border-l border-black/8 shadow-2xl flex flex-col transition-transform duration-500 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* IDE Explorer / Terminal Style Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-slate-50 border-b border-black/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue shrink-0">
              <Bot className="w-4.5 h-4.5" />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-cyber-green border border-white animate-pulse"></span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-cyber-text flex items-center gap-1.5 font-sans">
                Studio Assistant <Sparkles className="w-3.5 h-3.5 text-cyber-blue" />
              </h3>
              <p className="text-[10px] text-cyber-muted tracking-wider font-mono font-bold uppercase">
                INSPECTION · ACTIVE
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full text-cyber-muted hover:text-cyber-text hover:bg-black/[0.04] transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Console Trace Header Bar */}
        <div className="bg-black text-[10px] text-gray-400 font-mono px-6 py-2 flex items-center justify-between border-b border-black/8 select-none shrink-0">
          <span>CONSOLE: gemini-2.5-flash</span>
          <span className="text-cyber-green font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-ping"></span>
            CONNECTED
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm bg-[#fafafa] scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 text-xs font-mono select-none ${
                  msg.sender === "user"
                    ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
                    : "bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Speech Bubble */}
              <div
                className={`max-w-[80%] p-4 rounded-2xl border leading-relaxed font-sans font-medium text-cyber-text ${
                  msg.sender === "user"
                    ? "bg-white border-black/8 rounded-tr-none shadow-sm"
                    : "bg-slate-50 border-black/8 rounded-tl-none text-xs sm:text-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 flex-row animate-pulse">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-black/8 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                <div className="flex gap-1.5 items-center py-1">
                  <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Inquiry Options */}
        <div className="p-5 bg-white border-t border-black/8 space-y-2 shrink-0">
          <p className="text-[10px] text-cyber-muted font-mono font-bold tracking-wider uppercase">Quick Inquiries</p>
          <div className="flex flex-wrap gap-1.5">
            {PRE_BAKED_QUESTIONS.map((q) => (
              <button
                key={q.key}
                onClick={() => handleSendMessage(q.text)}
                className="px-3.5 py-2 text-xs font-semibold rounded-full bg-slate-50 hover:bg-black/[0.03] border border-black/8 text-cyber-text hover:text-cyber-blue transition-colors shadow-sm cursor-pointer"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-5 bg-slate-50 border-t border-black/8 flex gap-2 shrink-0 font-sans"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about tech stacks, pricing, AI systems..."
            className="flex-1 px-4 py-3 text-sm bg-white border border-black/8 rounded-xl text-cyber-text placeholder:text-cyber-muted/50 focus:outline-none focus:border-cyber-blue/30 focus:bg-white transition shadow-sm font-sans font-medium"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-3 rounded-xl bg-black text-white hover:bg-black/90 disabled:opacity-50 transition shrink-0 shadow-sm flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
