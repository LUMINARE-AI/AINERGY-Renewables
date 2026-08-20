"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-1.5 text-sm text-offwhite-300/70 transition-colors hover:text-current-300"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
