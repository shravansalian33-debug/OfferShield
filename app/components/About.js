import Reveal from "./Reveal";
import { IconInfo } from "./Icons";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
              About
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-snow sm:text-4xl">
              Built to protect students
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-mist">
              Fake internships and job offers cost students money and trust every day. OfferShield
              makes recruitment safety simple, so anyone can spot the warning signs before it is
              too late.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 flex items-start gap-4 rounded-3xl border border-risk-mid/25 bg-risk-mid/[0.06] p-6 sm:p-7">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-risk-mid/15 text-risk-mid">
              <IconInfo className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-heading text-base font-bold text-snow">
                AI analysis is not a guarantee
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mist">
                OfferShield gives an estimate, not proof. Always check the company on its official
                website, confirm the recruiter&apos;s email domain, and never pay money to get a job
                or internship.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
