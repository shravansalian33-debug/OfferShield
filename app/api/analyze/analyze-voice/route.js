
import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

const execFileAsync = promisify(execFile);

export async function POST(request) {
    let tempDir;

    try {
        // 1. Receive uploaded audio
        const formData = await request.formData();
        const audio = formData.get("audio");

        if (!audio || typeof audio.arrayBuffer !== "function") {
            return NextResponse.json(
                { error: "Please upload an audio recording." },
                { status: 400 }
            );
        }

        if (audio.size === 0 || audio.size > 20 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Audio must be between 1 byte and 20 MB." },
                { status: 400 }
            );
        }

        // 2. Check Whisper model
        const modelPath = path.join(
            process.cwd(),
            "models",
            "ggml-base.en.bin"
        );

        await fs.access(modelPath);

        // 3. Create temporary folder
        tempDir = await fs.mkdtemp(
            path.join(os.tmpdir(), "offershield-")
        );

        // 4. Save uploaded audio
        const extension = path.extname(audio.name || "").toLowerCase();

        const allowedExtensions = [
            ".wav",
            ".mp3",
            ".m4a",
            ".webm",
            ".mp4"
        ];

        const safeExtension = allowedExtensions.includes(extension)
            ? extension
            : ".wav";

        // Keep original and converted files separate
        const audioPath = path.join(
            tempDir,
            `uploaded${safeExtension}`
        );

        const wavPath = path.join(
            tempDir,
            "recording.wav"
        );

        const audioBuffer = Buffer.from(
            await audio.arrayBuffer()
        );

        await fs.writeFile(audioPath, audioBuffer);

        // 5. Convert uploaded audio into WAV
        await execFileAsync(
            "ffmpeg",
            [
                "-y",
                "-i", audioPath,
                "-ar", "16000",
                "-ac", "1",
                "-c:a", "pcm_s16le",
                wavPath
            ],
            {
                timeout: 120000,
                maxBuffer: 5 * 1024 * 1024
            }
        );

        // 6. Check converted WAV file
        const wavStats = await fs.stat(wavPath);

        if (wavStats.size === 0) {
            throw new Error("Audio conversion failed. Please try again.");
        }

        // 7. Transcribe audio using Whisper
        const { stdout } = await execFileAsync(
            "whisper-cli",
            [
                "-m", modelPath,
                "-f", wavPath,
                "-nt"
            ],
            {
                timeout: 120000,
                maxBuffer: 5 * 1024 * 1024
            }
        );

        const transcript = stdout.trim();

        if (!transcript) {
            return NextResponse.json(
                {
                    error: "No speech detected. Please upload a clearer recording."
                },
                { status: 422 }
            );
        }

        // 8. Analyse transcript using Ollama
        const ollamaUrl =
            process.env.OLLAMA_SERVER_URL || "http://localhost:11434";

        const model =
            process.env.OLLAMA_MODEL || "llama3.2:3b";

        const prompt = `
You are OfferShield, an AI recruitment scam detection assistant.

Analyse this recruitment phone call transcript.

Look for:
- Registration or interview fees
- Requests for money
- Urgent payment demands
- Unrealistic salary promises
- Immediate selection without a proper interview
- Requests for OTP, passwords or bank details
- Threats and pressure tactics
- Suspicious recruitment practices

Return ONLY valid JSON in this exact structure:

{
  "trustScore": 20,
  "verdict": "High Risk",
  "redFlags": ["Explain the suspicious statement"],
  "nextSteps": ["Explain what the user should do"]
}

Score meanings:
0-39: High Risk
40-70: Suspicious
71-100: Likely Safe

Do not claim that the speaker or company identity has been verified.
If evidence is insufficient, explain that in the result.

TRANSCRIPT:
${transcript}
`;

        const aiResponse = await fetch(
            `${ollamaUrl}/api/generate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    prompt,
                    stream: false,
                    format: "json",
                    options: {
                        temperature: 0.2
                    }
                }),
                signal: AbortSignal.timeout(120000)
            }
        );

        if (!aiResponse.ok) {
            throw new Error("Unable to connect to Ollama AI.");
        }

        const aiData = await aiResponse.json();

        if (!aiData.response) {
            throw new Error("Ollama returned an empty response.");
        }

        // 9. Parse AI response
        const result = JSON.parse(aiData.response);

        const trustScore = Math.max(
            0,
            Math.min(100, Number(result.trustScore) || 0)
        );

        return NextResponse.json({
            trustScore,
            verdict: result.verdict || "Assessment Complete",
            redFlags: Array.isArray(result.redFlags)
                ? result.redFlags
                : [],
            nextSteps: Array.isArray(result.nextSteps)
                ? result.nextSteps
                : [],
            transcript
        });

    } catch (error) {
        console.error("OfferShield voice analysis error:", error);

        return NextResponse.json(
            {
                error: error.message || "Voice analysis failed."
            },
            { status: 500 }
        );

    } finally {
        // 10. Delete temporary audio files
        if (tempDir) {
            await fs.rm(tempDir, {
                recursive: true,
                force: true
            });
        }
    }
}
