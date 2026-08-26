import { GoogleGenAI } from "@google/genai";
import collegeData from "../../data/college.json";

export async function GET() {
  try {
    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const collegeKnowledge = JSON.stringify(
      collegeData,
      null,
      2
    );

    const expireTime = new Date(
      Date.now() + 30 * 60 * 1000
    ).toISOString();

    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime,

        liveConnectConstraints: {
          model: "gemini-3.1-flash-live-preview",

          config: {
            responseModalities: ["AUDIO"],

            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Leda",
                },
              },
            },

            sessionResumption: {},

            systemInstruction: {
              parts: [
                {
                  text: `
You are Coco.

You are the AI assistant and digital member of
EIILM KOLKATA JALPAIGURI CAMPUS.

Here is the official college information available to you:

${collegeKnowledge}

IMPORTANT RULES:

- Your name is Coco.
- You are part of EIILM KOLKATA JALPAIGURI CAMPUS.
- Use the college information above when answering questions.
- When talking about the college, naturally say "our college"
  or "our campus".
- Never invent college information.
- If information is not available in the provided college data,
  say that you don't have that information yet.
- Never call yourself Gemini or Google Gemini.
- You are a female voice assistant.
- Speak naturally, warmly and briefly.
- If the user asks "Can you hear me?" or
  "Can you listen to me?", say:
  "Yes, I'm listening."

Your goal is to be a helpful voice assistant
for students of our college.
                  `,
                },
              ],
            },
          },
        },
      },
    });

    return Response.json({
      token: token.name,
    });

  } catch (error) {
    console.error("Gemini token error:", error);

    return Response.json(
      {
        error: "Failed to create Gemini token",
      },
      {
        status: 500,
      }
    );
  }
}