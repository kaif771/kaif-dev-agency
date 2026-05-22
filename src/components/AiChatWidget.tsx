"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const PRE_BAKED_QUESTIONS = [
  { text: "What is your main tech stack?", key: "stack" },
  { text: "Tell me about your AI capabilities", key: "ai" },
  { text: "Who is Kaif?", key: "agency" },
  { text: "Are you available for new projects?", key: "availability" },
];

const BOT_RESPONSES: Record<string, string> = {
  stack: "We are full-stack specialists focused on high-performance architectures. Our core stack is the MERN & Next.js Ecosystem: React, Next.js (App Router), Node.js, Express, MongoDB, and TypeScript. We also build clean tailwind interfaces with optimized page loads.",
  ai: "We build advanced AI solutions! Our capabilities include custom RAG (Retrieval-Augmented Generation) architectures, vector database integration (Pinecone, ChromaDB), custom LLM orchestration (LangChain, LlamaIndex), OpenAI/Anthropic API integration, and automated agents.",
  agency: "Kaif is the lead Full-Stack Engineer and architect behind Kaif Dev Agency. Operating from Maharashtra, India, he pairs a formal BCA background with extensive hands-on expertise in Next.js, TypeScript, Tailwind CSS, and MongoDB. He specializes in turning complex business ideas into high-converting MVPs, autonomous AI tools, and enterprise-grade web applications with blistering delivery speeds.",
  availability: "Yes! We are active and available. We currently have availability for 2 new projects starting in May 2026. You can lock in a spot by filling out the Tech Strategy form on this page or booking a call directly!",
  default: "That's an interesting question! At Kaif Dev Agency, we specialize in high-performance full-stack applications (React, Next.js, Node, MongoDB) and AI integrations (RAG, custom agents). Fill out the contact form below or book a tech strategy call to discuss this in detail with us!",
};

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "System Online. I am the Kaif Dev Virtual Assistant. How can I help you engineer your high-performance web app or AI solution today?",
      timestamp: new Date(),
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

    const userMsgId = Math.random().toString(36).substring(7);
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text })) }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsTyping(false);
        const newMsgId = Math.random().toString(36).substring(7);
        setMessages((prev) => [
          ...prev,
          {
            id: newMsgId,
            sender: "ai",
            text: data.reply,
            timestamp: new Date(),
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
      const newMsgId = Math.random().toString(36).substring(7);
      setMessages((prev) => [
        ...prev,
        {
          id: newMsgId,
          sender: "ai",
          text: responseText,
          timestamp: new Date(),
        },
      ]);
    }, 600 + Math.random() * 500);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-cyber-card border border-cyber-blue/30 text-cyber-blue hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:border-cyber-blue group"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          {hasNewMessage && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyber-green border border-[#050508]"></span>
            </span>
          )}
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[350px] sm:w-[380px] h-[500px] rounded-2xl glass-panel border border-cyber-blue/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-cyber-card/80 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-cyber-green border border-[#0a0a16] animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-slate-100 flex items-center gap-1.5">
                  CYBER-BRAIN V1.0 <Sparkles className="w-3 h-3 text-cyber-blue" />
                </h3>
                <p className="text-[10px] text-cyber-muted tracking-widest font-mono">STATUS: ONLINE</p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="p-1 rounded-md text-cyber-muted hover:text-slate-100 hover:bg-white/5 transition-colors"
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
                      ? "bg-cyber-violet/10 border-cyber-violet/40 text-cyber-violet"
                      : "bg-cyber-blue/10 border-cyber-blue/40 text-cyber-blue"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] p-3 rounded-xl border ${
                    msg.sender === "user"
                      ? "bg-cyber-card-light border-cyber-violet/20 text-slate-200 rounded-tr-none"
                      : "bg-[#0b0c20]/60 border-cyber-blue/10 text-slate-300 rounded-tl-none font-mono text-[13px] leading-relaxed"
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
                <div className="bg-[#0b0c20]/60 border border-cyber-blue/10 p-3 rounded-xl rounded-tl-none max-w-[75%]">
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
          <div className="p-3 bg-cyber-card/30 border-t border-white/5 space-y-1.5">
            <p className="text-[10px] text-cyber-muted font-mono tracking-wider">TAP QUICK INQUIRIES:</p>
            <div className="flex flex-wrap gap-1.5">
              {PRE_BAKED_QUESTIONS.map((q) => (
                <button
                  key={q.key}
                  onClick={() => handleSendMessage(q.text)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-full bg-white/2 hover:bg-cyber-blue/10 border border-white/5 hover:border-cyber-blue/30 text-cyber-muted hover:text-cyber-blue transition-all duration-300"
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
            className="p-3 bg-cyber-card border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about our stack..."
              className="flex-1 px-3.5 py-2 text-xs bg-white/3 hover:bg-white/5 focus:bg-white/5 border border-white/5 focus:border-cyber-blue/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-300 font-mono"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue hover:text-black hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-cyber-blue disabled:hover:shadow-none transition-all duration-300 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
