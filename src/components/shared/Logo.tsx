import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="AINERGY home"
      className={`group inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src="/logo.png"
        alt="AINERGY Renewables"
        width={1536}
        height={1024}
        priority
        unoptimized
        className="h-[4.5rem] w-auto sm:h-[5rem]"
        style={{ width: "auto" }}
      />
    </Link>
  );
}
