"use client";

import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

export default function ChatBox() {
  // Question asked by user
  const [question, setQuestion] = useState("");

  // Voice reply
  const [voiceReply, setVoiceReply] = useState(false);

  // Loading AI
  const [loading, setLoading] = useState(false);
const [serviceUnavailable, setServiceUnavailable] = useState(false);
const [checkingService, setCheckingService] = useState(true);
//check sevices 
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
  }, 7000);
}
  };

  checkServiceStatus();
}, []);
  // Messages
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! How can I help you?",
    },
  ]);

  // AI speak function
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

  // Ask AI
  const handleAsk = async () => {
    const text = question.trim();

    if (!text) return;

    setLoading(true);

    // Show user's message
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

      // Add AI response
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          sender: "ai",
          text: data.answer,
        },
      ]);

      // AI speaks only when voice reply is enabled
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

  // Microphone
  const handleMic = () => {
    setVoiceReply(true);

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const speechText =
        event.results[0][0].transcript;

      setQuestion(speechText);
    };

    recognition.start();
  };

if (checkingService) {
  return (
    <div className="fixed inset-0 z-[9999] bg-pink-100 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-pink-500 border-t-teal-400 rounded-full animate-spin"></div>

      <h1 className="mt-6 text-2xl font-semibold">
        <span className="text-pink-500">Coco</span>{" "}
        <span className="text-teal-400">is waking up...</span>
      </h1>

      <p className="mt-2 text-gray-400 text-sm">
        Preparing your college assistant
      </p>
    </div>
  );
}
  
if (serviceUnavailable) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-start justify-center pt-12 p-6 overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 8% 12%, rgba(255,255,255,0.9) 1px, transparent 1.5px),
          radial-gradient(circle at 18% 28%, rgba(255,192,203,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 30% 10%, rgba(255,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 42% 22%, rgba(128,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 55% 8%, rgba(255,255,255,0.9) 1px, transparent 1.5px),
          radial-gradient(circle at 68% 18%, rgba(255,192,203,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 82% 10%, rgba(255,255,255,0.9) 1px, transparent 1.5px),
          radial-gradient(circle at 92% 25%, rgba(128,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 12% 48%, rgba(255,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 25% 62%, rgba(255,192,203,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 75% 52%, rgba(255,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 88% 68%, rgba(128,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 6% 82%, rgba(255,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 22% 90%, rgba(255,192,203,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 78% 88%, rgba(255,255,255,0.8) 1px, transparent 1.5px),
          radial-gradient(circle at 94% 92%, rgba(128,255,255,0.8) 1px, transparent 1.5px)
        `,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="relative flex flex-col items-center text-center max-w-md">

        {/* Coco sleeping image */}
        <img
          src="/coco-sleeping.png"
          alt="Coco is sleeping"
       className="w-full max-w-[240px] rounded-3xl"
        />

        {/* Main title */}
       <h1 className="mt-4 text-2xl font-semibold">
          <span className="text-pink-500">Coco is taking</span>{" "}
          <span className="text-teal-400">a little break</span> 😴
        </h1>

        {/* Main message */}
       <p className="mt-2 text-white text-base">
          The AI service is temporarily unavailable.
        </p>

        {/* Small message */}
        <p className="mt-1 text-gray-400 text-sm">
          Please come back later. Coco will be waiting for you..
        </p>

      </div>
    </div>
  );
}

  return (
    <div className="mt-8 w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">

      {/* Messages */}
      <div className="bg-teal-50 rounded-xl p-4 min-h-[250px]">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              message.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-[75%] ${
                message.sender === "user"
                  ? "bg-pink-500 text-white rounded-br-sm"
                  : "bg-teal-100 text-teal-900 rounded-bl-sm"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {/* Loading animation */}
        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-teal-100 text-teal-900 rounded-bl-sm">

              <div className="flex items-center gap-1">

                <span className="w-2 h-2 bg-teal-700 rounded-full animate-bounce [animation-delay:0ms]"></span>

                <span className="w-2 h-2 bg-teal-700 rounded-full animate-bounce [animation-delay:150ms]"></span>

                <span className="w-2 h-2 bg-teal-700 rounded-full animate-bounce [animation-delay:300ms]"></span>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Input area */}
      <div className="flex gap-2 mt-4">

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
          placeholder="Ask something about your college..."
          className="flex-1 border-1 border-none rounded-lg px-6 py-3 bg-teal-200 text-black focus:ring-2 focus:ring-pink-300/30 focus:shadow-[0_0_20px_3px_rgba(236,72,153,0.2)] focus:outline-none"
        />

        {/* Microphone */}
        <button
          type="button"
          className="w-12 h-12 flex items-center justify-center rounded-xl
                     bg-pink-600 text-white
                     border-2 border-transparent
                     transition-all duration-200
                     hover:bg-pink-100 hover:text-pink-600
                     hover:border-pink-400
                     focus:outline-none
                     focus:ring-4 focus:ring-pink-300/40
                     focus:shadow-[0_0_20px_6px_rgba(236,72,153,0.25)]"
          onClick={handleMic}
        >
          <Mic size={22} strokeWidth={2} />
        </button>

        {/* Ask */}
        <button
          className="bg-pink-600 text-white px-5 rounded-lg"
          onClick={handleAsk}
        >
          Ask
        </button>

      </div>

    </div>
  );
}