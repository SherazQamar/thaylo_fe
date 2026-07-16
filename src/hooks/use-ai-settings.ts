"use client";

import { useEffect, useState } from "react";

import {
  fetchChildAiSettings,
  fetchRuntimeAiSettings,
  type PublicAiSettings,
  type SpeechAuthMode,
} from "@/lib/ai-settings-api";

const DEFAULT_SETTINGS: PublicAiSettings = {
  instructor: {
    name: "AI Instructor",
    tagline: "your learning guide",
    defaultTone: "clear, patient, and encouraging",
  },
  bloomBuddy: {
    name: "Calyx",
    tagline: "your Bloom Buddy",
    defaultTone: "warm, gentle, and supportive",
  },
  voice: {
    engine: "elevenlabs",
    elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL",
    elevenLabsVoiceName: "Bella",
    elevenLabsModelId: "eleven_multilingual_v2",
    browserVoiceUri: "",
    browserVoiceName: "",
    rate: 1,
    pitch: 1,
    lang: "en-US",
    stability: 0.5,
    similarityBoost: 0.75,
  },
  pacing: {
    pauseMs: 400,
    wordMs: 55,
    classDurationMinutes: 15,
  },
};

export function useAiSettings(authMode: SpeechAuthMode) {
  const [settings, setSettings] = useState<PublicAiSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = authMode === "child" ? fetchChildAiSettings : fetchRuntimeAiSettings;

    load()
      .then((data) => {
        if (!cancelled) {
          setSettings(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSettings(DEFAULT_SETTINGS);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authMode]);

  return { settings, isLoading };
}
