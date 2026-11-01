import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-900/40 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-left">
        <div className="max-w-sm">
          <div className="flex items-center justify-center gap-2.5 md:justify-start">
            <Logo className="h-9 w-9" />
            <span className="font-heading text-lg font-extrabold tracking-tight text-snow">
              Offer<span className="text-brand-cyan">Shield</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-mist">
            An AI-powered tool that helps students and job seekers spot fake job offers and
            internship scams before they lose money or share sensitive information.
          </p>
        </div>

        <div className="text-sm text-mist md:text-right">
          <p className="font-semibold text-snow">Built by Team Bitbusters</p>
          <p className="mt-1">SMVITM</p>
          <p className="mt-4 text-xs">Stay curious. Stay safe. Never pay to get hired.</p>
        </div>
      </div>
    </footer>
  );
}
