"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { COPILOT_STILL_WAKING_MESSAGE, COPILOT_WAKING_MESSAGE, subscribeCopilotWaking } from "@/lib/api/copilotClient";

export function LoadingNote({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-ink-600" role="status">
      <span
        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current-500/30 border-t-current-600"
        aria-hidden
      />
      {label}
    </p>
  );
}

export function WakingNote({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl border border-gold-500/35 bg-gold-500/10 p-4 text-xs leading-relaxed text-ink-700"
      role="status"
    >
      <span
        className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-gold-600/25 border-t-gold-600"
        aria-hidden
      />
      <div className="min-w-0">
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-medium text-gold-600 underline underline-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function CopilotWakeBanner() {
  const [waking, setWaking] = useState(false);

  useEffect(() => subscribeCopilotWaking(setWaking), []);

  if (!waking) return null;

  return (
    <div className="mb-4">
      <WakingNote message={COPILOT_WAKING_MESSAGE} />
    </div>
  );
}

export function ErrorNote({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  if (message === COPILOT_STILL_WAKING_MESSAGE) {
    return <WakingNote message={message} onRetry={onRetry} />;
  }

  return (
    <div
      className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/5 p-4 text-xs leading-relaxed text-red-700"
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="min-w-0">
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-medium text-red-800 underline underline-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyNote({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-ink-900/15 bg-paper-100/60 px-4 py-6 text-center text-sm text-ink-500">
      {message}
    </p>
  );
}
