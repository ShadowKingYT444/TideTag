export function Logo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="tg-body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#54b0ff" />
          <stop offset="60%" stopColor="#1670f5" />
          <stop offset="100%" stopColor="#0e7c66" />
        </linearGradient>
        <linearGradient id="tg-wave" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#tg-body)" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <path
        d="M4 19 Q 8 15 12 19 T 20 19 T 28 19"
        fill="none"
        stroke="url(#tg-wave)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M4 24 Q 8 20 12 24 T 20 24 T 28 24"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="22" cy="10" r="2.2" fill="#fff" />
      <circle cx="22" cy="10" r="2.2" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}
