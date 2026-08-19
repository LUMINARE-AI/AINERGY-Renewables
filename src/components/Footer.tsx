import Link from "next/link";
import { Linkedin, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";
import { FOOTER_LINKS, LEGAL_LINKS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-graphite-950">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-offwhite-300/60">
              AINERGY Renewable LLP designs, develops and operates renewable-energy
              infrastructure and intelligent energy solutions for Commercial &amp;
              Industrial businesses.
            </p>
            <p className="mt-6 font-mono-tag text-xs uppercase text-teal-400">
              The Energy OS for Business
            </p>
            <div className="mt-6 flex gap-3">
              {[Linkedin, Twitter, Youtube].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-offwhite-300/50"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono-tag text-xs uppercase text-offwhite-300/50">
              Navigate
            </h3>
            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-offwhite-200/80 transition-colors hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono-tag text-xs uppercase text-offwhite-300/50">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-offwhite-200/80 transition-colors hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-offwhite-300/50">
              hello@ainergy.in
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-offwhite-300/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} AINERGY Renewable LLP. All rights
            reserved.
          </p>
          <p>Registered as a Limited Liability Partnership in India.</p>
        </div>
      </Container>
    </footer>
  );
}
