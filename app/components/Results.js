"use client";

import { useEffect, useState } from "react";
import { IconWarn, IconCheck, IconInfo } from "./Icons";

// Colours and wording for each risk level
const THEMES = {
  "High Risk": {
    text: "text-risk-high",
    color: "#f87171",
    badge: "border-risk-high/30 bg-risk-high/10 text-risk-high",
    glow: "from-risk-high/15",
    summary: "Strong signs of recruitment fraud. Do not send money or personal documents.",
    safe: false,
  },
  Suspicious: {
    text: "text-risk-mid",
    color: "#fbbf24",
    badge: "border-risk-mid/30 bg-risk-mid/10 text-risk-mid",
    glow: "from-risk-mid/15",
    summary: "Proceed with caution. Important details are missing or unusual.",
    safe: false,
  },
  "Likely Safe": {
    text: "text-risk-safe",
    color: "#34d399",
    badge: "border-risk-safe/30 bg-risk-safe/10 text-risk-safe",
    glow: "from-risk-safe/15",
    summary: "This looks like a standard recruitment message, but always verify independently.",
    safe: true,
  },
};

function pickTheme(result) {
  if (THEMES[result.verdict]) return THEMES[result.verdict];
  if (result.trustScore < 40) return THEMES["High Risk"];
  if (result.trustScore <= 70) return THEMES.Suspicious;
  return THEMES["Likely Safe"];
}

// Circular progress ring with a counting number
function ScoreRing({ score, color }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 1400;
    let start = null;
    let frame;

    const tick = (time) => {
      if (start === null) start = time;
      const progress = duration === 0 ? 1 : Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // starts fast, ends slow
      setDisplay(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - display / 100);

  return (
    <div
      className="relative h-44 w-44 shrink-0 sm:h-48 sm:w-48"
      role="img"
      aria-label={`Trust score ${score} out of 100`}
    >
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-5xl font-extrabold tracking-tight text-snow">
          {display}
        </span>
        <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-mist">
          Trust score
        </span>
      </div>
    </div>
  );
}

export default function Results({ result }) {
  const theme = pickTheme(result);
  const redFlags = Array.isArray(result.redFlags) ? result.redFlags : [];
  const nextSteps = Array.isArray(result.nextSteps) ? result.nextSteps : [];
  const FlagIcon = theme.safe ? IconInfo : IconWarn;

  return (
    <div className="space-y-5">
      {/* Score + verdict */}
      <div
        className={`animate-pop-in flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-br ${theme.glow} via-ink-900/80 to-ink-900/80 p-6 sm:flex-row sm:gap-10 sm:p-8`}
      >
        <ScoreRing score={result.trustScore} color={theme.color} />

        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-mist">
            Risk verdict
          </p>
          <span
            className={`mt-3 inline-block rounded-full border px-5 py-1.5 font-heading text-xl font-bold sm:text-2xl ${theme.badge}`}
          >
            {result.verdict}
          </span>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mist sm:text-base">
            {theme.summary}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Red flags */}
        <div
          className="animate-pop-in rounded-3xl border border-white/10 bg-ink-900/70 p-6"
          style={{ "--delay": "150ms" }}
        >
          <h3 className="flex items-center gap-2.5 font-heading text-lg font-bold text-snow">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ${theme.safe ? "text-brand-cyan" : "text-risk-high"}`}>
              <FlagIcon className="h-5 w-5" />
            </span>
            Red flags &amp; observations
          </h3>
          <ul className="mt-5 space-y-3">
            {redFlags.map((flag, i) => (
              <li
                key={i}
                className="animate-fade-up flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 text-sm leading-relaxed text-snow/90"
                style={{ "--delay": `${350 + i * 140}ms` }}
              >
                <FlagIcon
                  className={`mt-0.5 h-5 w-5 shrink-0 ${theme.safe ? "text-brand-cyan" : "text-risk-high"}`}
                />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next steps */}
        <div
          className="animate-pop-in rounded-3xl border border-white/10 bg-ink-900/70 p-6"
          style={{ "--delay": "250ms" }}
        >
          <h3 className="flex items-center gap-2.5 font-heading text-lg font-bold text-snow">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-brand-cyan">
              <IconCheck className="h-5 w-5" />
            </span>
            Recommended next steps
          </h3>
          <ul className="mt-5 space-y-3">
            {nextSteps.map((step, i) => (
              <li
                key={i}
                className="animate-fade-up flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 text-sm leading-relaxed text-snow/90"
                style={{ "--delay": `${450 + i * 140}ms` }}
              >
                <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-cyan" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="px-2 text-center text-xs leading-relaxed text-mist">
        This is an AI estimate, not a guarantee. Always verify the recruiter and company yourself.
      </p>
    </div>
  );
}
