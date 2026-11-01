
"use client";

import { useState, useEffect } from "react";

function ShieldMark() {
  return (
    <div className="shield-mark">
      <span>✓</span>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-symbol">{icon}</div>
      <div className="feature-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function AnalysisResults({ result }) {
  const score = Math.max(
    0,
    Math.min(100, Number(result.trustScore) || 0)
  );

  const riskClass =
    score < 40 ? "high" : score <= 70 ? "medium" : "safe";

  const verdictDescription =
    score < 40
      ? "Strong indicators of recruitment fraud detected. Do not send money or sensitive documents."
      : score <= 70
        ? "Proceed with caution. Important verification details may be missing or unusual."
        : "This offer appears to follow standard recruitment practices, but independent verification is still recommended.";

  const redFlags = Array.isArray(result.redFlags)
    ? result.redFlags
    : [];

  const nextSteps = Array.isArray(result.nextSteps)
    ? result.nextSteps
    : [];

  return (
    <section className="results-section">
      <div className="section-heading">
        <span className="eyebrow">AI ANALYSIS REPORT</span>
        <h2>Your Offer Analysis</h2>
        <p>
          Review the risk score and the reasons behind the assessment.
        </p>
      </div>

      <div className={`result-summary ${riskClass}`}>
        <div className="score-wrap">
          <div
            className="score-ring"
            style={{ "--score": `${score * 3.6}deg` }}
          >
            <div className="score-center">
              <strong>{score}</strong>
              <span>Trust Score</span>
            </div>
          </div>
        </div>

        <div className="verdict-copy">
          <span className="eyebrow">
            SECURITY ASSESSMENT VERDICT
          </span>
          <h3>{result.verdict || "Assessment Complete"}</h3>
          <p>{verdictDescription}</p>
        </div>
      </div>

      <div className="result-grid">
        <div className="result-detail">
          <h3>
            <span className="detail-icon warning">!</span>
            Red Flags &amp; Observations
          </h3>

          {redFlags.length > 0 ? (
            <ul>
              {redFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          ) : (
            <p>No specific red flags were returned by the analysis.</p>
          )}
        </div>

        <div className="result-detail">
          <h3>
            <span className="detail-icon positive">✓</span>
            Recommended Next Steps
          </h3>

          {nextSteps.length > 0 ? (
            <ul>
              {nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          ) : (
            <p>
              Verify the employer independently before proceeding.
            </p>
          )}
        </div>
      </div>

      <p className="disclaimer">
        AI-generated risk assessment only. This score is not proof
        that an offer is genuine or fraudulent. Always verify the
        employer through official channels.
      </p>
    </section>
  );
}

export default function HomePage() {
  const [offerText, setOfferText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [audioFile, setAudioFile] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceResult, setVoiceResult] = useState(null);

  // SETTINGS
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // LOAD SAVED THEME
  useEffect(() => {
    const savedTheme = localStorage.getItem("offershield-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    } else {
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  // CHANGE AND SAVE THEME
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("offershield-theme", newTheme);
  };

  // GLOWING CURSOR EFFECT
  useEffect(() => {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const handleMouseMove = (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      glow.remove();
    };
  }, []);

  // AI OFFER ANALYSIS
  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!offerText.trim()) {
      setError("Please paste a job or internship offer first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offerText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong during analysis."
        );
      }

      if (
        typeof data.trustScore !== "number" ||
        !Array.isArray(data.redFlags) ||
        !Array.isArray(data.nextSteps)
      ) {
        throw new Error(
          "The AI returned an unexpected response format."
        );
      }

      setResult(data);

      setTimeout(() => {
        document
          .getElementById("analysis-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the analysis server."
      );
    } finally {
      setLoading(false);
    }
  };

  // VOICE ANALYSIS
  const handleVoiceAnalyze = async () => {
    if (!audioFile) {
      setVoiceError("Please select an audio recording.");
      return;
    }

    setVoiceLoading(true);
    setVoiceError("");
    setVoiceResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch(
        "/api/analyze/analyze-voice",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Voice analysis failed.");
      }

      setVoiceResult(data);
    } catch (err) {
      setVoiceError(
        err.message || "Unable to analyse recording."
      );
    } finally {
      setVoiceLoading(false);
    }
  };

  // CLEAR OFFER
  const handleClear = () => {
    setOfferText("");
    setResult(null);
    setError("");
  };

  const firstPart = "Offer".split("");
  const secondPart = "Shield".split("");

  return (
    <main className="page-shell">
      <div className="ambient-glow glow-left" />
      <div className="ambient-glow glow-right" />

      <div className="digital-globe">
        <div className="globe-lines" />
      </div>

      <div className="wave-decoration" />

      {/* HEADER */}
      <header className="topbar">
        <div className="brand">
          <ShieldMark />
          <span>
            Offer<span className="brand-accent">Shield</span>
          </span>
        </div>

        <button
          type="button"
          className="settings-button"
          aria-label="Settings"
          title="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <span className="settings-icon">⚙</span>
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-logo-orbit">
          <div className="hero-orbit orbit-a" />
          <div className="hero-orbit orbit-b" />
          <ShieldMark />
        </div>

        <p className="brand-kicker">
          RECRUITMENT SAFETY COMPANION
        </p>

        <h1 className="hero-title">
          {firstPart.map((letter, index) => (
            <span className="letter-3d" key={`white-${index}`}>
              {letter}
            </span>
          ))}

          {secondPart.map((letter, index) => (
            <span
              className="letter-3d blue-letter"
              key={`blue-${index}`}
            >
              {letter}
            </span>
          ))}
        </h1>

        <p className="hero-subtitle">
          Analyse job and internship offers. Detect scams, fee traps,
          and phishing attempts before you take the next step.
        </p>

        <div className="trust-points">
          <span><b>◇</b> Scam Detection</span>
          <span><b>ϟ</b> Instant Analysis</span>
          <span><b>⌑</b> Safer Decisions</span>
        </div>
      </section>

      {/* OFFER ANALYZER */}
      <section className="analyzer-section">
        <div className="analyzer-panel">
          <form onSubmit={handleAnalyze}>
            <div className="panel-heading">
              <label htmlFor="offer-input">
                <span className="input-symbol">▤</span>
                Job / Internship Message, Email, or WhatsApp Text
              </label>
            </div>

            <textarea
              id="offer-input"
              rows={7}
              maxLength={12000}
              value={offerText}
              onChange={(event) =>
                setOfferText(event.target.value)
              }
              placeholder="Paste the complete email, WhatsApp message, or offer letter text here..."
              required
            />

            <div className="input-meta">
              <span>
                {offerText.length.toLocaleString()} / 12,000 characters
              </span>
              <span>
                Do not paste passwords, OTPs, or bank details.
              </span>
            </div>

            {error && (
              <div className="error-message" role="alert">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="analyze-button"
              disabled={loading || !offerText.trim()}
            >
              {loading ? (
                <>
                  <span className="search-symbol">⟳</span>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <span className="search-symbol">⌕</span>
                  Analyze Offer
                  <span className="arrow-symbol">→</span>
                </>
              )}
            </button>

            {offerText.trim() && (
              <button
                type="button"
                className="clear-button"
                onClick={handleClear}
              >
                Clear message
              </button>
            )}
          </form>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="features-section">
        <FeatureCard
          icon="⌕"
          title="Risk Analysis"
          description="Identify suspicious words, payment requests, and unusual recruitment patterns."
        />

        <FeatureCard
          icon="◎"
          title="Evidence Check"
          description="Understand the warning signs found in the job or internship message."
        />

        <FeatureCard
          icon="✓"
          title="Safety Guide"
          description="Get practical next steps to help you make safer recruitment decisions."
        />
      </section>

      {/* VOICE RISK IDENTIFIER */}
      <section className="voice-section">
        <div className="section-heading">
          <span className="eyebrow">NEW AI FEATURE</span>
          <h2>Voice Risk Identifier</h2>
          <p>
            Upload a recruiter call recording and detect suspicious
            statements using AI.
          </p>
        </div>

        <div className="voice-panel">
          <div className="voice-icon">🎙️</div>

          <h3>Analyse a Recruitment Call</h3>

          <p>
            Upload an audio recording in WAV, MP3, or another supported
            audio format.
          </p>

          <input
            type="file"
            accept="audio/*"
            onChange={(event) => {
              setAudioFile(event.target.files?.[0] || null);
              setVoiceError("");
              setVoiceResult(null);
            }}
          />

          {audioFile && (
            <p className="voice-file">
              Selected: {audioFile.name}
            </p>
          )}

          {voiceError && (
            <p className="error-message">{voiceError}</p>
          )}

          <button
            type="button"
            className="analyze-button"
            onClick={handleVoiceAnalyze}
            disabled={voiceLoading || !audioFile}
          >
            {voiceLoading
              ? "Analysing Recording..."
              : "Analyse Voice Recording →"}
          </button>

          {voiceResult && (
            <div className="voice-results">
              <h3>Voice Analysis Report</h3>

              <p>
                <strong>Trust Score:</strong>{" "}
                {voiceResult.trustScore}/100
              </p>

              <p>
                <strong>Verdict:</strong> {voiceResult.verdict}
              </p>

              <h4>Transcribed Conversation</h4>
              <p>{voiceResult.transcript}</p>

              <h4>Red Flags</h4>
              <ul>
                {(Array.isArray(voiceResult.redFlags)
                  ? voiceResult.redFlags
                  : []
                ).map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>

              <h4>Recommended Next Steps</h4>
              <ul>
                {(Array.isArray(voiceResult.nextSteps)
                  ? voiceResult.nextSteps
                  : []
                ).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ANALYSIS RESULTS */}
      {result && (
        <div id="analysis-results">
          <AnalysisResults result={result} />
        </div>
      )}

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-heading">
          <span className="eyebrow">SIMPLE AND QUICK</span>
          <h2>How It Works</h2>
          <p>Three simple steps to analyse a recruitment offer.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <h3>Paste Your Offer</h3>
            <p>
              Copy and paste the job or internship message into
              the analysis box.
            </p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>AI Checks the Message</h3>
            <p>
              Our AI analyses the message for suspicious patterns
              and possible recruitment scam indicators.
            </p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Review Your Results</h3>
            <p>
              See the trust score, warning signs, and recommended
              safety steps.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span>
          Built by <strong>Team Bitbusters</strong> · SMVITM
        </span>
        <span>OfferShield · Recruitment Safety Companion</span>
      </footer>

      {/* SETTINGS POPUP */}
      {settingsOpen && (
        <div
          className="settings-overlay"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="settings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-modal-header">
              <div>
                <span className="eyebrow">PREFERENCES</span>
                <h2 id="settings-title">Settings</h2>
              </div>

              <button
                type="button"
                className="settings-close"
                aria-label="Close settings"
                onClick={() => setSettingsOpen(false)}
              >
                ×
              </button>
            </div>

            {/* THEME */}
            <section className="settings-section">
              <h3>Appearance</h3>
              <p>Choose how OfferShield looks on your device.</p>

              <div className="theme-options">
                <button
                  type="button"
                  className={`theme-option ${theme === "dark" ? "selected" : ""
                    }`}
                  onClick={() => changeTheme("dark")}
                  aria-pressed={theme === "dark"}
                >
                  <span className="theme-preview dark-preview">☾</span>
                  <span>Dark Mode</span>
                  {theme === "dark" && (
                    <span className="theme-check">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  className={`theme-option ${theme === "light" ? "selected" : ""
                    }`}
                  onClick={() => changeTheme("light")}
                  aria-pressed={theme === "light"}
                >
                  <span className="theme-preview light-preview">☀</span>
                  <span>Light Mode</span>
                  {theme === "light" && (
                    <span className="theme-check">✓</span>
                  )}
                </button>
              </div>
            </section>

            {/* ABOUT */}
            <section className="settings-section about-section">
              <h3>About OfferShield</h3>
              <p>
                OfferShield is an AI-powered recruitment safety
                companion designed to help students and job seekers
                identify suspicious job and internship offers.
              </p>

              <div className="about-details">
                <div>
                  <span>Developed by</span>
                  <strong>Team Bitbusters</strong>
                </div>

                <div>
                  <span>Institution</span>
                  <strong>SMVITM</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>AI &amp; Cybersecurity</strong>
                </div>

                <div>
                  <span>Version</span>
                  <strong>1.0</strong>
                </div>

                <div>
                  <span>Platform</span>
                  <strong>Web Application</strong>
                </div>
              </div>

              <p className="about-note">
                Our mission is to encourage safer recruitment
                decisions through awareness and AI-assisted analysis.
              </p>
            </section>

            <button
              type="button"
              className="settings-done-button"
              onClick={() => setSettingsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
