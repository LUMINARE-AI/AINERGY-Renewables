import { Mail, Building2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await requireSession();
  const organization = await db.organization.findUnique({
    where: { id: session.user.organizationId },
    include: { _count: { select: { users: true, facilities: true } } },
  });

  return (
    <section className="py-16 lg:py-20">
      <Container className="max-w-2xl">
        <SectionHeader eyebrow="Settings" title="Account" tone="dark" />

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-graphite-900/50 p-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-offwhite-300/45">
              <Mail className="h-3.5 w-3.5" /> Signed in as
            </p>
            <p className="mt-2 text-sm text-offwhite-100">{session.user.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-graphite-900/50 p-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-offwhite-300/45">
              <Building2 className="h-3.5 w-3.5" /> Organization
            </p>
            <p className="mt-2 text-sm text-offwhite-100">{organization?.name}</p>
            <p className="mt-1 text-xs text-offwhite-300/50">
              {organization?._count.users} user(s) · {organization?._count.facilities} facilit(y/ies)
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
