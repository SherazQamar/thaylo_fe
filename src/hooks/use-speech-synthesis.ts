"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { synthesizeAiSpeech, type PublicAiSettings, type SpeechAuthMode } from "@/lib/ai-settings-api";
import { sanitizeTextForSpeech } from "@/lib/tts-sanitize";
import {
  delay,
  estimateSpeakDurationMs,
  playAudioBlobWithWordSync,
  revealWordsOnSchedule,
  splitSpeakWords,
  stopAudioSlot,
} from "@/lib/tts-word-sync";

type VoiceConfig = PublicAiSettings["voice"];

type SpeakProgressOptions = {
  onWord?: (index: number, word: string) => void;
  wordMs?: number;
  isCancelled?: () => boolean;
  /**
   * When engine is elevenlabs, never fall back to OS/browser TTS (different voice).
   * Defaults to false so failed API calls stay silent/caption-only instead of a surprise voice.
   */
  allowBrowserFallback?: boolean;
};

function resolveBrowserVoice(voiceConfig: VoiceConfig) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (voiceConfig.browserVoiceUri) {
    const byUri = voices.find((voice) => voice.voiceURI === voiceConfig.browserVoiceUri);
    if (byUri) return byUri;
  }
  if (voiceConfig.browserVoiceName) {
    const byName = voices.find((voice) => voice.name === voiceConfig.browserVoiceName);
    if (byName) return byName;
  }

  return (
    voices.find((voice) => voice.lang.startsWith(voiceConfig.lang) && voice.localService) ??
    voices.find((voice) => voice.lang.startsWith(voiceConfig.lang)) ??
    voices.find((voice) => voice.lang.startsWith("en") && voice.localService) ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
    null
  );
}

export function useSpeechSynthesis(
  voiceConfig?: VoiceConfig | null,
  authMode: SpeechAuthMode = "child",
) {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestIdRef = useRef(0);

  const browserSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const engine = voiceConfig?.engine ?? "browser";
  const supported = engine === "elevenlabs" || browserSupported;

  const stopMedia = useCallback(() => {
    if (browserSupported) {
      window.speechSynthesis.cancel();
    }
    stopAudioSlot(audioRef);
  }, [browserSupported]);

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    stopMedia();
    setSpeaking(false);
  }, [stopMedia]);

  const speakBrowser = useCallback(
    async (
      spokenText: string,
      words: string[],
      options?: SpeakProgressOptions,
    ): Promise<boolean> => {
      if (!browserSupported) return false;

      stopMedia();

      const isCancelled = options?.isCancelled;
      const onWord = options?.onWord;
      let startedSpeaking = false;

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.rate = voiceConfig?.rate ?? 0.95;
        utterance.pitch = voiceConfig?.pitch ?? 1;
        utterance.lang = voiceConfig?.lang ?? "en-US";

        const selectedVoice = voiceConfig ? resolveBrowserVoice(voiceConfig) : null;
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        let revealedWords = 0;

        utterance.onstart = () => {
          startedSpeaking = true;
          if (onWord && words.length > 0 && revealedWords === 0) {
            onWord(0, words[0]);
            revealedWords = 1;
          }
        };

        utterance.onboundary = (event) => {
          if (event.name !== "word" || !onWord) return;
          const spoken = spokenText.slice(0, event.charIndex + event.charLength);
          const count = splitSpeakWords(spoken).length;
          while (revealedWords < count && revealedWords < words.length) {
            onWord(revealedWords, words[revealedWords]);
            revealedWords += 1;
          }
        };

        utterance.onend = () => {
          if (onWord) {
            for (let i = revealedWords; i < words.length; i += 1) {
              onWord(i, words[i]);
            }
          }
          resolve();
        };

        utterance.onerror = () => {
          if (onWord) {
            for (let i = revealedWords; i < words.length; i += 1) {
              onWord(i, words[i]);
            }
          }
          resolve();
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      });

      if (isCancelled?.()) return startedSpeaking;
      return startedSpeaking;
    },
    [browserSupported, stopMedia, voiceConfig],
  );

  const speakElevenLabs = useCallback(
    async (
      spokenText: string,
      words: string[],
      options?: SpeakProgressOptions,
    ): Promise<boolean> => {
      try {
        stopMedia();
        const blob = await synthesizeAiSpeech(spokenText, authMode);
        if (options?.isCancelled?.()) return false;

        return await playAudioBlobWithWordSync(
          blob,
          words,
          options?.onWord,
          options?.wordMs ?? 55,
          options?.isCancelled,
          audioRef,
        );
      } catch {
        stopAudioSlot(audioRef);
        return false;
      }
    },
    [authMode, stopMedia],
  );

  const speakTimedFallback = useCallback(
    async (words: string[], options?: SpeakProgressOptions) => {
      stopMedia();
      const wordMs = options?.wordMs ?? 55;
      const duration = estimateSpeakDurationMs(words.join(" "), wordMs);
      await revealWordsOnSchedule(
        words,
        (index, word) => options?.onWord?.(index, word),
        duration,
        options?.isCancelled,
      );
      if (!options?.isCancelled?.()) {
        await delay(Math.min(400, Math.max(200, duration * 0.05)));
      }
    },
    [stopMedia],
  );

  const speakProgress = useCallback(
    async (text: string, options?: SpeakProgressOptions) => {
      const spokenText = sanitizeTextForSpeech(text);
      if (!spokenText.trim()) {
        return;
      }

      const words = splitSpeakWords(spokenText);
      const requestId = ++requestIdRef.current;
      stopMedia();
      requestIdRef.current = requestId;
      setSpeaking(true);

      const isCancelled = () =>
        requestId !== requestIdRef.current || options?.isCancelled?.() === true;

      try {
        if (engine === "elevenlabs") {
          const played = await speakElevenLabs(spokenText, words, {
            ...options,
            isCancelled,
          });
          if (played && !isCancelled()) return;

          // Do not silently switch to OS/browser voices mid-lesson — that sounds like a different person.
          // Only allow when explicitly opted in (or when admin configured browser engine).
          if (
            options?.allowBrowserFallback === true &&
            browserSupported &&
            !isCancelled()
          ) {
            stopMedia();
            const browserPlayed = await speakBrowser(spokenText, words, {
              ...options,
              isCancelled,
            });
            if (browserPlayed && !isCancelled()) return;
          }
        } else if (browserSupported) {
          const browserPlayed = await speakBrowser(spokenText, words, {
            ...options,
            isCancelled,
          });
          if (browserPlayed && !isCancelled()) return;
        }

        if (!isCancelled()) {
          await speakTimedFallback(words, { ...options, isCancelled });
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setSpeaking(false);
        }
      }
    },
    [
      browserSupported,
      engine,
      speakBrowser,
      speakElevenLabs,
      speakTimedFallback,
      stopMedia,
    ],
  );

  const speak = useCallback(
    async (text: string) => {
      await speakProgress(text);
    },
    [speakProgress],
  );

  useEffect(() => {
    if (!browserSupported) return;
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      stop();
    };
  }, [browserSupported, stop]);

  return { speak, speakProgress, stop, speaking, supported };
}
