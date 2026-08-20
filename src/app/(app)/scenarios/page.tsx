import { redirect } from "next/navigation";

// Scenario comparison is rendered on each facility's own page (it's
// facility-scoped data) — this route just points there.
export default function ScenariosEntryPage() {
  redirect("/analysis");
}
