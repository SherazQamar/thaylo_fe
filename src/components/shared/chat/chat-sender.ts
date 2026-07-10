import type { ChatMessage, ChatParticipant, ChatRoomListItem, ChatTargetType } from "@/lib/chat-api";

type SelfIdentity = { type: ChatTargetType; id?: number };

export function isOwnChatMessage(message: ChatMessage, self: SelfIdentity): boolean {
  return self.id != null && message.sender.type === self.type && message.sender.id === self.id;
}

export function resolveChatSenderName(
  message: ChatMessage,
  options: {
    self: SelfIdentity;
    selfDisplayName?: string;
    activeRoom?: ChatRoomListItem | null;
    groupParticipants?: ChatParticipant[];
  },
): string {
  const { self, selfDisplayName, activeRoom, groupParticipants } = options;

  if (isOwnChatMessage(message, self)) {
    return selfDisplayName ?? "You";
  }

  if (activeRoom?.type === "DIRECT") {
    return activeRoom.otherParticipant?.name ?? message.sender.role;
  }

  const fromGroup = groupParticipants?.find(
    (participant) =>
      participant.type === message.sender.type && participant.id === message.sender.id,
  );
  if (fromGroup?.name) return fromGroup.name;

  return message.sender.role;
}
