import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type SelMood = "HAPPY" | "OKAY" | "WORRIED" | "SAD" | "ANGRY" | "TIRED";

/** Blueprint 3-tap moods children can select. */
export type SelCheckInMood = "HAPPY" | "OKAY" | "WORRIED";

export type SelCheckInTiming =
  | "BEFORE_LESSON"
  | "AFTER_LESSON"
  | "MID_SESSION"
  | "DASHBOARD";

export interface MoodOption {
  value: SelCheckInMood | SelMood;
  label: string;
  emoji: string;
  isLow: boolean;
}

export interface AiPersona {
  name: string;
  tagline: string;
  defaultTone: string;
}

export interface BloomBuddyStatus {
  moodOptions: MoodOption[];
  needsCheckIn: boolean;
  todayCheckIn: {
    id: number;
    mood: SelMood;
    buddyResponse: string | null;
    suggestedActivity: string | null;
  } | null;
  consecutiveLowDays: number;
  needsSupport: boolean;
  bloomBuddy: AiPersona;
  instructor: AiPersona;
}

export interface BloomBuddyCheckInResult {
  checkIn: {
    id: number;
    mood: SelMood;
    buddyResponse: string | null;
    suggestedActivity: string | null;
  };
  response: {
    speechText: string;
    displayText: string;
    suggestedActivity?: string | null;
  };
  consecutiveLowDays: number;
  needsSupport: boolean;
  bloomBuddy: AiPersona;
}

export async function fetchBloomBuddyStatus(timing: SelCheckInTiming = "BEFORE_LESSON") {
  const { data } = await api.get<ApiResponse<BloomBuddyStatus>>(
    `/child/bloom-buddy/status?timing=${timing}`,
    { authMode: "child" },
  );
  return data.data;
}

export async function submitBloomBuddyCheckIn(payload: {
  mood: SelCheckInMood;
  note?: string;
  voiceNoteUrl?: string;
  timing?: SelCheckInTiming;
}) {
  const { data } = await api.post<ApiResponse<BloomBuddyCheckInResult>>(
    "/child/bloom-buddy/check-in",
    payload,
    { authMode: "child" },
  );
  return data.data;
}

export async function uploadBloomBuddyVoiceNote(blob: Blob): Promise<string> {
  const formData = new FormData();
  const ext = blob.type.includes("ogg")
    ? "ogg"
    : blob.type.includes("mp4")
      ? "m4a"
      : "webm";
  formData.append("file", blob, `bloom-voice.${ext}`);
  const { data } = await api.post<ApiResponse<{ url: string }>>(
    "/child/bloom-buddy/voice-note",
    formData,
    {
      authMode: "child",
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.data.url;
}

export async function fetchBloomBuddyTrends(days = 7) {
  const { data } = await api.get<
    ApiResponse<{
      checkIns: Array<{
        id: number;
        mood: SelMood;
        buddyResponse: string | null;
        createdAt: string;
      }>;
      summary: { total: number; happy: number; okay: number; low: number };
      consecutiveLowDays: number;
    }>
  >(`/child/bloom-buddy/trends?days=${days}`, { authMode: "child" });
  return data.data;
}
