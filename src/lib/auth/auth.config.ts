// Request-gate half of the Auth.js config — no Prisma/bcrypt here. Imported
// by both proxy.ts and auth.ts (which adds the Credentials provider on top).

import type { NextAuthConfig } from "next-auth";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/facilities",
  "/analysis",
  "/scenarios",
  "/recommendation",
  "/settings",
];

export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isProtected = PROTECTED_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p));
      if (!isProtected) return true;
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
