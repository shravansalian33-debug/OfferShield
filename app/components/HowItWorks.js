import Reveal from "./Reveal";
import { IconPaste, IconScan, IconReport } from "./Icons";

const STEPS = [
  {
    icon: IconPaste,
    title: "Paste the job offer",
    text: "Copy the email, WhatsApp or Telegram message and paste it into OfferShield.",
  },
  {
    icon: IconScan,
    title: "AI analyses the message",
    text: "The AI looks for fee requests, fake email domains, false urgency and other scam signs.",
  },
  {
    icon: IconReport,
    title: "Get your risk assessment",
    text: "See a trust score, the red flags found and clear steps to stay safe.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
              How it works
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-snow sm:text-4xl">
              Three steps to a safer decision
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 130}>
                <div className="group h-full rounded-3xl border border-white/10 bg-ink-900/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-cyan/30">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 text-brand-cyan transition group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-heading text-sm font-bold text-mist/60">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-bold text-snow">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
