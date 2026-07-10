"use client";

import PortalAvatar from "@/components/shared/PortalAvatar";
import { DeliveryStatus } from "@/components/shared/chat/ChatIndicators";
import type { ChatDeliveryStatus } from "@/hooks/use-chat-conversation";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export const CHAT_COLORS = {
  incomingBubble: "#00CED1",
  outgoingBubble: "#D1D5DB",
  bubbleText: "#111023",
  accent: "#00CED1",
} as const;

type ChatMessageRowProps = {
  content: string;
  attachment?: { url: string; type: string; name: string; size: number } | null;
  senderName: string;
  avatarUrl?: string | null;
  isMine: boolean;
  status?: ChatDeliveryStatus;
  onRetry?: () => void;
};

export default function ChatMessageRow({
  content,
  attachment,
  senderName,
  avatarUrl,
  isMine,
  status,
  onRetry,
}: ChatMessageRowProps) {
  return (
    <div className={`flex items-end gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      <PortalAvatar
        name={senderName}
        avatarUrl={avatarUrl}
        size={36}
        useWordInitials
        className={isMine ? "" : "ring-2 ring-white/90"}
      />

      <div className={`flex min-w-0 max-w-[min(420px,82%)] flex-col ${isMine ? "items-end" : "items-start"}`}>
        {!isMine ? (
          <span
            className="mb-1.5 rounded-full bg-[#313044] px-2.5 py-0.5 text-[11px] text-white"
            style={inter}
          >
            {senderName}
          </span>
        ) : null}

        <div
          className="rounded-[18px] px-4 py-2.5 text-sm leading-relaxed"
          style={{
            backgroundColor: isMine ? CHAT_COLORS.outgoingBubble : CHAT_COLORS.incomingBubble,
            color: CHAT_COLORS.bubbleText,
            opacity: status === "sending" ? 0.75 : 1,
            ...inter,
          }}
        >
          {attachment?.type.startsWith("image/") ? (
            <a href={attachment.url} target="_blank" rel="noreferrer" className="block mb-2">
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-h-56 w-auto rounded-xl object-cover"
              />
            </a>
          ) : attachment ? (
            <a
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              className="mb-2 block rounded-lg bg-black/10 px-3 py-2 underline"
            >
              {attachment.name}
            </a>
          ) : null}
          {content}
        </div>

        {isMine ? (
          <div className="mt-1 flex justify-end">
            <DeliveryStatus status={status} onRetry={onRetry} variant="light" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
