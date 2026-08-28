import Link from "next/link";
import { Linkedin, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Container } from "@/components/ui/Container";
import { FOOTER_LINKS, LEGAL_LINKS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-ink-900/8 bg-white">
      <Container className="pt-12 pb-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
              AINERGY Renewable LLP designs, develops and operates renewable-energy
              infrastructure and intelligent energy solutions for Commercial &amp;
              Industrial businesses.
            </p>
            <p className="mt-4 font-mono-tag text-xs uppercase text-current-600">
              The Energy OS for C&amp;I
            </p>
            <div className="mt-4 flex gap-3">
              {[Linkedin, Twitter, Youtube].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 text-ink-500 transition-colors hover:border-current-400/40 hover:bg-current-400/5 hover:text-current-600"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono-tag text-xs uppercase tracking-wide text-ink-500">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-700 transition-colors hover:text-current-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono-tag text-xs uppercase tracking-wide text-ink-500">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-700 transition-colors hover:text-current-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@ainergy.in"
              className="mt-4 inline-block text-sm text-ink-600 transition-colors hover:text-current-600"
            >
              hello@ainergy.in
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-ink-900/8 pt-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
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
