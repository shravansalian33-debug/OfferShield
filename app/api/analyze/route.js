
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are OfferShield, an expert recruitment fraud analyst protecting students from fake job and internship scams.

Analyze the job or internship message for:
- Registration fees, security deposits, or requests for money.
- Suspicious recruiter email addresses such as Gmail or Yahoo.
- Unrealistic salaries or stipends.
- Selection without interviews.
- Urgent payment demands.
- Fake company impersonation.
- Vague job descriptions or suspicious communication.

Return ONLY a valid JSON object using this exact structure:
{
  "trustScore": 25,
  "verdict": "High Risk",
  "redFlags": ["Specific warning sign"],
  "nextSteps": ["Action the student should take"]
}

Scoring rules:
- 0 to 39: High Risk
- 40 to 70: Suspicious
- 71 to 100: Likely Safe

A higher trustScore means greater trust. Never treat a high score as proof that a job is genuine.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { offerText } = body;

    if (
      !offerText ||
      typeof offerText !== "string" ||
      offerText.trim().length < 15
    ) {
      return NextResponse.json(
        {
          error:
            "Please paste a complete job or internship message (at least 15 characters).",
        },
        { status: 400 }
      );
    }

    // Connect to Ollama running locally on your Mac
    const serverUrl = (
      process.env.OLLAMA_SERVER_URL || "http://localhost:11434"
    ).replace(/\/$/, "");

    const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

    const ollamaResponse = await fetch(`${serverUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        system: SYSTEM_PROMPT,
        prompt: `Analyze this job or internship offer and return the JSON result only:\n\n${offerText.trim()}`,
        format: "json",
        stream: false,
        options: {
          temperature: 0.1,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();

      console.error("Ollama Error:", errorText);

      return NextResponse.json(
        {
          error:
            "Could not get a response from Ollama. Check whether Ollama is running and the model is installed.",
        },
        { status: 502 }
      );
    }

    const data = await ollamaResponse.json();
    const rawOutput = data.response || "";

    let parsedResult;

    try {
      parsedResult = JSON.parse(rawOutput);
    } catch (error) {
      console.error("AI JSON Error:", rawOutput);

      return NextResponse.json(
        { error: "AI returned an invalid response. Please try again." },
        { status: 500 }
      );
    }

    // Validate and clean the AI result
    const rawScore = Number(parsedResult.trustScore);

    if (!Number.isFinite(rawScore)) {
      return NextResponse.json(
        { error: "AI did not return a valid trust score. Please try again." },
        { status: 500 }
      );
    }

    const trustScore = Math.max(
      0,
      Math.min(100, Math.round(rawScore))
    );

    let verdict = parsedResult.verdict;

    if (!["High Risk", "Suspicious", "Likely Safe"].includes(verdict)) {
      if (trustScore < 40) {
        verdict = "High Risk";
      } else if (trustScore <= 70) {
        verdict = "Suspicious";
      } else {
        verdict = "Likely Safe";
      }
    }

    const redFlags = Array.isArray(parsedResult.redFlags)
      ? parsedResult.redFlags.map(String)
      : ["No specific warning signs were provided by the AI."];

    const nextSteps = Array.isArray(parsedResult.nextSteps)
      ? parsedResult.nextSteps.map(String)
      : [
        "Verify the recruiter using the company's official website.",
        "Never pay money to secure a job or internship.",
      ];

    return NextResponse.json({
      trustScore,
      verdict,
      redFlags,
      nextSteps,
    });
  } catch (error) {
    console.error("OfferShield API Error:", error);

    return NextResponse.json(
      {
        error:
          "Could not connect to Ollama. Make sure the Ollama application is running on your Mac.",
      },
      { status: 500 }
    );
  }
}
