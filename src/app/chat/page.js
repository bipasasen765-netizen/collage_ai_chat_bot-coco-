"use client";

import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox";
import CocoVoice from "../components/CocoVoice";

export default function Home() {
  const [voiceMode, setVoiceMode] = useState(false);
useEffect(() => {
  const handleKeyDown = (event) => {
    const activeElement = document.activeElement;

    const isTyping =
      activeElement?.tagName === "INPUT" ||
      activeElement?.tagName === "TEXTAREA";

    if (
      event.key.toLowerCase() === "v" &&
      !isTyping
    ) {
      setVoiceMode(true);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, []);
  return (
    <main className="min-h-screen bg-pink-200 flex flex-col items-center justify-center p-6">

      <h1 className="text-4xl font-bold text-teal-500">
        CollegeAI
      </h1>

      <p className="mt-2 text-emerald-700 opacity-50">
        Your College AI Assistant
      </p>

      <ChatBox />

 

      {/* Gemini Voice Mode */}
      {voiceMode && (
        <CocoVoice
          onClose={() => setVoiceMode(false)}
        />
      )}

    </main>
  );
}