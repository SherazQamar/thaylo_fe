import { useCallback, useEffect, useMemo, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { getChildToken, getUserToken } from "@/lib/auth-cookies";
import type { ChatMessage, ChatTargetType } from "@/lib/chat-api";

type RoleMode = "user" | "child";

export type ChatTypingPayload = {
  roomId: number;
  isTyping: boolean;
  from: { type: ChatTargetType; id: number };
};

function socketBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
  try {
    const url = new URL(apiUrl);
    const origin = `${url.protocol}//${url.host}`;
    return origin;
  } catch {
    return "http://localhost:3001";
  }
}

type UseChatRealtimeRoomOptions = {
  roleMode: RoleMode;
  roomId: number | null;
  onNewMessage: (message: ChatMessage) => void;
  onMessageRead?: (payload: { roomId: number }) => void;
  onTyping?: (payload: ChatTypingPayload) => void;
};

export function useChatRealtimeRoom({
  roleMode,
  roomId,
  onNewMessage,
  onMessageRead,
  onTyping,
}: UseChatRealtimeRoomOptions) {
  const onNewMessageRef = useRef(onNewMessage);
  const onMessageReadRef = useRef(onMessageRead);
  const onTypingRef = useRef(onTyping);
  const activeRoomRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  onNewMessageRef.current = onNewMessage;
  onMessageReadRef.current = onMessageRead;
  onTypingRef.current = onTyping;

  const token = roleMode === "child" ? getChildToken() : getUserToken();

  const socket = useMemo<Socket | null>(() => {
    if (!token) return null;
    return io(`${socketBaseUrl()}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 8,
    });
  }, [token]);

  useEffect(() => {
    socketRef.current = socket;
    if (!socket) return;

    const handleMessage = (message: ChatMessage) => {
      onNewMessageRef.current(message);
    };
    const handleRead = (payload: { roomId: number }) => {
      onMessageReadRef.current?.(payload);
    };
    const handleTyping = (payload: ChatTypingPayload) => {
      onTypingRef.current?.(payload);
    };

    socket.on("message:new", handleMessage);
    socket.on("message:read", handleRead);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("message:new", handleMessage);
      socket.off("message:read", handleRead);
      socket.off("typing", handleTyping);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const joinActiveRoom = () => {
      const rid = activeRoomRef.current;
      if (!rid) return;
      socket.emit("room:join", { roomId: rid });
    };

    socket.on("connect", joinActiveRoom);
    if (socket.connected) joinActiveRoom();

    return () => {
      socket.off("connect", joinActiveRoom);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      activeRoomRef.current = null;
      return;
    }

    if (!roomId) {
      const prev = activeRoomRef.current;
      if (prev) socket.emit("room:leave", { roomId: prev });
      activeRoomRef.current = null;
      return;
    }

    const prev = activeRoomRef.current;
    if (prev && prev !== roomId) {
      socket.emit("room:leave", { roomId: prev });
    }
    activeRoomRef.current = roomId;

    if (socket.connected) {
      socket.emit("room:join", { roomId });
    }
  }, [roomId, socket]);

  const emitTyping = useCallback((isTyping: boolean) => {
    const s = socketRef.current;
    const rid = activeRoomRef.current;
    if (!s || !rid) return;
    s.emit("typing", { roomId: rid, isTyping });
  }, []);

  return { emitTyping };
}
