import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type AiVoiceEngine = "browser" | "elevenlabs";

export interface AiPersonaSettings {
  name: string;
  tagline: string;
  defaultTone: string;
}

export interface PublicAiSettings {
  instructor: AiPersonaSettings;
  bloomBuddy: AiPersonaSettings;
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
  avatar?: {
    provider: "none" | "heygen";
    enabled: boolean;
    heygenAvatarId: string;
    heygenVoiceId: string;
    useElevenLabsVoice: boolean;
  };
}

export type SpeechAuthMode = "child" | "user";

export async function fetchChildAiSettings() {
  const { data } = await api.get<ApiResponse<PublicAiSettings>>("/child/ai-settings", {
    authMode: "child",
  });
  return normalizePublicAiSettings(data.data);
}

export async function fetchRuntimeAiSettings() {
  const { data } = await api.get<ApiResponse<PublicAiSettings>>("/ai-settings/runtime", {
    authMode: "user",
  });
  return normalizePublicAiSettings(data.data);
}

function normalizePublicAiSettings(raw: PublicAiSettings & { persona?: AiPersonaSettings }): PublicAiSettings {
  const legacyPersona = raw.persona;
  return {
    instructor: raw.instructor ?? {
      name: "AI Instructor",
      tagline: "your learning guide",
      defaultTone: "clear, patient, and encouraging",
    },
    bloomBuddy: raw.bloomBuddy ?? legacyPersona ?? {
      name: "Calyx",
      tagline: "your Bloom Buddy",
      defaultTone: "warm, gentle, and supportive",
    },
    voice: raw.voice,
    pacing: raw.pacing,
    avatar: {
      provider: raw.avatar?.provider === "heygen" ? "heygen" : "none",
      enabled: Boolean(raw.avatar?.enabled && raw.avatar?.provider === "heygen"),
      heygenAvatarId: raw.avatar?.heygenAvatarId ?? "",
      heygenVoiceId: raw.avatar?.heygenVoiceId ?? "",
      useElevenLabsVoice: Boolean(raw.avatar?.useElevenLabsVoice),
    },
  };
}

export async function createHeygenSessionToken() {
  const path = "/child/ai/avatar/heygen-token";
  try {
    const { data } = await api.post<ApiResponse<{ token: string }>>(path, {}, {
      authMode: "child",
    });
    const token = data.data?.token ?? "";
    if (!token) {
      throw new Error(data.message || "HeyGen session token is empty");
    }
    return token;
  } catch (error) {
    if (isAxiosError(error)) {
      const payload = error.response?.data as
        | { message?: string | string[] }
        | undefined;
      const message = Array.isArray(payload?.message)
        ? payload.message.join(", ")
        : payload?.message;
      if (typeof message === "string" && message.trim()) {
        throw new Error(message.trim());
      }
    }
    throw error;
  }
}

export async function synthesizeAiSpeech(text: string, authMode: SpeechAuthMode) {
  const path = authMode === "child" ? "/child/ai/tts" : "/ai/tts";
  const response = await api.post(path, { text }, {
    authMode,
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function synthesizeLiveAvatarPcm(text: string) {
  const { data } = await api.post<
    ApiResponse<{ audioBase64: string; durationMs?: number }>
  >(
    "/child/ai/tts/liveavatar-pcm",
    { text },
    { authMode: "child" },
  );
  const audioBase64 = data.data?.audioBase64 ?? "";
  if (!audioBase64) {
    throw new Error(data.message || "LiveAvatar PCM audio is empty");
  }
  return {
    audioBase64,
    durationMs: data.data?.durationMs,
  };
}
