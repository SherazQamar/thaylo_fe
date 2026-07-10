import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listRoomMessages,
  markRoomAsRead,
  sendRoomMessage,
  type ChatMessage,
  type ChatMessagesPage,
  type ChatRole,
  type ChatRoomListItem,
  type ChatTargetType,
} from "@/lib/chat-api";
import { useChatRealtimeRoom } from "@/hooks/use-chat-realtime-room";

type RoleMode = "user" | "child";

export type ChatDeliveryStatus = "sending" | "sent" | "failed";

export type ChatDisplayMessage = ChatMessage & {
  clientId?: string;
  status?: ChatDeliveryStatus;
  optimistic?: boolean;
};

type SelfIdentity = { type: ChatTargetType; id: number | undefined; role?: ChatRole };

type UseChatConversationOptions = {
  roleMode: RoleMode;
  /** Cache namespace, e.g. "parent" | "wayfinder" | "child". */
  scope: string;
  roomId: number | null;
  self: SelfIdentity;
};

const TYPING_IDLE_MS = 1500; // stop broadcasting typing after this idle time
const TYPING_THROTTLE_MS = 1200; // re-emit typing:true at most this often
const TYPING_EXPIRE_MS = 4000; // clear a remote typing indicator if no update
const STICK_THRESHOLD_PX = 120; // treat as "at bottom" within this distance

function upsertMessagePage(
  prev: ChatMessagesPage | undefined,
  message: ChatMessage,
): ChatMessagesPage {
  const base = prev ?? { messages: [], nextCursor: null, hasMore: false };
  if (base.messages.some((m) => m.id === message.id)) return base;
  return { ...base, messages: [message, ...base.messages] };
}

