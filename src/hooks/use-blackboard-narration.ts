"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlackboardStep } from "@/lib/class-lesson-content";
import { splitNarrationForSpeech } from "@/lib/narration-speech-chunks";
import { delay, estimateSpeakDurationMs } from "@/lib/tts-word-sync";

export type BlackboardReveal = {
  completedLines: number;
  completedBullets: number;
  activeLineIndex: number | null;
  activeLineWords: number;
  activeBulletIndex: number | null;
  activeBulletWords: number;
  interactionVisible: boolean;
  interactionWords: number;
};

const DEFAULT_PAUSE_MS = 550;

type PacingConfig = {
  pauseMs?: number;
  wordMs?: number;
};

export type SpeakProgressFn = (
  text: string,
  options?: {
    onWord?: (index: number) => void;
    wordMs?: number;
    isCancelled?: () => boolean;
  },
) => Promise<void>;

type UseBlackboardNarrationOptions = {
  step: BlackboardStep | undefined;
  enabled: boolean;
  /** Pause teaching speech without resetting the board reveal. */
  paused?: boolean;
  voiceEnabled: boolean;
  speakProgress: SpeakProgressFn;
  onCaption: (text: string) => void;
  onCaptionWords?: (visibleWords: number) => void;
  onNarrationComplete?: () => void;
  pacing?: PacingConfig;
};

const EMPTY_REVEAL: BlackboardReveal = {
  completedLines: 0,
  completedBullets: 0,
  activeLineIndex: null,
  activeLineWords: 0,
  activeBulletIndex: null,
  activeBulletWords: 0,
  interactionVisible: false,
  interactionWords: 0,
};

