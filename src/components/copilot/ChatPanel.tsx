"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { chat, CopilotApiError, trimMessages } from "@/lib/api/copilotClient";
import { profileToBillContext } from "@/lib/copilot/profile";
import type { ChatMessage, EnergyProfile, LandedCostResult } from "@/lib/copilot/types";
import { EmptyNote, ErrorNote, LoadingNote } from "./ApiState";
import { LandedCostCard } from "./LandedCostCard";
import { MarkdownReply } from "./MarkdownReply";

type Turn = ChatMessage & { landedCost?: LandedCostResult | null; notes?: string[] };

function describeUpdate(item: unknown): string | null {
  if (typeof item === "string" && item.trim()) return item;
  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    for (const key of ["message", "note", "summary", "label"]) {
      if (typeof record[key] === "string" && record[key].trim()) return record[key];
    }
  }
  return null;
}

export function ChatPanel({ profile }: { profile: EnergyProfile }) {
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;
    if (content.length > 8000) {
      setError("Keep each message under 8,000 characters.");
      return;
    }

    const history = trimMessages([...messages.map(({ role, content: text }) => ({ role, content: text })), { role: "user" as const, content }]);
    setMessages((prev) => trimMessages([...prev, { role: "user", content }]));
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await chat({
        messages: history,
        billContext: profileToBillContext(profile),
      });
      const notes = (response.pendingTariffUpdates ?? []).map(describeUpdate).filter((note): note is string => Boolean(note));
      setMessages((prev) =>
        trimMessages([
          ...prev,
          {
            role: "assistant",
            content: response.reply,
            landedCost: response.landedCost,
            notes: notes.length ? notes : response.pendingTariffUpdates?.length ? ["The copilot flagged tariff updates to review."] : [],
          },
        ])
      );
    } catch (err) {
      setError(err instanceof CopilotApiError ? err.message : "The chat could not reply. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="flex h-[32rem] flex-col rounded-3xl border border-ink-900/10 bg-paper-50/90 shadow-premium lg:sticky lg:top-24">
      <div className="border-b border-ink-900/8 px-5 py-4">
        <p className="font-mono-tag text-[10px] uppercase text-current-600">Chat</p>
        <h2 className="mt-1 font-display text-xl text-ink-900">Ask the copilot</h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.length === 0 && !loading && (
          <EmptyNote message="Ask about open access, captive, or the bill you just shared." />
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-8" : ""}>
            <div
              className={
                message.role === "user"
                  ? "rounded-2xl rounded-br-sm bg-ink-900 px-3.5 py-2.5 text-sm text-paper-50"
                  : "rounded-2xl rounded-bl-sm border border-ink-900/10 bg-white px-3.5 py-2.5"
              }
            >
              {message.role === "assistant" ? (
                <MarkdownReply text={message.content} />
              ) : (
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              )}
            </div>
            {message.landedCost && (
              <div className="mt-3">
                <LandedCostCard result={message.landedCost} />
              </div>
            )}
            {message.notes && message.notes.length > 0 && (
              <ul className="mt-2 space-y-1 text-[11px] text-ink-500">
                {message.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {loading && <LoadingNote label="Thinking…" />}
        {error && <ErrorNote message={error} />}
      </div>

      <form
        className="border-t border-ink-900/8 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            rows={2}
            placeholder="Ask a question"
            disabled={loading}
            className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 focus:border-current-500/60 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-paper-50 hover:bg-current-600 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
