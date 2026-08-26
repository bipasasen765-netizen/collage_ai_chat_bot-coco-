"use client";

import { useState } from "react";
import { Mic } from "lucide-react";

export default function ChatBox() {
  // Question asked by user
  const [question, setQuestion] = useState("");

  // Voice reply
  const [voiceReply, setVoiceReply] = useState(false);

  // Loading AI
  const [loading, setLoading] = useState(false);

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
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          sender: "ai",
          text: "Sorry, I couldn't connect to the AI.",
        },
      ]);

      setLoading(false);
      console.error(error);
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