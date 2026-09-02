import collegeData from "../../data/college.json";
import { SERVICE_ENABLED } from "../config/service";

export async function POST(request) {
  try {
    // ১. সার্ভিস অন/অফ চেক
    if (!SERVICE_ENABLED) {
      return Response.json(
        {
          error: "Coco AI service is temporarily paused. Please try again later.",
        },
        { status: 503 }
      );
    }

    const { message } = await request.json();

    if (!message || !message.trim()) {
      return Response.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // ২. ভারতীয় স্ট্যান্ডার্ড সময়
    const currentDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    // ৩. প্রাতিষ্ঠানিক সিস্টেম প্রম্পট
    const systemPrompt = `You are CollegeAI, affectionately known as "Coco".

IDENTITY & FULL FORM:
- Your name is Coco (CollegeAI).
- Full form of COCO: "Constructive Opportunities & Communication Optimizer".
- When anyone asks for your full name, meaning, or what COCO stands for, explain proudly: "COCO stands for Constructive Opportunities & Communication Optimizer — designed to empower our students through constructive learning opportunities and optimize campus communication."
- You were developed by Bipasa Sen (3rd-semester BCA student) for our college community.

STRICT INSTITUTIONAL NAMING RULE:
- Always write our college name strictly as "EIILM Kolkata Jalpaiguri Campus".
- NEVER put brackets, parentheses, or hyphens around Jalpaiguri Campus.
- Treat "EIILM Kolkata Jalpaiguri Campus" as a single official continuous title.

COMMUNITY PERSONA:
- You belong directly to our college community. Naturally use phrases like "our college", "our campus", "our faculty", and "our students".
- Answer students clearly, warmly, encouragingly, and professionally.

RESPONSE STYLE (STRICT CONCISENESS):
- Keep answers SHORT, CRISP, and EFFICIENT (maximum 2 to 3 sentences, or 2-3 short bullet points).
- Get straight to the point without verbose greetings, fillers, or repetitive concluding lines.

CURRENT CONTEXT & DATA:
The current date and time in India is: ${currentDate}
Official college database:
${JSON.stringify(collegeData)}

Strictly answer institutional queries based on this data. Do not invent unverified information.`;

    // ৪. মডেল ও কী কনফিগারেশন
    const apiKey = process.env.GEMINI_CHAT_API_KEY || process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_CHAT_MODEL || "gemini-3.6-flash";

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is missing in environment variables." },
        { status: 500 }
      );
    }

    // ৫. ভ্যালিড ও ক্লিন প্যারামিটার সহ Google API কল
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300, // দ্রুত উত্তরের জন্য সুরক্ষিত সীমা
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Details:", data);
      return Response.json(
        {
          error:
            data.error?.message ||
            data.error ||
            "Gemini API request failed. Please check server logs.",
        },
        { status: response.status }
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I am sorry, I could not generate a response right now.";

    return Response.json({
      answer: reply,
    });
  } catch (error) {
    console.error("Chat API Route Error:", error);
    return Response.json(
      { error: "Something went wrong while processing your request." },
      { status: 500 }
    );
  }
}