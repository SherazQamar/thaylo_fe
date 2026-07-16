"use client";

import { useCallback, useRef, useState } from "react";
import {
  createMessage,
  generateCalyxReply,
  getWelcomeMessage,
  type ClassChatMessage,
} from "@/lib/calyx-class-chat";

type UseClassChatOptions = {
  lessonTitle?: string;
  stepTitle?: string;
  instructorName?: string;
  onCalyxSpeak?: (text: string) => void;
  voiceEnabled?: boolean;
};

export function useClassChat({
  lessonTitle = "your class",
  stepTitle,
  instructorName = "AI Instructor",
  onCalyxSpeak,
  voiceEnabled = true,
}: UseClassChatOptions) {
  const [messages, setMessages] = useState<ClassChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const welcomedRef = useRef(false);

  const pushCalyxMessage = useCallback(
    (text: string, options?: { speak?: boolean }) => {
      const message = createMessage("calyx", text);
      setMessages((prev) => [...prev, message]);
      if (voiceEnabled && onCalyxSpeak && options?.speak !== false) {
        onCalyxSpeak(text);
      }
      return message;
    },
    [onCalyxSpeak, voiceEnabled],
  );

  const initializeChat = useCallback(() => {
    if (welcomedRef.current) return;
    welcomedRef.current = true;
    const welcome = getWelcomeMessage(lessonTitle, instructorName);
    pushCalyxMessage(welcome, { speak: false });
  }, [instructorName, lessonTitle, pushCalyxMessage]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setMessages((prev) => [...prev, createMessage("child", trimmed)]);
      setIsTyping(true);

      await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

      const reply = generateCalyxReply(trimmed, { lessonTitle, stepTitle, instructorName });
      pushCalyxMessage(reply);
      setIsTyping(false);
    },
    [instructorName, isTyping, lessonTitle, pushCalyxMessage, stepTitle],
  );

  return {
    messages,
    isTyping,
    sendMessage,
    initializeChat,
    pushCalyxMessage,
  };
}
