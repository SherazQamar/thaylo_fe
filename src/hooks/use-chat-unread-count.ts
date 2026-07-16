import { useQuery } from "@tanstack/react-query";
import { getChildToken, getUserToken } from "@/lib/auth-cookies";
import { listChatRooms } from "@/lib/chat-api";

export type ChatNavScope = "parent" | "wayfinder" | "child";

export function useChatUnreadCount(scope: ChatNavScope) {
  const roleMode = scope === "child" ? "child" : "user";
  const token = roleMode === "child" ? getChildToken() : getUserToken();

  const roomsQuery = useQuery({
    queryKey: ["chat-rooms", scope],
    queryFn: () => listChatRooms(roleMode),
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
    enabled: !!token,
  });

  const unreadTotal = (roomsQuery.data ?? []).reduce(
    (sum, room) => sum + (room.unreadCount ?? 0),
    0,
  );

  return {
    unreadTotal,
    hasUnread: unreadTotal > 0,
  };
}
