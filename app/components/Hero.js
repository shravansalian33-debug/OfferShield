import Logo from "./Logo";
import { IconArrow } from "./Icons";

// Floating labels around the shield (they show the kinds of signs we look for)
const CHIPS = [
  { label: "Fee request", pos: "top-8 -left-4 lg:-left-10", delay: "0ms" },
  { label: "Fake email domain", pos: "top-1/3 -right-4 lg:-right-12", delay: "900ms" },
  { label: "False urgency", pos: "bottom-10 left-2 lg:-left-6", delay: "1800ms" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background: soft moving light + subtle grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="animate-drift absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-blue/20 blur-3xl" />
        <div
          className="animate-drift absolute -right-20 top-40 h-72 w-72 rounded-full bg-brand-cyan/15 blur-3xl"
          style={{ "--delay": "-6s" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-28">
        {/* Text side */}
        <div className="text-center lg:text-left">
          <div
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand-cyan/25 bg-brand-cyan/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-cyan"
            style={{ "--delay": "0ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-risk-safe" />
            AI-powered recruitment safety
          </div>

          <h1
            className="animate-fade-up mt-6 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-snow sm:text-5xl lg:text-6xl"
            style={{ "--delay": "100ms" }}
          >
            Your Career Deserves a{" "}
            <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">
              Safer Start.
            </span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg lg:mx-0"
            style={{ "--delay": "220ms" }}
          >
            Analyse suspicious job and internship offers with AI. Identify warning
            signs before you trust them.
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
            style={{ "--delay": "340ms" }}
          >
            <a
              href="#analyzer"
              className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue px-7 text-base font-semibold text-ink-950 transition hover:shadow-lg hover:shadow-brand-cyan/25 active:scale-95"
            >
              Analyse an Offer
              <IconArrow className="h-5 w-5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-7 text-base font-semibold text-snow transition hover:border-brand-cyan/40 hover:bg-white/5 active:scale-95"
            >
              Learn How It Works
            </a>
          </div>

          <p
            className="animate-fade-up mt-6 text-sm text-mist"
            style={{ "--delay": "460ms" }}
          >
            Free to use. Your pasted messages are not saved by OfferShield.
          </p>
        </div>

        {/* Visual side: floating shield */}
        <div
          className="animate-pop-in relative mx-auto h-64 w-64 sm:h-80 sm:w-80 lg:h-[26rem] lg:w-[26rem]"
          style={{ "--delay": "250ms" }}
          aria-hidden="true"
        >
          <div className="absolute inset-10 rounded-full bg-brand-blue/25 blur-3xl" />
          <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-brand-cyan/25" />
          <div className="absolute inset-8 rounded-full border border-brand-blue/20" />
          <div className="absolute inset-16 rounded-full border border-white/5 bg-ink-900/60 backdrop-blur-sm" />

          <div className="animate-float absolute inset-0 flex items-center justify-center">
            <Logo className="h-28 w-28 drop-shadow-[0_12px_30px_rgba(59,130,246,0.35)] sm:h-36 sm:w-36 lg:h-44 lg:w-44" />
          </div>

          {CHIPS.map((chip) => (
            <div
              key={chip.label}
              className={`animate-float absolute hidden items-center gap-2 rounded-full border border-white/10 bg-ink-900/85 px-3 py-1.5 text-xs font-medium text-snow shadow-lg shadow-black/30 backdrop-blur sm:flex ${chip.pos}`}
              style={{ "--delay": chip.delay }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-risk-high" />
              {chip.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
