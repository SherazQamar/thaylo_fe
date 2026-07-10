import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type ChatTargetType = "USER" | "CHILD";
export type ChatRole = "PARENT" | "WAYFINDER" | "CHILD";
export type ChatRoomType = "DIRECT" | "GROUP";

export interface ChatParticipant {
  type: ChatTargetType;
  id: number;
  name: string | null;
  role: ChatRole;
}

export interface ChatAnchorChild {
  id: number;
  userName: string;
  firstName: string | null;
  secondName: string | null;
}

export interface ChatRoomListItem {
  roomId: number;
  type: ChatRoomType;
  otherParticipant?: ChatParticipant | null;
  groupName?: string | null;
  groupParticipants?: ChatParticipant[] | null;
  anchorChild?: ChatAnchorChild | null;
  archivedAt?: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastSenderRole: ChatRole | null;
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  content: string;
  attachment?: {
    url: string;
    type: string;
    name: string;
    size: number;
  } | null;
  sender: {
    type: ChatTargetType;
    id: number;
    role: ChatRole;
  };
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface ChatMessagesPage {
  messages: ChatMessage[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface FindOrCreateDirectRoomResult {
  roomId: number;
  created: boolean;
  otherParticipant: ChatParticipant;
}

export interface FindOrCreateGroupRoomResult {
  roomId: number;
  created: boolean;
  groupName: string;
  anchorChild: ChatAnchorChild;
  participants: ChatParticipant[];
  archivedAt: string | null;
}

export function isFindOrCreateGroupRoomResult(
  room: FindOrCreateDirectRoomResult | FindOrCreateGroupRoomResult,
): room is FindOrCreateGroupRoomResult {
  return "groupName" in room;
}

type RoleMode = "user" | "child";

function base(roleMode: RoleMode) {
  return roleMode === "child" ? "/child/chat" : "/chat";
}

function authMode(roleMode: RoleMode): "user" | "child" {
  return roleMode === "child" ? "child" : "user";
}

export async function listChatRooms(roleMode: RoleMode, search?: string) {
  const { data } = await api.get<ApiResponse<ChatRoomListItem[]>>(
    `${base(roleMode)}/rooms`,
    {
      authMode: authMode(roleMode),
      params: search?.trim() ? { search: search.trim() } : undefined,
    },
  );
  return data.data;
}

export async function findOrCreateDirectRoom(
  roleMode: RoleMode,
  payload: { targetType: ChatTargetType; targetId: number },
) {
  const { data } = await api.post<ApiResponse<FindOrCreateDirectRoomResult>>(
    `${base(roleMode)}/rooms/direct`,
    payload,
    { authMode: authMode(roleMode) },
  );
  return data.data;
}

export async function findOrCreateGroupRoom(
  roleMode: RoleMode,
  payload?: { childId: number },
) {
  const { data } = await api.post<ApiResponse<FindOrCreateGroupRoomResult>>(
    `${base(roleMode)}/rooms/group`,
    payload ?? {},
    { authMode: authMode(roleMode) },
  );
  return data.data;
}

export async function listRoomMessages(
  roleMode: RoleMode,
  roomId: number,
  params?: { cursor?: number; limit?: number },
) {
  const { data } = await api.get<ApiResponse<ChatMessagesPage>>(
    `${base(roleMode)}/rooms/${roomId}/messages`,
    {
      authMode: authMode(roleMode),
      params,
    },
  );
  return data.data;
}

export async function sendRoomMessage(
  roleMode: RoleMode,
  roomId: number,
  payload: { content?: string; file?: File | null },
) {
  const formData = new FormData();
  if (payload.content?.trim()) {
    formData.append("content", payload.content.trim());
  }
  if (payload.file) {
    formData.append("file", payload.file);
  }
  const { data } = await api.post<ApiResponse<ChatMessage>>(
    `${base(roleMode)}/rooms/${roomId}/messages`,
    formData,
    {
      authMode: authMode(roleMode),
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.data;
}

export async function markRoomAsRead(roleMode: RoleMode, roomId: number) {
  await api.post<ApiResponse<null>>(
    `${base(roleMode)}/rooms/${roomId}/read`,
    {},
    { authMode: authMode(roleMode) },
  );
}
