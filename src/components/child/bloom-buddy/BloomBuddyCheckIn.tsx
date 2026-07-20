"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchBloomBuddyStatus,
  submitBloomBuddyCheckIn,
  type BloomBuddyCheckInResult,
  type BloomBuddyStatus,
  type SelMood,
  type SelCheckInTiming,
} from "@/lib/bloom-buddy-api";
import { synthesizeAiSpeech } from "@/lib/ai-settings-api";
import { useAiSettings } from "@/hooks/use-ai-settings";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type BloomBuddyCheckInProps = {
  timing?: SelCheckInTiming;
  onComplete: () => void;
  onSkip?: () => void;
};

export default function BloomBuddyCheckIn({
  timing = "BEFORE_LESSON",
  onComplete,
  onSkip,
}: BloomBuddyCheckInProps) {
  const { settings } = useAiSettings("child");
  const [status, setStatus] = useState<BloomBuddyStatus | null>(null);
  const [selectedMood, setSelectedMood] = useState<SelMood | null>(null);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<BloomBuddyCheckInResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buddyName = status?.bloomBuddy?.name ?? settings.bloomBuddy?.name ?? "Calyx";
  const buddyTagline = status?.bloomBuddy?.tagline ?? settings.bloomBuddy?.tagline ?? "your Bloom Buddy";

  const promptText =
    timing === "AFTER_LESSON"
      ? "How are you feeling after your lesson? A quick check-in helps me support you."
      : "How are you feeling today? This helps me support you before your lesson.";

  useEffect(() => {
    fetchBloomBuddyStatus(timing)
      .then((data) => {
        setStatus(data);
        if (!data.needsCheckIn && data.todayCheckIn) {
          setResult({
            checkIn: data.todayCheckIn,
            response: {
              speechText: data.todayCheckIn.buddyResponse ?? "",
              displayText: data.todayCheckIn.buddyResponse ?? "",
              suggestedActivity: data.todayCheckIn.suggestedActivity,
            },
            consecutiveLowDays: data.consecutiveLowDays,
            needsSupport: data.needsSupport,
            bloomBuddy: data.bloomBuddy,
          });
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load Bloom Buddy.");
      })
      .finally(() => setIsLoading(false));
  }, [timing]);

  const playResponse = useCallback(async (text: string) => {
    if (!text.trim() || settings.voice.engine !== "elevenlabs") return;
    try {
      const blob = await synthesizeAiSpeech(text, "child");
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      audio.onerror = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch {
      // Voice is optional for SEL check-in.
    }
  }, [settings.voice.engine]);

  const handleSubmit = async () => {
    if (!selectedMood || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await submitBloomBuddyCheckIn({
        mood: selectedMood,
        note: note.trim() || undefined,
        timing,
      });
      setResult(data);
      await playResponse(data.response.speechText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your check-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#313044] p-8 text-center text-white/60">
        Loading Bloom Buddy…
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-[#60D624]/25 bg-[#313044] p-6 md:p-8"
      style={inter}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#60D624]/20 flex items-center justify-center text-2xl">
          🌼
        </div>
        <div>
          <h2 className="text-white text-xl font-semibold">
            {buddyName}
            <span className="text-white/50 text-sm font-normal ml-2">{buddyTagline}</span>
          </h2>
          <p className="text-white/60 text-sm mt-1">{promptText}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-[#FF7B7B]/30 bg-[#FF7B7B]/10 px-4 py-3 text-[#FF7B7B] text-sm mb-4">
          {error}
        </div>
      )}

      {!result ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {(status?.moodOptions ?? []).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedMood(option.value)}
                className={
                  "rounded-xl border px-4 py-4 text-left transition-colors " +
                  (selectedMood === option.value
                    ? "border-[#60D624] bg-[#60D624]/15 text-white"
                    : "border-white/10 bg-[#111023] text-white/80 hover:border-[#60D624]/40")
                }
              >
                <span className="text-2xl block mb-1">{option.emoji}</span>
                <span className="text-sm font-semibold">{option.label}</span>
              </button>
            ))}
          </div>

          <label className="block text-white/70 text-sm mb-2">
            Anything you want to share? (optional)
          </label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="I feel nervous about today's lesson…"
            className="w-full min-h-[80px] rounded-xl bg-[#111023] border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#60D624]/50 mb-5"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!selectedMood || isSubmitting}
              onClick={handleSubmit}
              className="rounded-full bg-[#60D624] px-6 py-2.5 text-sm font-semibold text-[#111023] disabled:opacity-50"
            >
              {isSubmitting ? "Sharing with Bloom Buddy…" : "Share how I feel"}
            </button>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/70"
              >
                Skip for now
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#60D624]/20 bg-[#111023] px-4 py-4">
            <p className="text-white text-sm leading-relaxed">
              {result.response.displayText}
            </p>
            {result.response.suggestedActivity && (
              <p className="text-[#60D624] text-sm mt-3">
                Try this: {result.response.suggestedActivity}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="rounded-full bg-[#00CED1] px-6 py-2.5 text-sm font-semibold text-[#111023]"
          >
            Continue to lesson
          </button>
        </div>
      )}
    </div>
  );
}
