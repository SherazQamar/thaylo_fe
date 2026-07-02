import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type AiVoiceEngine = "browser" | "elevenlabs";

export interface PublicAiSettings {
  persona: {
    name: string;
    defaultTone: string;
  };
  voice: {
    engine: AiVoiceEngine;
    elevenLabsVoiceId: string;
    elevenLabsVoiceName: string;
    elevenLabsModelId: string;
    browserVoiceUri: string;
    browserVoiceName: string;
    rate: number;
    pitch: number;
    lang: string;
    stability: number;
    similarityBoost: number;
  };
  pacing: {
    pauseMs: number;
    wordMs: number;
    classDurationMinutes: number;
  };
}

export type SpeechAuthMode = "child" | "user";

export async function fetchChildAiSettings() {
  const { data } = await api.get<ApiResponse<PublicAiSettings>>("/child/ai-settings", {
    authMode: "child",
  });
  return data.data;
}

export async function fetchRuntimeAiSettings() {
  const { data } = await api.get<ApiResponse<PublicAiSettings>>("/ai-settings/runtime", {
    authMode: "user",
  });
  return data.data;
}

export async function synthesizeAiSpeech(text: string, authMode: SpeechAuthMode) {
  const path = authMode === "child" ? "/child/ai/tts" : "/ai/tts";
  const response = await api.post(path, { text }, {
    authMode,
    responseType: "blob",
  });
  return response.data as Blob;
}
