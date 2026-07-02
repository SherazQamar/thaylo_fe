"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlackboardStep } from "@/lib/class-lesson-content";

export type BlackboardReveal = {
  visibleLines: number;
  visibleBullets: number;
  interactionVisible: boolean;
};

const DEFAULT_PAUSE_MS = 400;
const DEFAULT_WORD_MS = 55;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function estimateSpeakMs(text: string, wordMs = DEFAULT_WORD_MS) {
  return Math.max(1200, text.split(/\s+/).length * wordMs);
}

type PacingConfig = {
  pauseMs?: number;
  wordMs?: number;
};

type UseBlackboardNarrationOptions = {
  step: BlackboardStep | undefined;
  enabled: boolean;
  voiceEnabled: boolean;
  speak: (text: string) => Promise<void>;
  onCaption: (text: string) => void;
  onNarrationComplete?: () => void;
  pacing?: PacingConfig;
};

export function useBlackboardNarration({
  step,
  enabled,
  voiceEnabled,
  speak,
  onCaption,
  onNarrationComplete,
  pacing,
}: UseBlackboardNarrationOptions) {
  const pauseMs = pacing?.pauseMs ?? DEFAULT_PAUSE_MS;
  const wordMs = pacing?.wordMs ?? DEFAULT_WORD_MS;
  const [reveal, setReveal] = useState<BlackboardReveal>({
    visibleLines: 0,
    visibleBullets: 0,
    interactionVisible: false,
  });
  const [isNarrating, setIsNarrating] = useState(false);
  const runIdRef = useRef(0);
  const onNarrationCompleteRef = useRef(onNarrationComplete);

  const resetReveal = useCallback(() => {
    setReveal({ visibleLines: 0, visibleBullets: 0, interactionVisible: false });
  }, []);

  useEffect(() => {
    onNarrationCompleteRef.current = onNarrationComplete;
  }, [onNarrationComplete]);

  useEffect(() => {
    if (!enabled || !step) {
      resetReveal();
      setIsNarrating(false);
      return;
    }

    const runId = ++runIdRef.current;
    let cancelled = false;

    async function narrate() {
      setIsNarrating(true);
      resetReveal();

      const intro = `Let's look at ${step.title}.`;
      onCaption(intro);
      if (voiceEnabled) {
        await speak(intro);
      } else {
        await delay(estimateSpeakMs(intro, wordMs));
      }
      if (cancelled || runId !== runIdRef.current) return;

      for (let i = 0; i < step.lines.length; i += 1) {
        const line = step.lines[i];
        onCaption(line);
        if (voiceEnabled) {
          await speak(line);
        } else {
          await delay(estimateSpeakMs(line, wordMs));
        }
        if (cancelled || runId !== runIdRef.current) return;
        setReveal((prev) => ({ ...prev, visibleLines: i + 1 }));
        await delay(pauseMs);
      }

      const bullets = step.bulletPoints ?? [];
      for (let i = 0; i < bullets.length; i += 1) {
        const bullet = bullets[i];
        onCaption(bullet);
        if (voiceEnabled) {
          await speak(bullet);
        } else {
          await delay(estimateSpeakMs(bullet, wordMs));
        }
        if (cancelled || runId !== runIdRef.current) return;
        setReveal((prev) => ({ ...prev, visibleBullets: i + 1 }));
        await delay(pauseMs);
      }

      if (step.interaction) {
        onCaption(step.interaction.prompt);
        if (voiceEnabled) {
          await speak(step.interaction.prompt);
        } else {
          await delay(estimateSpeakMs(step.interaction.prompt, wordMs));
        }
        if (cancelled || runId !== runIdRef.current) return;
        setReveal((prev) => ({ ...prev, interactionVisible: true }));
      }

      setIsNarrating(false);
      onNarrationCompleteRef.current?.();
    }

    void narrate();

    return () => {
      cancelled = true;
      runIdRef.current += 1;
    };
  }, [enabled, step, voiceEnabled, speak, onCaption, resetReveal, pauseMs, wordMs]);

  return { reveal, isNarrating, resetReveal };
}
