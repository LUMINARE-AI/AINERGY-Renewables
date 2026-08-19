import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="AINERGY home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="15.5" stroke="url(#ainergy-ring)" />
        <path
          d="M16 6L16 16L23.5 20.5"
          stroke="#2dd4c8"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16 6L9 20.5H23L16 6Z"
          stroke="#34d399"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="16" cy="16" r="2" fill="#34d399" />
        <defs>
          <linearGradient
            id="ainergy-ring"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#2dd4c8" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display text-[1.15rem] font-semibold tracking-tight text-offwhite-100">
        AINERGY
      </span>
    </Link>
  );
}
