"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/** Session client for authenticated app routes only — avoids polling /api/auth/session on public pages. */
export function AppSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  );
}
