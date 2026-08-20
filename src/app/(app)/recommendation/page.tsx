import { redirect } from "next/navigation";

// The recommendation panel is rendered on each facility's own page (it's
// facility-scoped data) — this route just points there.
export default function RecommendationEntryPage() {
  redirect("/analysis");
}
