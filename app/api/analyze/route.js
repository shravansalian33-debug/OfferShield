import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are OfferShield, an elite cybersecurity and recruitment fraud analyst protecting university students from fake job and internship scams.

Analyze the user's job or internship offer message carefully for indicators of fraud, such as:
- Requests for upfront fees, registration charges, security deposits, or paid training/certificates
- Unofficial email domains (e.g., @gmail.com, @yahoo.com instead of corporate domains) or WhatsApp/Telegram-only recruitment
- Unrealistic stipends/salaries for minimal work or instant selection without a technical interview
- High-pressure urgency tactics ("pay within 2 hours to lock your seat")
- Vague job roles, poor grammar, or impersonation of well-known companies/AICTE/government initiatives

CRITICAL INSTRUCTION:
You MUST respond with ONLY a valid JSON object. Do NOT include markdown code blocks, introductions, or explanations outside the JSON.
Use this exact JSON schema:
{
  "trustScore": <number between 0 and 100>,
  "verdict": "<exact string: 'High Risk' | 'Suspicious' | 'Likely Safe'>",
  "redFlags": ["<specific red flag 1>", "<specific red flag 2>"],
  "nextSteps": ["<actionable step 1>", "<actionable step 2>"]
}

Scoring Rules:
- 0 to 39: "High Risk" (Clear scam indicators like asking for money or instant selection without interviews)
- 40 to 70: "Suspicious" (Missing verifiable details, unofficial contact channels, or vague terms)
- 71 to 100: "Likely Safe" (Professional tone, standard interview process, no financial demands, verifiable details)`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { offerText } = body;

    if (!offerText || typeof offerText !== "string" || offerText.trim().length < 15) {
      return NextResponse.json(
        { error: "Please paste a complete job or internship message (at least 15 characters)." },
        { status: 400 }
      );
    }

    const serverUrl = process.env.OLLAMA_SERVER_URL?.replace(/\/$/, "");
    const model = process.env.OLLAMA_MODEL || "llama3.2";

    if (!serverUrl) {
      return NextResponse.json(
        { error: "Server configuration missing: OLLAMA_SERVER_URL is not set in .env.local" },
        { status: 500 }
      );
    }

    // Call the remote self-hosted Ollama server (Zero Data Egress to commercial APIs)
    const ollamaResponse = await fetch(`${serverUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        system: SYSTEM_PROMPT,
        prompt: `Analyze the following job/internship offer message and return ONLY the JSON object:\n\n"""\n${offerText.trim()}\n"""`,
        stream: false,
        options: {
          temperature: 0.1, // Low temperature for consistent, structured output
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Remote LLM Error:", errorText);
      return NextResponse.json(
        { error: `Failed to reach remote AI server (${ollamaResponse.status}). Ensure your Ollama server is online.` },
        { status: 502 }
      );
    }

    const data = await ollamaResponse.json();
    const rawOutput = data.response || "";

    // Regex Extractor: Isolate the JSON object even if the LLM adds conversational wrapper text
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Unparseable LLM Output:", rawOutput);
      return NextResponse.json(
        { error: "The AI returned an unreadable format. Please click Analyze again." },
        { status: 500 }
      );
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr, "Raw match:", jsonMatch[0]);
      return NextResponse.json(
        { error: "Failed to parse AI analysis JSON. Please try again." },
        { status: 500 }
      );
    }

    // Normalize and sanitize fields so the frontend never crashes
    const rawScore = Number(parsedResult.trustScore);
    const trustScore = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(100, Math.round(rawScore)))
      : 50;

    let verdict = parsedResult.verdict;
    if (!["High Risk", "Suspicious", "Likely Safe"].includes(verdict)) {
      if (trustScore < 40) verdict = "High Risk";
      else if (trustScore <= 70) verdict = "Suspicious";
      else verdict = "Likely Safe";
    }

    const redFlags = Array.isArray(parsedResult.redFlags) && parsedResult.redFlags.length > 0
      ? parsedResult.redFlags.map(String)
      : trustScore > 70
      ? ["No obvious scam indicators detected in the provided text."]
      : ["Insufficient verifiable company or recruiter details provided."];

    const nextSteps = Array.isArray(parsedResult.nextSteps) && parsedResult.nextSteps.length > 0
      ? parsedResult.nextSteps.map(String)
      : [
          "Verify the recruiter's email domain matches the official company website.",
          "Never pay any money for registration, training, equipment, or offer letters.",
        ];

    return NextResponse.json({
      trustScore,
      verdict,
      redFlags,
      nextSteps,
    });
  } catch (error) {
    console.error("Analyze API Exception:", error);
    return NextResponse.json(
      { error: "Could not connect to the remote LLM server. Check your OLLAMA_SERVER_URL and network connection." },
      { status: 500 }
    );
  }
}
