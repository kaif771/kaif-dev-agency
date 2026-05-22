import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GridBackground from "@/components/GridBackground";
import AiChatWidget from "@/components/AiChatWidget";
import SmoothScroll from "@/components/motion/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaif Dev Agency | High-Performance Web Apps & AI Solutions",
  description: "Full-stack MERN & Next.js production code delivered by a lean, rapid-execution dev team. Specializing in high-performance web systems and custom AI integrations.",
  keywords: ["MERN Stack", "Next.js", "AI Integrations", "Custom RAG", "TypeScript", "React developer", "Kaif Dev Agency"],
  authors: [{ name: "Kaif" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kaif Dev Agency | High-Performance Web Apps & AI Solutions",
    description: "Full-stack MERN & Next.js production code delivered by a lean, rapid-execution dev team.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="relative min-h-screen bg-cyber-bg text-cyber-text antialiased overflow-x-hidden">
        {/* Dynamic Glowing Cyberpunk Background */}
        <GridBackground />

        {/* Main Content Viewport */}
        <SmoothScroll>{children}</SmoothScroll>

        {/* Custom Wow-Factor AI Assistant */}
        <AiChatWidget />
      </body>
    </html>
  );
}
