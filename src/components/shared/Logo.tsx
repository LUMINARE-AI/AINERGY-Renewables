import Link from "next/link";

export function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
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
          stroke="#D98A1E"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16 6L9 20.5H23L16 6Z"
          stroke="#155A40"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="16" cy="16" r="2" fill="#D98A1E" />
        <defs>
          <linearGradient
            id="ainergy-ring"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F0A93E" />
            <stop offset="1" stopColor="#155A40" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`font-display text-[1.15rem] font-semibold tracking-tight ${
          tone === "dark" ? "text-offwhite-100" : "text-ink-900"
        }`}
      >
        AINERGY
      </span>
    </Link>
  );
}
