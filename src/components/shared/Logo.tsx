import Link from "next/link";
import Image from "next/image";

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
      className={`group inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src={tone === "dark" ? "/logo-light.png" : "/logo.png"}
        alt="AINERGY Renewables"
        width={392}
        height={304}
        priority
        unoptimized
        className="h-14 w-auto sm:h-16"
        style={{ width: "auto" }}
      />
    </Link>
  );
}
