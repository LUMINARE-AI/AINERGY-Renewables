import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ReportView } from "@/components/copilot/ReportView";

export const metadata: Metadata = {
  title: "Energy report",
  description: "A saved Open Access comparison from the AINERGY Energy Procure Copilot.",
  robots: { index: false, follow: false },
};

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;

  return (
    <section className="relative overflow-hidden bg-paper-50 pb-24 pt-28 lg:pb-32 lg:pt-32">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <div className="paper-grain" />
      <Container className="relative z-10 max-w-4xl">
        <ReportView reportId={reportId} />
      </Container>
    </section>
  );
}
