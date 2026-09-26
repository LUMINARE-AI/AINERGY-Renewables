// Simple email/password auth (Auth.js v5, Credentials provider, JWT
// sessions). No adapter — Credentials + JWT doesn't need the standard
// Account/Session/VerificationToken tables, so the schema stays focused on
// this product's own domain models (User/Organization/...). Route-handler
// side only — see auth.config.ts for the request-gate half used by proxy.ts.

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      organizationId: string;
      email: string;
      name?: string | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.organizationId = (user as { organizationId: string }).organizationId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.organizationId = token.organizationId as string;
      return session;
    },
  },
});
