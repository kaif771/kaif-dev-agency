"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User } from "lucide-react";

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
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

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

  const handleToggle = () => {
    setIsOpen((v) => !v);
    setHasNewMessage(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-black/8 text-cyber-text hover:bg-black/[0.03] transition-colors group shadow-lg"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6 text-cyber-blue transition-transform duration-300 group-hover:scale-110" />
          {hasNewMessage && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyber-green border border-black/40"></span>
            </span>
          )}
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[350px] sm:w-[380px] h-[520px] rounded-3xl glass-panel border border-black/8 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/[0.02] border-b border-black/8">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-cyber-green border border-black/40 animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold tracking-wide text-cyber-text flex items-center gap-1.5">
                  Studio Assistant <Sparkles className="w-3 h-3 text-cyber-blue" />
                </h3>
                <p className="text-xs text-cyber-text tracking-wider font-mono font-bold">
                  STATUS: ONLINE
                </p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="p-1 rounded-md text-cyber-muted hover:text-cyber-text hover:bg-black/[0.04] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Box */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 text-xs font-mono ${
                    msg.sender === "user"
                      ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
                      : "bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                 <div
                  className={`max-w-[75%] p-3.5 rounded-2xl border ${
                    msg.sender === "user"
                      ? "bg-white border-black/8 text-cyber-text rounded-tr-none shadow-sm animate-fade-in text-sm sm:text-base font-semibold"
                      : "bg-black/[0.02] border-black/8 text-cyber-text rounded-tl-none font-mono text-sm sm:text-base leading-relaxed font-semibold"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 flex-row">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-black/[0.02] border border-black/8 p-3 rounded-xl rounded-tl-none max-w-[75%]">
                  <div className="flex gap-1 items-center py-1">
                    <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick-reply Tags */}
          <div className="p-3 bg-black/[0.02] border-t border-black/8 space-y-1.5">
            <p className="text-xs text-cyber-text font-mono font-bold tracking-wider">TAP QUICK INQUIRIES:</p>
            <div className="flex flex-wrap gap-1.5">
              {PRE_BAKED_QUESTIONS.map((q) => (
                <button
                  key={q.key}
                  onClick={() => handleSendMessage(q.text)}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-mono font-bold rounded-full bg-white hover:bg-black/[0.03] border border-black/8 text-cyber-text hover:text-cyber-blue transition-colors shadow-sm animate-fade-in"
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
            className="p-3 bg-black/[0.02] border-t border-black/8 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about stack, timeline, AI, performance…"
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-black/8 rounded-xl text-cyber-text placeholder:text-cyber-muted/50 focus:outline-none focus:border-cyber-blue/30 transition-colors font-mono font-semibold"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-cyber-blue text-white hover:brightness-105 disabled:opacity-50 transition shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
