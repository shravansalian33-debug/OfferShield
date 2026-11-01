"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import Results from "./Results";
import { IconWarn, Spinner } from "./Icons";

const SAMPLE_SCAM = `Congratulations Dear Candidate! 🎉
Your resume has been shortlisted for the AICTE-approved Data Science & AI Internship at TechNova Global Solutions.
Stipend: ₹25,000/month (Work From Home, 2 hours/day, no interview required).
To confirm your offer letter and portal access ID, you must pay a one-time refundable Security & Documentation Fee of ₹1,499 via UPI to hr.technovaglobal@okaxis before 6:00 PM today. Send the payment screenshot on WhatsApp to +91-9876543210 immediately to avoid cancellation.`;

const SAMPLE_SAFE = `Dear Candidate,
Thank you for completing the technical coding assessment and virtual panel interview with our engineering team on Wednesday.
We are pleased to offer you the Software Engineering Intern position for the Summer cohort. Your internship will run for 12 weeks at our Bengaluru office with a monthly stipend of ₹30,000.
Please review the attached official offer document sent from careers@companydomain.com and sign it via our candidate portal within 5 business days. No fees or deposits are required at any stage of our hiring process.`;

export default function Analyzer() {
  const [offerText, setOfferText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  // When a result arrives, glide down to it
  useEffect(() => {
    if (!result || !resultRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [result]);

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

  const handleClear = () => {
    setOfferText("");
    setResult(null);
    setError("");
  };

  return (
    <section id="analyzer" className="relative scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
              Offer analyser
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-snow sm:text-4xl">
              Paste the offer. See the risk.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-mist">
              Copy the email, WhatsApp or Telegram message you received and paste it below.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form
            onSubmit={handleAnalyze}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-8"
          >
            {/* Scanning light while the AI is working */}
            {loading && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="scan-beam h-1/3 w-full bg-gradient-to-b from-transparent via-brand-cyan/10 to-transparent" />
              </div>
            )}

            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="offer-input" className="font-heading text-base font-bold text-snow">
                Job / internship message
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOfferText(SAMPLE_SCAM)}
                  className="h-10 rounded-full border border-risk-high/30 bg-risk-high/10 px-4 text-sm font-medium text-risk-high transition hover:bg-risk-high/20 active:scale-95"
                >
                  Load Scam Sample
                </button>
                <button
                  type="button"
                  onClick={() => setOfferText(SAMPLE_SAFE)}
                  className="h-10 rounded-full border border-risk-safe/30 bg-risk-safe/10 px-4 text-sm font-medium text-risk-safe transition hover:bg-risk-safe/20 active:scale-95"
                >
                  Load Safe Sample
                </button>
                {offerText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-mist transition hover:bg-white/10 hover:text-snow active:scale-95"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Textarea with a glowing border when you type */}
            <div className="relative mt-4 rounded-2xl border border-white/10 transition focus-within:border-brand-cyan/60 focus-within:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]">
              <textarea
                id="offer-input"
                rows={8}
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                placeholder="Paste the complete email, WhatsApp message or offer letter here..."
                className="block w-full resize-y rounded-2xl bg-ink-950 p-4 text-base leading-relaxed text-snow placeholder:text-mist/60 focus:outline-none"
                required
              />
            </div>

            <div className="relative mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-mist">
              <span>{offerText.length} characters</span>
              <span>Never paste passwords, OTPs or bank details.</span>
            </div>

            {error && (
              <div
                role="alert"
                className="relative mt-4 flex items-start gap-3 rounded-xl border border-risk-high/30 bg-risk-high/10 p-4 text-sm text-risk-high"
              >
                <IconWarn className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !offerText.trim()}
              className="btn-shine relative mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-blue font-heading text-base font-bold text-ink-950 transition hover:shadow-lg hover:shadow-brand-cyan/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Analysing offer...</span>
                </>
              ) : (
                <span>Analyze Offer</span>
              )}
            </button>
          </form>
        </Reveal>

        {/* Results appear here */}
        <div ref={resultRef} className="mt-10 scroll-mt-24" aria-live="polite">
          {result && <Results result={result} />}
        </div>
      </div>
    </section>
  );
}
