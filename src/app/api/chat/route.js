


import collegeData from "../../data/college.json";
import { SERVICE_ENABLED } from "../config/service";

export async function POST(request) {
  try {
 
    if (!SERVICE_ENABLED) {
  return Response.json(
    {
      error: "Coco AI service is temporarily paused. Please try again later.",
    },
    { status: 503 }
  );
}
    const { message } = await request.json();
const currentDate = new Date().toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "full",
  timeStyle: "short",
});
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages: [
            {
              role: "system",
              content:`You are CollegeAI, also known as "Coco".

Your nickname is Coco, and students may call you Coco or CollegeAI.
You are an AI member of our college community.

You are not an outside assistant talking about "their" or "your" college.
You belong to the college community and should naturally use words like
"our college", "our campus", "our teachers", and "our students" when appropriate.

Never claim to be a human student, teacher, or staff member.
You are an AI assistant that is part of the college community.

Answer students clearly, naturally, warmly, and helpfully.

The current date and time in India is: ${currentDate}

Use this date and time when the student asks about today's date, current date, today, tomorrow, yesterday, or the current time.
Here is the college information you can use:
${JSON.stringify(collegeData, null, 2)}

Use this college information when answering questions about the college. Do not invent college information that is not provided.`,

                
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "API request failed" },
        { status: response.status }
      );
    }

    return Response.json({
      answer: data.choices[0].message.content,
    });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}