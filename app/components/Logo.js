// OfferShield logo mark: a shield (protection) containing a circuit-style
// checkmark (verification + digital/AI element).
// Usage: <Logo className="h-9 w-9" />

export default function Logo({ className = "h-9 w-9", title = "OfferShield logo" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="os-stroke" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="os-fill" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#12204A" />
          <stop offset="1" stopColor="#0A1230" />
        </linearGradient>
      </defs>

      {/* Shield */}
      <path
        d="M32 4 56 13v18c0 14-10 24-24 29C18 55 8 45 8 31V13L32 4Z"
        fill="url(#os-fill)"
        stroke="url(#os-stroke)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Circuit-style checkmark */}
      <path
        d="M20 33.5 28 41.5 44 24"
        stroke="url(#os-stroke)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Small "digital node" dots */}
      <circle cx="44" cy="24" r="3.2" fill="#22D3EE" />
      <circle cx="20" cy="33.5" r="2.2" fill="#3B82F6" />
    </svg>
  );
}
