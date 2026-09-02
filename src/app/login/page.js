"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/user-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid institutional credentials");

      router.push("/chat");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-zinc-900 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-orange-500 selection:text-white">
      
      {/* Scoped CSS Keyframe Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.08) translateY(-10px);
            opacity: 0.65;
          }
        }
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse-glow {
          animation: pulseGlow 8s ease-in-out infinite;
        }
        .animate-float {
          animation: floatSlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Dynamic Background Ambient Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      {/* Top Floating Header with Slide-Down Animation */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between z-20 animate-fade-in-down">
        <div className="flex items-center gap-3 group cursor-default">
        {/* কলেজের আসল লোগো */}
<div className="w-11 h-11 relative rounded-xl overflow-hidden bg-white shadow-md border border-zinc-200/80 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
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
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 leading-none group-hover:text-orange-600 transition-colors">
              EIILM Kolkata
            </h1>
            <p className="text-[11px] font-semibold text-orange-600 tracking-wider uppercase mt-1">
              Jalpaiguri Campus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-zinc-500 hidden sm:inline transition-opacity duration-300">
            New to campus portal?
          </span>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-zinc-200 text-zinc-800 font-semibold hover:border-orange-300 hover:text-orange-600 hover:shadow-md hover:shadow-orange-500/10 transition-all duration-200 active:scale-95"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Showcase & Login Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Side: Modern Bento Grid Showcase with Staggered Entrance */}
          <div className="hidden lg:flex lg:col-span-7 flex-col space-y-6 pr-4">
            
            {/* Live Indicator Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50/90 border border-orange-200/80 text-orange-700 text-xs font-semibold w-fit shadow-sm opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Unified Academic Digital Environment
            </div>

            {/* Headline with Animated Gradient Accent */}
            <div 
              className="space-y-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-[1.15]">
                Smart Campus AI & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-[length:200%_auto] hover:animate-pulse">
                  Academic Portal
                </span>
              </h2>
              <p className="text-sm text-zinc-600 max-w-lg leading-relaxed">
                Connect seamlessly with EIILM Kolkata Jalpaiguri Campus intelligence. Manage schedules, exam notices, and communicate in real-time with Coco AI.
              </p>
            </div>

            {/* Bento Interactive Cards */}
            <div 
              className="grid grid-cols-2 gap-4 pt-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "320ms" }}
            >
              {/* Card 1: Coco AI */}
              <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                  Coco AI Assistant
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Instant answers on routines, syllabus, and faculty queries.
                </p>
              </div>

              {/* Card 2: Encrypted Access */}
              <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1.5 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                  Encrypted Access
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Institutional SSL security with TiDB cloud connectivity.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Ultra Clean Floating Card with Entrance Transition */}
          <div 
            className="lg:col-span-5 w-full max-w-md mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: "250ms" }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-9 shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-zinc-200/90 hover:border-orange-200/90 transition-all duration-300 relative">
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  Welcome Back
                </h3>
                <p className="text-xs text-zinc-500 mt-1.5">
                  Enter your credentials to access your campus dashboard
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-bounce">
                  <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field with Focus Glow */}
                <div className="group">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5 group-focus-within:text-orange-600 transition-colors">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@eiilm.edu.in"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50/80 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-700 group-focus-within:text-orange-600 transition-colors">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-orange-600 hover:text-orange-700 hover:underline font-semibold transition-colors"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50/80 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 hover:text-orange-600 select-none transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Interactive Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Sign In to Campus
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              {/* Bottom Switch */}
              <div className="mt-6 text-center pt-5 border-t border-zinc-100">
                <p className="text-xs text-zinc-500">
                  New student or faculty?{" "}
                  <Link
                    href="/signup"
                    className="text-orange-600 font-bold hover:underline hover:text-orange-700 ml-0.5 transition-colors"
                  >
                    Register Now
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Modern Minimal Footer with Fade In */}
      <footer 
        className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 border-t border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <p>© 2026 EIILM Kolkata Jalpaiguri Campus. All rights reserved.</p>
        <p className="text-[11px] text-zinc-400">Institutional AI Academic System (Coco)</p>
      </footer>
    </div>
  );
}