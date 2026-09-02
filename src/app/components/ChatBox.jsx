"use client";

import { useEffect, useState } from "react";
import { Mic, Send, Bot, User, Sparkles } from "lucide-react";

export default function ChatBox() {
  // Question asked by user
  const [question, setQuestion] = useState("");

  // Voice reply
  const [voiceReply, setVoiceReply] = useState(false);

  // Loading AI
  const [loading, setLoading] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [checkingService, setCheckingService] = useState(true);

  // Text formatter: converts markdown **text** to styled bold elements
  const formatMessage = (content) => {
    if (!content) return "";
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-zinc-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Check service status on load
  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const response = await fetch("/api/service-status");
        const data = await response.json();

        setServiceUnavailable(!data.enabled);
      } catch (error) {
        console.error("Failed to check service status:", error);
        setServiceUnavailable(true);
      } finally {
        setTimeout(() => {
          setCheckingService(false);
        }, 1000);
      }
    };

    checkServiceStatus();
  }, []);

  // Message thread state
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Welcome to EIILM Kolkata Jalpaiguri Campus AI Portal! How can I assist you with your academic queries or campus information today?",
    },
  ]);

  // AI voice synthesizer
  const speakText = (text) => {
    const cleanText = text
      .replace(/\bEIILM\b/gi, "E I I L M")
      .replace(/[*_#`~]/g, "")
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
      .replace(/[\u{2600}-\u{27BF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

    const speech = new SpeechSynthesisUtterance(cleanText);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // Query handler
  const handleAsk = async () => {
    const text = question.trim();

    if (!text) return;

    setLoading(true);

    // Append student prompt
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        sender: "user",
        text: text,
      },
    ]);

    setQuestion("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (response.status === 503) {
        setServiceUnavailable(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Append verified response
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          sender: "ai",
          text: data.answer,
        },
      ]);

      // Speak when initiated via voice
      if (voiceReply) {
        speakText(data.answer);
        setVoiceReply(false);
      }

      setLoading(false);
    } catch (error) {
      let errorMessage = "⚠️ Something went wrong.";

      if (error.message) {
        if (
          error.message.toLowerCase().includes("rate limit") ||
          error.message.toLowerCase().includes("free-models-per-day") ||
          error.message.toLowerCase().includes("too many requests")
        ) {
          errorMessage =
            "⚠️ Coco has reached today's free AI request limit. Please try again later.";
        } else {
          errorMessage = `⚠️ ${error.message}`;
        }
      }

      setMessages((oldMessages) => [
        ...oldMessages,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);

      setLoading(false);
      console.error("Coco AI Error:", error);
    }
  };

  // Microphone input trigger
  const handleMic = () => {
    setVoiceReply(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setQuestion(speechText);
    };

    recognition.start();
  };

  // Screen 1: Initializing Service
  if (checkingService) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#FCFCFD]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin shadow-lg shadow-orange-500/10"></div>
          <Sparkles size={20} className="text-orange-600 absolute animate-pulse" />
        </div>

        <h1 className="mt-6 text-xl font-bold text-zinc-900 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
            Coco AI
          </span>{" "}
          is initializing...
        </h1>

        <p className="mt-1.5 text-xs text-zinc-500 font-medium">
          Connecting to EIILM Kolkata Jalpaiguri Campus digital database
        </p>
      </div>
    );
  }

  // Screen 2: Maintenance / Sleeping State
  if (serviceUnavailable) {
    return (
      <div className="fixed inset-0 z-[9999] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-6 selection:bg-orange-500 selection:text-white">
        <div className="relative flex flex-col items-center text-center max-w-md bg-zinc-900/90 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <img
            src="/coco-sleeping.png"
            alt="Coco is taking a break"
            className="w-full max-w-[220px] rounded-2xl shadow-md border border-zinc-800"
          />

          <h1 className="mt-5 text-xl font-bold text-white tracking-tight">
            <span className="text-orange-500">Coco</span> is taking a brief break 😴
          </h1>

          <p className="mt-2 text-zinc-300 text-xs sm:text-sm leading-relaxed">
            The campus AI service is temporarily undergoing routine maintenance.
          </p>

          <p className="mt-2 text-zinc-500 text-xs">
            Please revisit shortly. Coco will be ready to assist you.
          </p>
        </div>
      </div>
    );
  }

  // Screen 3: Main Professional Orange & White Chat UI
  return (
    <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-zinc-200/90 p-4 sm:p-6 transition-all duration-300 hover:border-orange-200">
      
      {/* Messages Thread Container */}
      <div className="bg-zinc-50/80 rounded-2xl p-4 sm:p-5 min-h-[290px] max-h-[460px] overflow-y-auto border border-zinc-200/60 flex flex-col gap-3.5">
        
        {messages.map((message, index) => {
          const isUser = message.sender === "user";
          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Bot Avatar Icon */}
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-500/20 mt-1">
                  <Bot size={15} />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`px-4 py-3 text-xs sm:text-sm rounded-2xl max-w-[82%] whitespace-pre-wrap leading-relaxed shadow-2xs transition-all ${
                  isUser
                    ? "bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white rounded-tr-xs font-medium shadow-orange-500/10"
                    : "bg-white border border-zinc-200/90 text-zinc-800 rounded-tl-xs shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                }`}
              >
                {formatMessage(message.text)}
              </div>

              {/* User Avatar Icon */}
              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <User size={15} />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-500/20 mt-1">
              <Bot size={15} />
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white border border-zinc-200/90 text-zinc-800 rounded-tl-xs shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Action Bar */}
      <div className="flex items-center gap-2 mt-4 bg-zinc-50/90 p-1.5 rounded-2xl border border-zinc-200/90 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:bg-white transition-all duration-200">
        
        {/* Text Input Field */}
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
          placeholder="Ask Coco about syllabus, routines, or campus notices..."
          className="flex-1 bg-transparent px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none"
        />

        {/* Microphone Button */}
        <button
          type="button"
          onClick={handleMic}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-orange-50 text-zinc-600 hover:text-orange-600 border border-zinc-200 hover:border-orange-200 transition-all duration-200 shadow-2xs active:scale-95 shrink-0"
          title="Speak via Microphone"
        >
          <Mic size={17} strokeWidth={2.2} />
        </button>

        {/* Send Action Button */}
        <button
          type="button"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="h-10 px-4 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
        >
          <span>Ask</span>
          <Send size={14} />
        </button>

      </div>

    </div>
  );
}