"use client";

import type { ChatDeliveryStatus } from "@/hooks/use-chat-conversation";

const inter = { fontFamily: "Inter, sans-serif" } as const;

/** Three animated dots shown when the other participant is typing. */
export function TypingDots({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <div className="flex items-center gap-1 rounded-[14px] bg-[#00CED1]/15 px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#00CED1] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
          />
        ))}
      </div>
      {label ? (
        <span className="text-[11px] text-white/45" style={inter}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** Delivery state shown under the current user's own messages. */
export function DeliveryStatus({
  status,
  onRetry,
  variant = "dark",
}: {
  status?: ChatDeliveryStatus;
  onRetry?: () => void;
  variant?: "dark" | "light";
}) {
  const mutedClass = variant === "light" ? "text-[#6B7280]" : "text-white/40";
  const failedClass = variant === "light" ? "text-red-500" : "text-red-400";

  if (status === "sending") {
    return (
      <span className={`text-[10px] ${mutedClass}`} style={inter}>
        Sending…
      </span>
    );
  }
  if (status === "failed") {
    return (
      <button
        type="button"
        onClick={onRetry}
        className={`text-[10px] ${failedClass} hover:underline`}
        style={inter}
      >
        Failed · Tap to retry
      </button>
    );
  }
  // Delivered / persisted message.
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] ${mutedClass}`} style={inter}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Sent
    </span>
  );
}
