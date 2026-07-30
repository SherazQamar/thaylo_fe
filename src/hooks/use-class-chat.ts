"use client";

import { useCallback, useRef, useState } from "react";
import {
  createMessage,
  getWelcomeMessage,
  type ClassChatMessage,
} from "@/lib/calyx-class-chat";
import { askClassQuestion } from "@/lib/curriculum-api";

type UseClassChatOptions = {
  sessionId?: number | null;
  lessonTitle?: string;
  stepTitle?: string;
  stepPhase?: string;
  boardLines?: string[];
  instructorName?: string;
  onCalyxSpeak?: (text: string) => void | Promise<void>;
  voiceEnabled?: boolean;
  /** Pause teaching before answering; resume after speak finishes. */
  onQuestionFlow?: (phase: "start" | "end") => void;
};

export function useClassChat({
  sessionId,
  lessonTitle = "your class",
  stepTitle,
  stepPhase,
  boardLines,
  instructorName = "AI Instructor",
  onCalyxSpeak,
  voiceEnabled = true,
  onQuestionFlow,
}: UseClassChatOptions) {
  const [messages, setMessages] = useState<ClassChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const welcomedRef = useRef(false);

  const pushCalyxMessage = useCallback(
    (text: string, options?: { speak?: boolean }) => {
      const message = createMessage("calyx", text);
      setMessages((prev) => [...prev, message]);
      if (voiceEnabled && onCalyxSpeak && options?.speak !== false) {
        void onCalyxSpeak(text);
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
      onQuestionFlow?.("start");

      try {
        let reply =
          "Let's stay with today's lesson. I'll keep teaching in a moment.";
        if (sessionId) {
          const result = await askClassQuestion(sessionId, {
            question: trimmed,
            stepTitle,
            stepPhase,
            boardLines,
          });
          reply = result.reply?.trim() || reply;
        }
        const message = createMessage("calyx", reply);
        setMessages((prev) => [...prev, message]);
        if (voiceEnabled && onCalyxSpeak) {
          await onCalyxSpeak(reply);
        }
      } catch {
        const fallback = `Good question — let's keep going with ${lessonTitle}.`;
        const message = createMessage("calyx", fallback);
        setMessages((prev) => [...prev, message]);
        if (voiceEnabled && onCalyxSpeak) {
          await onCalyxSpeak(fallback);
        }
      } finally {
        setIsTyping(false);
        onQuestionFlow?.("end");
      }
    },
    [
      boardLines,
      isTyping,
      lessonTitle,
      onCalyxSpeak,
      onQuestionFlow,
      sessionId,
      stepPhase,
      stepTitle,
      voiceEnabled,
    ],
  );

  return {
    messages,
    isTyping,
    sendMessage,
    initializeChat,
    pushCalyxMessage,
  };
}
