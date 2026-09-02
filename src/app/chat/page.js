"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Mic, ShieldCheck, GraduationCap } from "lucide-react";
import ChatBox from "../components/ChatBox";
import CocoVoice from "../components/CocoVoice";
import Image from "next/image";

export default function Home() {
  const [voiceMode, setVoiceMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;

      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA";

      if (event.key.toLowerCase() === "v" && !isTyping) {
        setVoiceMode(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FCFCFD] text-zinc-900 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-orange-500 selection:text-white">
      
      {/* Scoped CSS Keyframe Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ambientGlow {
          0%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.1) translateY(-10px);
            opacity: 0.55;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-ambient-glow {
          animation: ambientGlow 9s ease-in-out infinite;
        }
      `}</style>

      {/* Top Ambient Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-orange-500/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10 animate-ambient-glow" />

      {/* Institutional Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between z-20 animate-fade-in-down">
        
        {/* Campus Brand Identity */}
        <div className="flex items-center gap-3">
        {/* কলেজের আসল লোগো */}
<div className="w-11 h-11 relative rounded-xl overflow-hidden bg-white shadow-md border border-zinc-200/80 flex items-center justify-center transition-transform duration-300 hover:scale-105">
  <Image
    src="/college-logo.png"
    alt="EIILM Kolkata Jalpaiguri Campus Logo"
    width={44}
    height={44}
    className="object-contain p-1"
    priority
  />
</div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 leading-none">
              EIILM Kolkata Jalpaiguri Campus
            </h1>
            <p className="text-[11px] font-semibold text-orange-600 tracking-wider uppercase mt-1">
              Coco AI Academic Portal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Real-Time Voice Trigger Button */}
          <button
            onClick={() => setVoiceMode(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50/90 hover:bg-orange-100 border border-orange-200/80 text-orange-700 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 group"
            title="Launch Interactive Voice Mode"
          >
            <Mic size={15} className="text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Voice Assistant</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-orange-200 text-orange-600 shadow-2xs">
              V
            </kbd>
          </button>

          {/* Login / Switch Link */}
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold hover:border-orange-300 hover:text-orange-600 hover:shadow-sm transition-all duration-200 active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Interactive Chat Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-6 z-10">
        
        {/* Academic Hero Title & Status */}
        <div 
          className="text-center max-w-2xl mx-auto mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/90 text-orange-700 text-xs font-semibold shadow-xs mb-3">
            <Sparkles size={13} className="text-orange-600 animate-pulse" />
            <span>Constructive Opportunities & Communication Optimizer</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Coco AI</span> Anything
          </h2>
          
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-lg mx-auto leading-relaxed">
            Instant academic support, class routines, syllabus breakdowns, and department guidance for students and faculty.
          </p>
        </div>

        {/* Existing ChatBox Component Wrapper */}
        <div 
          className="w-full flex justify-center opacity-0 animate-fade-in-up"
          style={{ animationDelay: "280ms" }}
        >
          <ChatBox />
        </div>

        {/* Minimal Feature Hints */}
        <div 
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] text-zinc-500 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "380ms" }}
        >
          <div className="flex items-center gap-1.5">
            <GraduationCap size={14} className="text-orange-600" />
            <span>Verified Syllabus Knowledge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-orange-600" />
            <span>Encrypted Institutional Cloud</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Gemini AI Active</span>
          </div>
        </div>

      </section>

      {/* Institutional Minimal Footer */}
      <footer 
        className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 border-t border-zinc-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "450ms" }}
      >
        <p className="font-medium text-zinc-700">
          EIILM Kolkata Jalpaiguri Campus
        </p>
        <p className="text-[11px] text-zinc-400">
          © 2026 Academic AI Portal • Developed for College Community
        </p>
      </footer>

      {/* Gemini Voice Mode Modal Component */}
      {voiceMode && (
        <CocoVoice onClose={() => setVoiceMode(false)} />
      )}

    </main>
  );
}