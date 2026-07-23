"use client";

import { useCallback, useRef } from "react";

import { useHeygenAgent, type HeygenAvatarConfig } from "@/hooks/use-heygen-agent";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { createHeygenSessionToken, type PublicAiSettings, type SpeechAuthMode } from "@/lib/ai-settings-api";
import { sanitizeTextForSpeech } from "@/lib/tts-sanitize";
import { estimateSpeakDurationMs, revealWordsOnSchedule, splitSpeakWords } from "@/lib/tts-word-sync";

type SpeakProgressOptions = {
  onWord?: (index: number, word: string) => void;
  wordMs?: number;
  isCancelled?: () => boolean;
};

type VoiceConfig = PublicAiSettings["voice"];

/**
 * Instructor speech for live class.
 * HeyGen LiveAvatar speaks the lesson text; board words reveal on a paced schedule
 * while the avatar talks (not all-at-once). Falls back to TTS if avatar fails.
 */
export function useInstructorSpeech(
  voiceConfig?: VoiceConfig | null,
  avatarConfig?: HeygenAvatarConfig | null,
  authMode: SpeechAuthMode = "child",
) {
  const tts = useSpeechSynthesis(voiceConfig, authMode);
  const heygen = useHeygenAgent(avatarConfig, createHeygenSessionToken);

  const ttsRef = useRef(tts);
  const heygenRef = useRef(heygen);
  ttsRef.current = tts;
  heygenRef.current = heygen;

  const heygenEnabled = Boolean(avatarConfig?.enabled && avatarConfig.provider === "heygen");

  const stop = useCallback(() => {
    heygenRef.current.stop();
    ttsRef.current.stop();
  }, []);

  const speakProgress = useCallback(async (text: string, options?: SpeakProgressOptions) => {
    const spokenText = sanitizeTextForSpeech(text);
    if (!spokenText.trim()) return;

    const words = splitSpeakWords(spokenText);
    const wordMs = options?.wordMs;
    const isCancelled = () => options?.isCancelled?.() === true;

    const duration = estimateSpeakDurationMs(spokenText, wordMs);
    const wordSync = revealWordsOnSchedule(
      words,
      (index, word) => options?.onWord?.(index, word),
      duration,
      isCancelled,
    );

    const activeHeygen = heygenRef.current;
    const activeTts = ttsRef.current;

    if (heygenEnabled && activeHeygen.isReady) {
      const heygenOk = await activeHeygen.speak(spokenText);
      await wordSync;
      if (heygenOk || isCancelled()) return;
      if (!activeHeygen.errorMessage) return;
    }

    if (heygenEnabled && !activeHeygen.errorMessage) return;

    await activeTts.speakProgress(text, options);
    await wordSync;
  }, [heygenEnabled]);

  const speak = useCallback(
    async (text: string) => {
      await speakProgress(text);
    },
    [speakProgress],
  );

  return {
    speak,
    speakProgress,
    stop,
    speaking: tts.speaking || heygen.speaking,
    avatar: heygenEnabled ? heygen : null,
  };
}