export function useChatConversation({
  roleMode,
  scope,
  roomId,
  self,
}: UseChatConversationOptions) {
  const queryClient = useQueryClient();

  const [optimistic, setOptimistic] = useState<ChatDisplayMessage[]>([]);
  const [othersTyping, setOthersTyping] = useState(false);

  const typingExpireRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emitThrottleRef = useRef(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const shouldStickRef = useRef(true);

  const messagesQuery = useQuery({
    queryKey: ["chat-messages", scope, roomId],
    queryFn: () => listRoomMessages(roleMode, roomId!, { limit: 50 }),
    enabled: roomId != null,
  });

  // Reset per-room UI state when switching rooms.
  useEffect(() => {
    setOptimistic([]);
    setOthersTyping(false);
    shouldStickRef.current = true;
    if (typingExpireRef.current) clearTimeout(typingExpireRef.current);
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    emitThrottleRef.current = 0;
  }, [roomId]);

  const { emitTyping } = useChatRealtimeRoom({
    roleMode,
    roomId,
    onNewMessage: (incoming) => {
      if (!roomId || Number(incoming.roomId) !== roomId) {
        void queryClient.invalidateQueries({ queryKey: ["chat-rooms", scope] });
        return;
      }
      queryClient.setQueryData<ChatMessagesPage>(
        ["chat-messages", scope, roomId],
        (prev) => upsertMessagePage(prev, incoming),
      );
      // If this is the echo of my own message, drop the matching optimistic bubble.
      if (
        self.id != null &&
        incoming.sender.type === self.type &&
        incoming.sender.id === self.id
      ) {
        setOptimistic((list) =>
          list.filter(
            (o) => !(o.status !== "failed" && o.content === incoming.content),
          ),
        );
      } else {
        void markRoomAsRead(roleMode, roomId);
        queryClient.setQueryData<ChatRoomListItem[]>(
          ["chat-rooms", scope],
          (prev) =>
            prev?.map((room) =>
              room.roomId === roomId ? { ...room, unreadCount: 0 } : room,
            ),
        );
      }
      void queryClient.invalidateQueries({ queryKey: ["chat-rooms", scope] });
    },
    onMessageRead: () => {
      void queryClient.invalidateQueries({ queryKey: ["chat-rooms", scope] });
    },
    onTyping: (payload) => {
      if (payload.roomId !== roomId) return;
      if (
        self.id != null &&
        payload.from.type === self.type &&
        payload.from.id === self.id
      ) {
        return;
      }
      if (!payload.isTyping) {
        setOthersTyping(false);
        if (typingExpireRef.current) clearTimeout(typingExpireRef.current);
        return;
      }
      setOthersTyping(true);
      if (typingExpireRef.current) clearTimeout(typingExpireRef.current);
      typingExpireRef.current = setTimeout(
        () => setOthersTyping(false),
        TYPING_EXPIRE_MS,
      );
    },
  });

  const send = useCallback(
    async (raw: string, file?: File | null) => {
      const content = raw.trim();
      if ((!content && !file) || roomId == null || self.id == null) return;

      const clientId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimisticMsg: ChatDisplayMessage = {
        id: -Date.now(),
        clientId,
        roomId,
        content: content || (file ? `Sent ${file.name}` : ""),
        attachment: file
          ? {
              url: URL.createObjectURL(file),
              type: file.type,
              name: file.name,
              size: file.size,
            }
          : null,
        sender: {
          type: self.type,
          id: self.id,
          role: self.role ?? (self.type === "CHILD" ? "CHILD" : "PARENT"),
        },
        isEdited: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        optimistic: true,
        status: "sending",
      };

      setOptimistic((list) => [...list, optimisticMsg]);
      shouldStickRef.current = true;

      // Stop broadcasting "typing" as soon as the message is sent.
      emitTyping(false);
      if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
      emitThrottleRef.current = 0;

      try {
        const created = await sendRoomMessage(roleMode, roomId, { content, file });
        queryClient.setQueryData<ChatMessagesPage>(
          ["chat-messages", scope, roomId],
          (prev) => upsertMessagePage(prev, created),
        );
        setOptimistic((list) => list.filter((o) => o.clientId !== clientId));
        await markRoomAsRead(roleMode, roomId);
        queryClient.setQueryData<ChatRoomListItem[]>(
          ["chat-rooms", scope],
          (prev) =>
            prev?.map((room) =>
              room.roomId === roomId ? { ...room, unreadCount: 0 } : room,
            ),
        );
        void queryClient.invalidateQueries({ queryKey: ["chat-rooms", scope] });
      } catch {
        setOptimistic((list) =>
          list.map((o) =>
            o.clientId === clientId ? { ...o, status: "failed" } : o,
          ),
        );
      }
    },
    [roomId, self.id, self.type, self.role, roleMode, scope, queryClient, emitTyping],
  );

  const retry = useCallback(
    (msg: ChatDisplayMessage) => {
      setOptimistic((list) => list.filter((o) => o.clientId !== msg.clientId));
      void send(msg.content);
    },
    [send],
  );

  const notifyTyping = useCallback(() => {
    const now = Date.now();
    if (now - emitThrottleRef.current > TYPING_THROTTLE_MS) {
      emitThrottleRef.current = now;
      emitTyping(true);
    }
    if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    stopTypingTimerRef.current = setTimeout(() => {
      emitTyping(false);
      emitThrottleRef.current = 0;
    }, TYPING_IDLE_MS);
  }, [emitTyping]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldStickRef.current = distanceFromBottom < STICK_THRESHOLD_PX;
  }, []);

  const serverMessages = (messagesQuery.data?.messages ?? []).slice().reverse();
  const messages: ChatDisplayMessage[] = [...serverMessages, ...optimistic];
  const messageCount = messages.length;

  // Auto-scroll to the newest message when the user is already near the bottom.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (shouldStickRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messageCount, othersTyping]);

  useEffect(() => {
    return () => {
      if (typingExpireRef.current) clearTimeout(typingExpireRef.current);
      if (stopTypingTimerRef.current) clearTimeout(stopTypingTimerRef.current);
    };
  }, []);

  return {
    messages,
    isLoading: messagesQuery.isLoading,
    send,
    retry,
    othersTyping,
    notifyTyping,
    scrollRef,
    onScroll,
  };
}
