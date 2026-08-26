import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

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
            sessionResumption: {},
            responseModalities: ["AUDIO"],
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
      { error: "Failed to create Gemini token" },
      { status: 500 }
    );
  }
}