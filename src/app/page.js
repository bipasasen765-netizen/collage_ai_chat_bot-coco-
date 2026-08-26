"use client";

import { useState } from "react";
import ChatBox from "./components/ChatBox";
import CocoVoice from "./components/CocoVoice";

export default function Home() {
  const [voiceMode, setVoiceMode] = useState(false);

  return (
    <main className="min-h-screen bg-pink-200 flex flex-col items-center justify-center p-6">

      <h1 className="text-4xl font-bold text-teal-500">
        CollegeAI
      </h1>

      <p className="mt-2 text-emerald-700 opacity-50">
        Your College AI Assistant
      </p>

      <ChatBox />

      {/* Temporary Gemini Voice Test */}
      <button
        onClick={() => setVoiceMode(true)}
        className="mt-4 bg-teal-600 text-white px-6 py-3 rounded-xl
                   hover:bg-teal-700 transition"
      >
        🎙️ Test Coco Voice
      </button>

      {/* Gemini Voice Mode */}
      {voiceMode && (
        <CocoVoice
          onClose={() => setVoiceMode(false)}
        />
      )}

    </main>
  );
}