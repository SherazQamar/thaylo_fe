import type { ChatRoomListItem } from "@/lib/chat-api";

export type ChatContactCategory = "child" | "parent" | "group";

export type ChatPortal = "wayfinder" | "parent" | "child";

const BASE_CHAT_FILTER_OPTIONS: { id: ChatContactCategory; label: string }[] = [
  { id: "child", label: "Child" },
  { id: "parent", label: "Parent" },
  { id: "group", label: "Group" },
];

const FILTER_LABEL_OVERRIDES: Record<
  ChatPortal,
  Partial<Record<ChatContactCategory, string>>
> = {
  wayfinder: {},
  parent: { parent: "Wayfinder" },
  child: { child: "Wayfinder" },
};

export function getChatFilterOptions(portal: ChatPortal) {
  const overrides = FILTER_LABEL_OVERRIDES[portal];
  return BASE_CHAT_FILTER_OPTIONS.map((option) => ({
    ...option,
    label: overrides[option.id] ?? option.label,
  }));
}

/** @deprecated Use getChatFilterOptions(portal) for role-specific labels. */
export const CHAT_FILTER_OPTIONS = BASE_CHAT_FILTER_OPTIONS;

export type ChatSidebarContact = {
  id: string;
  category: ChatContactCategory;
  label: string;
  subtitle?: string;
  roomId?: number | null;
  unreadCount?: number;
  avatarUrl?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
};

export function toggleChatFilter(
  current: ChatContactCategory[],
  filter: ChatContactCategory,
): ChatContactCategory[] {
  if (current.includes(filter)) {
    if (current.length === 1) return current;
    return current.filter((item) => item !== filter);
  }
  return [...current, filter];
}

export function filterContacts(
  contacts: ChatSidebarContact[],
  selected: ChatContactCategory[],
) {
  return contacts.filter((contact) => selected.includes(contact.category));
}

export function roomMeta(
  rooms: ChatRoomListItem[],
  predicate: (room: ChatRoomListItem) => boolean,
): {
  roomId: number | null;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
} {
  const room = rooms.find(predicate);
  return {
    roomId: room?.roomId ?? null,
    unreadCount: room?.unreadCount ?? 0,
    lastMessage: room?.lastMessage ?? null,
    lastMessageAt: room?.lastMessageAt ?? null,
  };
}

export function clearRoomUnreadInCache(
  rooms: ChatRoomListItem[] | undefined,
  roomId: number,
): ChatRoomListItem[] | undefined {
  if (!rooms) return rooms;
  return rooms.map((room) =>
    room.roomId === roomId ? { ...room, unreadCount: 0 } : room,
  );
}
