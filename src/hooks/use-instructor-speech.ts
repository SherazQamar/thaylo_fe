"use client";

import { useCallback, useRef } from "react";

import { useHeygenAgent, type HeygenAvatarConfig } from "@/hooks/use-heygen-agent";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import {
  createHeygenSessionToken,
  synthesizeLiveAvatarPcm,
  type PublicAiSettings,
  type SpeechAuthMode,
} from "@/lib/ai-settings-api";
import { sanitizeTextForSpeech } from "@/lib/tts-sanitize";
import {
  delay,
  estimateSpeakDurationMs,
  revealWordsAlignedToPromise,
  revealWordsOnSchedule,
  splitSpeakWords,
} from "@/lib/tts-word-sync";

type SpeakProgressOptions = {
  onWord?: (index: number, word: string) => void;
  wordMs?: number;
  isCancelled?: () => boolean;
};

type VoiceConfig = PublicAiSettings["voice"];

/** Board caption pace while LiveAvatar speaks. */
const AVATAR_WORD_MS = 360;

/**
 * Instructor speech for live class.
 * LiveAvatar FULL = avatar + LiveAvatar voice.
 * LiveAvatar LITE (useElevenLabsVoice) = avatar face + Super Admin ElevenLabs voice.
 */
export function useInstructorSpeech(
  voiceConfig?: VoiceConfig | null,
  avatarConfig?: HeygenAvatarConfig | null,
  authMode: SpeechAuthMode = "child",
) {
  const heygenEnabled = Boolean(avatarConfig?.enabled && avatarConfig.provider === "heygen");
  const useElevenLabsVoice = heygenEnabled && Boolean(avatarConfig?.useElevenLabsVoice);

  const tts = useSpeechSynthesis(
    heygenEnabled && !useElevenLabsVoice ? null : voiceConfig,
    authMode,
  );
  const heygen = useHeygenAgent(avatarConfig, createHeygenSessionToken);

  const ttsRef = useRef(tts);
  const heygenRef = useRef(heygen);
  ttsRef.current = tts;
  heygenRef.current = heygen;

  const stop = useCallback(() => {
    heygenRef.current.stop();
    ttsRef.current.stop();
  }, []);

  const speakProgress = useCallback(async (text: string, options?: SpeakProgressOptions) => {
    const spokenText = sanitizeTextForSpeech(text);
    if (!spokenText.trim()) return;

    const words = splitSpeakWords(spokenText);
    const isCancelled = () => options?.isCancelled?.() === true;
    const onWord = options?.onWord;

    if (heygenEnabled) {
      let agent = heygenRef.current;
      if (!agent.isReady && !agent.errorMessage) {
        const start = Date.now();
        while (Date.now() - start < 8_000) {
          if (isCancelled()) return;
          agent = heygenRef.current;
          if (agent.isReady || agent.errorMessage) break;
          await delay(80);
        }
      }

      agent = heygenRef.current;
      if (agent.isReady) {
        let audioBase64: string | undefined;
        if (useElevenLabsVoice) {
          try {
            const pcm = await synthesizeLiveAvatarPcm(spokenText);
            audioBase64 = pcm.audioBase64;
          } catch {
            await ttsRef.current.speakProgress(text, options);
            return;
          }
        }

        let started = false;
        const speakPromise = agent.speak(spokenText, {
          onStarted: () => {
            started = true;
          },
          audioBase64,
        });

        const boardSync = (async () => {
          if (!onWord) return;
          const waitUntil = Date.now() + 700;
          while (!started && Date.now() < waitUntil) {
            if (isCancelled()) return;
            await delay(30);
          }
          await revealWordsAlignedToPromise(
            words,
            onWord,
            speakPromise,
            estimateSpeakDurationMs(spokenText, AVATAR_WORD_MS),
            isCancelled,
          );
        })();

        await Promise.all([speakPromise, boardSync]);
        return;
      }

      if (onWord) {
        await revealWordsOnSchedule(
          words,
          onWord,
          estimateSpeakDurationMs(spokenText, options?.wordMs ?? AVATAR_WORD_MS),
          isCancelled,
        );
      }
      return;
    }

    await ttsRef.current.speakProgress(text, options);
  }, [heygenEnabled, useElevenLabsVoice]);

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
    speaking: heygenEnabled ? heygen.speaking : tts.speaking,
    avatar: heygenEnabled ? heygen : null,
  };
}
