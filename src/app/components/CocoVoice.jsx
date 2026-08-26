"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleGenAI, Modality } from "@google/genai";

export default function CocoVoice({ onClose }) {
  const [status, setStatus] = useState("Connecting...");

  const sessionRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const userTranscriptRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    async function startVoice() {
      try {
        // 1. Get temporary Gemini token
        const tokenResponse = await fetch("/api/gemini-token");
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.token) {
          throw new Error("Could not get Gemini token");
        }

        if (cancelled) return;

        // 2. Connect to Gemini Live
        const ai = new GoogleGenAI({
          apiKey: tokenData.token,
        });

        const session = await ai.live.connect({
          model: "gemini-3.1-flash-live-preview",

          config: {
            responseModalities: [Modality.AUDIO],

            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Leda",
                },
              },
            },

            systemInstruction: {
              parts: [
                {
                text: `
Your name is Coco.

You are NOT a generic AI assistant.
You are Coco, the AI assistant and digital member of our college community.

When someone asks:
"Who are you?"
"My name is Coco."
"Are you an AI?"
say that you are Coco, the college's AI assistant.

Always identify yourself as Coco.

Never introduce yourself as "Gemini", "Google Gemini", "an AI model",
"an AI language model", or simply "an AI assistant".

You are a female voice assistant.

You are part of the EIILM Kolkata-Jalpaiguri college community.
Speak naturally, warmly, confidently and conversationally.

When talking about the college, say "our college", "our campus",
"our teachers", "our students", etc.

Do not say "your college" when referring to the user's college.

If you don't know a specific college fact, honestly say that you
don't have that information yet. Never invent college information.

If the user asks "Can you hear me?" or "Can you listen to me?",
respond naturally: "Yes, I'm listening."

Keep your answers concise and natural for a real-time voice conversation.
`,
                },
              ],
            },

            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },

          callbacks: {
            onopen: () => {
              console.log("Gemini Live connected");
              setStatus("Listening...");
            },

        onmessage: (message) => {
  console.log("Gemini Live message:", message);

// Check what the user said
const userText =
  message.serverContent?.inputTranscription?.text || "";

if (userText) {
  console.log("User said:", userText);

  // Keep recent transcription chunks together
  userTranscriptRef.current += " " + userText;

  const command = userTranscriptRef.current
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  console.log("Full voice command:", command);

const stopCommands = [
  "coco turn off",
  "coco turnoff",
  "coco stop listening",
  "coco stop",
  "coco close",
  "stop listening coco",
  "stop coco",
  "stop listening",
  "turn off coco",
  "turn off",
];

const shouldStop = stopCommands.some(
  (phrase) => command.includes(phrase)
);

  if (shouldStop) {
    console.log("🛑 Coco stop command detected");

    userTranscriptRef.current = "";

    stopVoice();
    onClose?.();

    return;
  }

  // Prevent the transcript from growing forever
  if (userTranscriptRef.current.length > 100) {
    userTranscriptRef.current =
      userTranscriptRef.current.slice(-100);
  }
}

  // Play Coco's audio response
  const parts =
    message.serverContent?.modelTurn?.parts || [];

  for (const part of parts) {
    if (part.inlineData?.data) {
      playAudio(part.inlineData.data);
    }
  }
},

            onerror: (error) => {
              console.error("Gemini Live error:", error);
              setStatus("Connection error");
            },

            onclose: (event) => {
              console.log("Gemini Live closed:", event);
              setStatus("Voice mode closed");
            },
          },
        });

        sessionRef.current = session;

        // 3. Start microphone
        await startMicrophone(session);

      } catch (error) {
        console.error("Voice connection error:", error);
        setStatus("Could not connect");
      }
    }

    startVoice();

    return () => {
      cancelled = true;
      stopVoice();
    };
  }, []);

  // Convert Float32 microphone audio to 16-bit PCM
  function floatTo16BitPCM(float32Array) {
    const buffer = new Int16Array(float32Array.length);

    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      buffer[i] =
        sample < 0
          ? sample * 0x8000
          : sample * 0x7fff;
    }

    return buffer;
  }

  // Convert Int16Array to Base64
  function int16ToBase64(int16Array) {
    const bytes = new Uint8Array(int16Array.buffer);

    let binary = "";

    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(
        i,
        Math.min(i + chunkSize, bytes.length)
      );

      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  async function startMicrophone(session) {
    try {
      setStatus("Requesting microphone...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const audioContext = new AudioContext({
        sampleRate: 16000,
      });

      audioContextRef.current = audioContext;

      const microphone =
        audioContext.createMediaStreamSource(stream);

      const processor =
        audioContext.createScriptProcessor(4096, 1, 1);

      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (!sessionRef.current) return;

        const input =
          event.inputBuffer.getChannelData(0);

        const pcm = floatTo16BitPCM(input);

        const base64Audio =
          int16ToBase64(pcm);

        session.sendRealtimeInput({
          audio: {
            data: base64Audio,
            mimeType: "audio/pcm;rate=16000",
          },
        });
      };

      microphone.connect(processor);

      // Keep processor running without playing microphone audio
      const silentGain =
        audioContext.createGain();

      silentGain.gain.value = 0;

      processor.connect(silentGain);
      silentGain.connect(audioContext.destination);

      setStatus("Listening...");
    } catch (error) {
      console.error("Microphone error:", error);
      setStatus("Microphone permission denied");
    }
  }

  // Play Gemini's 24kHz PCM audio
  function playAudio(base64Audio) {
    try {
      let binary = atob(base64Audio);

      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const pcm = new Int16Array(bytes.buffer);

      const audioContext =
        audioContextRef.current ||
        new AudioContext({ sampleRate: 24000 });

      audioContextRef.current = audioContext;

      const audioBuffer =
        audioContext.createBuffer(
          1,
          pcm.length,
          24000
        );

      const channelData =
        audioBuffer.getChannelData(0);

      for (let i = 0; i < pcm.length; i++) {
        channelData[i] =
          pcm[i] / 32768;
      }

      const source =
        audioContext.createBufferSource();

      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      const currentTime =
        audioContext.currentTime;

      const startTime = Math.max(
        currentTime,
        nextPlayTimeRef.current
      );

      source.start(startTime);

      nextPlayTimeRef.current =
        startTime + audioBuffer.duration;

      setStatus("Coco is speaking...");
      
      source.onended = () => {
        if (
          audioContext.currentTime >=
          nextPlayTimeRef.current - 0.05
        ) {
          setStatus("Listening...");
        }
      };
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  }

function stopVoice() {
  console.log("Stopping Coco Voice...");

  // 1. Stop microphone immediately
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  }

  // 2. Stop audio processor
  if (processorRef.current) {
    processorRef.current.onaudioprocess = null;
    processorRef.current.disconnect();
    processorRef.current = null;
  }

  // 3. Close audio context
  if (audioContextRef.current) {
    audioContextRef.current.close().catch(() => {});
    audioContextRef.current = null;
  }

  // 4. Close Gemini Live session
  if (sessionRef.current) {
    sessionRef.current.close();
    sessionRef.current = null;
  }

  // 5. Reset audio timing
  nextPlayTimeRef.current = 0;
  userTranscriptRef.current = "";

  console.log("Coco Voice stopped completely.");
}

const closeVoice = () => {
  stopVoice();
  setStatus("Voice mode closed");
  onClose?.();
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">

        <div className="mb-6 text-6xl">
          🎙️
        </div>

        <h2 className="text-2xl font-semibold text-teal-800">
          Coco Voice Mode
        </h2>

        <p className="mt-3 text-teal-600">
          {status}
        </p>

        <button
          onClick={closeVoice}
          className="mt-8 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white"
        >
          Stop Listening
        </button>

      </div>
    </div>
  );
}