export function useBlackboardNarration({
  step,
  enabled,
  paused = false,
  voiceEnabled,
  speakProgress,
  onCaption,
  onCaptionWords,
  onNarrationComplete,
  pacing,
}: UseBlackboardNarrationOptions) {
  const pauseMs = pacing?.pauseMs ?? DEFAULT_PAUSE_MS;
  const wordMs = pacing?.wordMs ?? 55;
  const [reveal, setReveal] = useState<BlackboardReveal>(EMPTY_REVEAL);
  const [isNarrating, setIsNarrating] = useState(false);
  const runIdRef = useRef(0);
  const pausedRef = useRef(paused);
  const holdForQuestionRef = useRef(false);
  const onNarrationCompleteRef = useRef(onNarrationComplete);
  const speakProgressRef = useRef(speakProgress);
  const onCaptionRef = useRef(onCaption);
  const onCaptionWordsRef = useRef(onCaptionWords);

  const resetReveal = useCallback(() => {
    setReveal(EMPTY_REVEAL);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      holdForQuestionRef.current = true;
    }
  }, [paused]);

  useEffect(() => {
    onNarrationCompleteRef.current = onNarrationComplete;
  }, [onNarrationComplete]);

  useEffect(() => {
    speakProgressRef.current = speakProgress;
  }, [speakProgress]);

  useEffect(() => {
    onCaptionRef.current = onCaption;
  }, [onCaption]);

  useEffect(() => {
    onCaptionWordsRef.current = onCaptionWords;
  }, [onCaptionWords]);

  useEffect(() => {
    if (!enabled || !step) {
      resetReveal();
      setIsNarrating(false);
      return;
    }

    const currentStep = step;
    const runId = ++runIdRef.current;
    let cancelled = false;
    const isRunStale = () => cancelled || runId !== runIdRef.current;
    const isSpeakAborted = () => isRunStale() || holdForQuestionRef.current;

    async function waitWhilePaused() {
      while (pausedRef.current && !isRunStale()) {
        await delay(120);
      }
      holdForQuestionRef.current = false;
    }

    async function narrateSegment(
      text: string,
      onWordProgress: (wordCount: number) => void,
    ) {
      await waitWhilePaused();
      if (isRunStale()) return;

      if (voiceEnabled) {
        await speakProgressRef.current(text, {
          wordMs,
          isCancelled: isSpeakAborted,
          onWord: (index) => {
            const count = index + 1;
            onWordProgress(count);
            onCaptionWordsRef.current?.(count);
          },
        });
      } else {
        const words = text.split(/\s+/).filter(Boolean);
        for (let i = 0; i < words.length; i += 1) {
          if (isSpeakAborted()) break;
          const count = i + 1;
          onWordProgress(count);
          onCaptionWordsRef.current?.(count);
          await delay(wordMs);
        }
        if (!isSpeakAborted()) {
          await delay(
            Math.max(
              0,
              estimateSpeakDurationMs(text, wordMs) - words.length * wordMs,
            ),
          );
        }
      }

      await waitWhilePaused();
    }

    async function narrate() {
      setIsNarrating(true);
      resetReveal();

      const bullets = currentStep.bulletPoints ?? [];
      const hasInteraction = !!currentStep.interaction;
      const isCompactPracticeStep =
        currentStep.lines.length === 0 && bullets.length === 1 && hasInteraction;
      const aiScript = currentStep.narrationScript?.trim();

      try {
        if (aiScript) {
          onCaptionRef.current(aiScript);
          onCaptionWordsRef.current?.(0);
          setReveal({
            completedLines: currentStep.lines.length,
            completedBullets: bullets.length,
            activeLineIndex: null,
            activeLineWords: 0,
            activeBulletIndex: null,
            activeBulletWords: 0,
            interactionVisible: hasInteraction,
            interactionWords: hasInteraction
              ? currentStep.interaction!.prompt.split(/\s+/).filter(Boolean).length
              : 0,
          });
          if (isRunStale()) return;

          const chunks = splitNarrationForSpeech(aiScript);
          for (let i = 0; i < chunks.length; i += 1) {
            if (isRunStale()) return;
            await narrateSegment(chunks[i], () => {});
            if (isRunStale()) return;
            if (i < chunks.length - 1) {
              await delay(Math.min(pauseMs, 500));
            }
          }

          if (!isRunStale()) {
            onNarrationCompleteRef.current?.();
          }
          return;
        }

        if (!isCompactPracticeStep) {
          const intro = `Let's look at ${currentStep.title}.`;
          onCaptionRef.current(intro);
          onCaptionWordsRef.current?.(0);
          if (isRunStale()) return;

          await narrateSegment(intro, () => {});
          if (isRunStale()) return;
          await delay(pauseMs);
        }

        for (let i = 0; i < currentStep.lines.length; i += 1) {
          const line = currentStep.lines[i];
          onCaptionRef.current(line);
          onCaptionWordsRef.current?.(0);
          setReveal((prev) => ({
            ...prev,
            activeLineIndex: i,
            activeLineWords: 0,
          }));

          await narrateSegment(line, (wordCount) => {
            setReveal((prev) => ({ ...prev, activeLineWords: wordCount }));
          });
          if (isRunStale()) return;

          setReveal((prev) => ({
            ...prev,
            completedLines: i + 1,
            activeLineIndex: null,
            activeLineWords: 0,
          }));
          await delay(pauseMs);
        }

        for (let i = 0; i < bullets.length; i += 1) {
          const bullet = bullets[i];
          onCaptionRef.current(bullet);
          onCaptionWordsRef.current?.(0);
          setReveal((prev) => ({
            ...prev,
            activeBulletIndex: i,
            activeBulletWords: 0,
          }));

          await narrateSegment(bullet, (wordCount) => {
            setReveal((prev) => ({ ...prev, activeBulletWords: wordCount }));
          });
          if (isRunStale()) return;

          setReveal((prev) => ({
            ...prev,
            completedBullets: i + 1,
            activeBulletIndex: null,
            activeBulletWords: 0,
          }));

          if (hasInteraction && i === bullets.length - 1) {
            setReveal((prev) => ({
              ...prev,
              interactionVisible: true,
              interactionWords: currentStep.interaction!.prompt
                .split(/\s+/)
                .filter(Boolean).length,
            }));
          } else {
            await delay(pauseMs);
          }
        }

        if (currentStep.interaction && bullets.length === 0) {
          const prompt = currentStep.interaction.prompt;
          onCaptionRef.current(prompt);
          onCaptionWordsRef.current?.(0);
          setReveal((prev) => ({
            ...prev,
            interactionVisible: true,
            interactionWords: 0,
          }));

          await narrateSegment(prompt, (wordCount) => {
            setReveal((prev) => ({ ...prev, interactionWords: wordCount }));
          });
          if (isRunStale()) return;
        } else if (currentStep.interaction && bullets.length > 0) {
          const prompt = currentStep.interaction.prompt;
          onCaptionRef.current(prompt);
          onCaptionWordsRef.current?.(0);
          if (voiceEnabled) {
            void speakProgressRef.current(prompt, {
              wordMs,
              isCancelled: isSpeakAborted,
            });
          }
        }

        if (!isRunStale()) {
          onNarrationCompleteRef.current?.();
        }
      } finally {
        if (!isRunStale()) {
          setIsNarrating(false);
        }
      }
    }

    void narrate();

    return () => {
      cancelled = true;
      runIdRef.current += 1;
      setIsNarrating(false);
    };
    // Intentionally omit onCaption / onCaptionWords / speakProgress / onNarrationComplete —
    // those are read via refs so unstable parent callbacks cannot restart narration.
  }, [enabled, step, voiceEnabled, resetReveal, pauseMs, wordMs]);

  return { reveal, isNarrating, resetReveal };
}
