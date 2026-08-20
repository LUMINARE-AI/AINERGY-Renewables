import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

/** Server-only helper for pages under the (app) route group. Middleware
 * already redirects unauthenticated requests away from these routes; this
 * is the defensive fallback plus the typed session/org id pages need. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}
