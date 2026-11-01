"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { id: "top", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
  { id: "about", label: "About" },
];

export default function Navbar() {
  const [active, setActive] = useState("top");

  // Highlights the link of the section you are currently looking at
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <a href="#top" className="flex items-center gap-2.5" aria-label="OfferShield home">
          <Logo className="h-9 w-9" />
          <span className="font-heading text-lg font-extrabold tracking-tight text-snow">
            Offer<span className="text-brand-cyan">Shield</span>
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-6">
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`group relative block px-3 py-2 text-sm font-medium transition-colors ${
                    active === link.id ? "text-snow" : "text-mist hover:text-snow"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue transition-transform duration-300 ${
                      active === link.id
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#analyzer"
            className="btn-shine inline-flex h-10 items-center rounded-full bg-gradient-to-r from-brand-cyan to-brand-blue px-4 text-sm font-semibold text-ink-950 transition hover:shadow-lg hover:shadow-brand-cyan/25 active:scale-95 sm:px-5"
          >
            Check an Offer
          </a>
        </div>
      </nav>
    </header>
  );
}
