"use client";

import { useState } from "react";

const SAMPLE_SCAM = `Congratulations Dear Candidate! 🎉
Your resume has been shortlisted for the AICTE-approved Data Science & AI Internship at TechNova Global Solutions.
Stipend: ₹25,000/month (Work From Home, 2 hours/day, no interview required).
To confirm your offer letter and portal access ID, you must pay a one-time refundable Security & Documentation Fee of ₹1,499 via UPI to hr.technovaglobal@okaxis before 6:00 PM today. Send the payment screenshot on WhatsApp to +91-9876543210 immediately to avoid cancellation.`;

const SAMPLE_SAFE = `Dear Candidate,
Thank you for completing the technical coding assessment and virtual panel interview with our engineering team on Wednesday.
We are pleased to offer you the Software Engineering Intern position for the Summer cohort. Your internship will run for 12 weeks at our Bengaluru office with a monthly stipend of ₹30,000.
Please review the attached official offer document sent from careers@companydomain.com and sign it via our candidate portal within 5 business days. No fees or deposits are required at any stage of our hiring process.`;

export default function HomePage() {
  const [offerText, setOfferText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!offerText.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong during analysis.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic color styling based on the <40 (Red), 40-70 (Yellow), >70 (Green) rule
  const getScoreTheme = (score) => {
    if (score < 40) {
      return {
        ring: "border-red-500 text-red-400 shadow-red-500/20",
        badge: "bg-red-500/15 text-red-400 border-red-500/30",
        glow: "from-red-500/10 to-transparent",
      };
    }
    if (score <= 70) {
      return {
        ring: "border-amber-400 text-amber-300 shadow-amber-500/20",
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        glow: "from-amber-500/10 to-transparent",
      };
    }
    return {
      ring: "border-emerald-500 text-emerald-400 shadow-emerald-500/20",
      badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      glow: "from-emerald-500/10 to-transparent",
    };
  };

  const theme = result ? getScoreTheme(result.trustScore) : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10 md:py-16 selection:bg-cyan-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            100% Stateless • Self-Hosted LLM • Zero Data Egress
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            OfferShield
          </h1>

          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Paste any suspicious internship or job offer below. Our sovereign AI engine detects recruitment scams, fee traps, and phishing patterns in seconds.
          </p>
        </header>

        {/* Input Card */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 md:p-7 shadow-xl backdrop-blur">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="offer-input" className="text-sm font-semibold text-slate-300">
                Job / Internship Message, Email, or WhatsApp Text
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setOfferText(SAMPLE_SCAM)}
                  className="px-2.5 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition"
                >
                  Load Scam Sample
                </button>
                <button
                  type="button"
                  onClick={() => setOfferText(SAMPLE_SAFE)}
                  className="px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition"
                >
                  Load Safe Sample
                </button>
                {offerText && (
                  <button
                    type="button"
                    onClick={() => {
                      setOfferText("");
                      setResult(null);
                      setError("");
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              id="offer-input"
              rows={7}
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
              placeholder="Paste the complete email, WhatsApp message, or offer letter text here..."
              className="w-full rounded-xl bg-slate-950/90 border border-slate-800 p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500 transition resize-y text-sm md:text-base"
              required
            />

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !offerText.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Analyzing with Self-Hosted AI...</span>
                </>
              ) : (
                <span>Analyze Offer</span>
              )}
            </button>
          </form>
        </section>

        {/* Results Section (Only visible after analysis) */}
        {result && theme && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Score & Verdict Banner */}
            <div
              className={`bg-gradient-to-br ${theme.glow} bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 md:gap-8 shadow-xl`}
            >
              {/* Trust Score Circle */}
              <div
                className={`w-32 h-32 md:w-36 md:h-36 rounded-full border-8 flex flex-col items-center justify-center shrink-0 shadow-2xl bg-slate-950 ${theme.ring}`}
              >
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  {result.trustScore}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-slate-400 mt-1">
                  Trust Score
                </span>
              </div>

              {/* Verdict Info */}
              <div className="text-center sm:text-left space-y-2">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Security Assessment Verdict
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-lg md:text-xl font-bold border ${theme.badge}`}
                  >
                    {result.verdict}
                  </span>
                </div>
                <p className="text-slate-400 text-sm pt-1">
                  {result.trustScore < 40
                    ? "Strong indicators of recruitment fraud detected. Do not send money or sensitive documents."
                    : result.trustScore <= 70
                    ? "Proceed with caution. Important verification details are missing or unusual."
                    : "This offer follows standard recruitment practices, though basic verification is always recommended."}
                </p>
              </div>
            </div>

            {/* Red Flags & Next Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Red Flags Card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span>🚩</span> Red Flags & Observations
                </h2>
                <ul className="space-y-3 text-sm md:text-base text-slate-300">
                  {result.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-3 leading-relaxed">
                      <span className="select-none mt-0.5">🚩</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps Card */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <span>✅</span> Recommended Next Steps
                </h2>
                <ul className="space-y-3 text-sm md:text-base text-slate-300">
                  {result.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 leading-relaxed">
                      <span className="select-none mt-0.5">✅</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 pt-4">
          Built by <span className="text-slate-400 font-medium">Team Bitbusters</span> (SMVITM) • OfferShield stores zero user messages.
        </footer>
      </div>
    </main>
  );
}