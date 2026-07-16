"use client";

import type { RefObject } from "react";
import ChatMessageRow from "@/components/shared/chat/ChatMessageRow";
import { isOwnChatMessage, resolveChatSenderName } from "@/components/shared/chat/chat-sender";
import { TypingDots } from "@/components/shared/chat/ChatIndicators";
import type { ChatDisplayMessage } from "@/hooks/use-chat-conversation";
import type { ChatParticipant, ChatRoomListItem, ChatTargetType } from "@/lib/chat-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ChatMessageListProps = {
  messages: ChatDisplayMessage[];
  isLoading: boolean;
  self: { type: ChatTargetType; id?: number };
  selfDisplayName?: string;
  selfAvatarUrl?: string | null;
  activeRoom?: ChatRoomListItem | null;
  groupParticipants?: ChatParticipant[];
  othersTyping?: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onRetry: (message: ChatDisplayMessage) => void;
  emptyLabel?: string;
};

export default function ChatMessageList({
  messages,
  isLoading,
  self,
  selfDisplayName,
  selfAvatarUrl,
  activeRoom,
  groupParticipants,
  othersTyping = false,
  scrollRef,
  onScroll,
  onRetry,
  emptyLabel = "No messages yet.",
}: ChatMessageListProps) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col gap-5"
    >
      {isLoading ? (
        <p className="text-white/50 text-sm" style={inter}>
          Loading messages...
        </p>
      ) : messages.length === 0 ? (
        <p className="text-white/50 text-sm" style={inter}>
          {emptyLabel}
        </p>
      ) : (
        messages.map((message) => {
          const mine = isOwnChatMessage(message, self);
          const senderName = resolveChatSenderName(message, {
            self,
            selfDisplayName,
            activeRoom,
            groupParticipants,
          });

          return (
            <ChatMessageRow
              key={message.clientId ?? message.id}
              content={message.content}
              attachment={message.attachment}
              senderName={senderName}
              avatarUrl={mine ? selfAvatarUrl : null}
              isMine={mine}
              status={message.status}
              onRetry={() => onRetry(message)}
            />
          );
        })
      )}

      {othersTyping ? (
        <div className="flex justify-start">
          <TypingDots label="typing…" />
        </div>
      ) : null}
    </div>
  );
}
