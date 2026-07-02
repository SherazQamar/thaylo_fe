"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { synthesizeAiSpeech, type PublicAiSettings, type SpeechAuthMode } from "@/lib/ai-settings-api";
import { sanitizeTextForSpeech } from "@/lib/tts-sanitize";

type VoiceConfig = PublicAiSettings["voice"];

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

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    if (browserSupported) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  }, [browserSupported]);

  const speak = useCallback(
    async (text: string) => {
      const spokenText = sanitizeTextForSpeech(text);
      if (!spokenText.trim() || !supported) {
        return;
      }

      const requestId = ++requestIdRef.current;
      stop();
      requestIdRef.current = requestId;
      setSpeaking(true);

      try {
        if (engine === "elevenlabs") {
          const blob = await synthesizeAiSpeech(spokenText, authMode);
          if (requestId !== requestIdRef.current) return;

          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          await new Promise<void>((resolve) => {
            const finish = () => {
              URL.revokeObjectURL(url);
              if (audioRef.current === audio) {
                audioRef.current = null;
              }
              resolve();
            };
            audio.onended = finish;
            audio.onerror = finish;
            void audio.play().catch(finish);
          });
          return;
        }

        if (!browserSupported) return;

        await new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.rate = voiceConfig?.rate ?? 0.95;
          utterance.pitch = voiceConfig?.pitch ?? 1;
          utterance.lang = voiceConfig?.lang ?? "en-US";

          const selectedVoice = voiceConfig ? resolveBrowserVoice(voiceConfig) : null;
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }

          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        });
      } finally {
        if (requestId === requestIdRef.current) {
          setSpeaking(false);
        }
      }
    },
    [authMode, browserSupported, engine, stop, supported, voiceConfig],
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

  return { speak, stop, speaking, supported };
}
