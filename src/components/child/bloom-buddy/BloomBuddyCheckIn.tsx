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
  const buddyTagline =
    status?.bloomBuddy?.tagline ?? settings.bloomBuddy?.tagline ?? "your Bloom Buddy";

  const promptText =
    timing === "AFTER_LESSON"
      ? "How are you feeling after your lesson?"
      : "How are you feeling today?";

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

  const playResponse = useCallback(
    async (text: string) => {
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
    },
    [settings.voice.engine],
  );

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
      <div className="rounded-2xl border border-white/10 bg-[#313044] px-4 py-8 text-center text-sm text-white/60">
        Loading Bloom Buddy…
      </div>
    );
  }

  const moodOptions = status?.moodOptions ?? [];
  const selectedLabel = moodOptions.find((option) => option.value === selectedMood)?.label;

  return (
    <div
      className="w-full rounded-2xl border border-[#60D624]/25 bg-[#313044] px-4 py-4 sm:px-6 sm:py-5"
      style={inter}
    >
      <div className="mb-3 flex items-center gap-3 sm:mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#60D624]/20 text-lg sm:h-10 sm:w-10 sm:text-xl">
          🌼
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-white sm:text-lg">
            {buddyName}
            <span className="ml-1.5 text-xs font-normal text-white/50">{buddyTagline}</span>
          </h2>
          <p className="mt-0.5 text-xs text-white/60 sm:text-sm">{promptText}</p>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-[#FF7B7B]/30 bg-[#FF7B7B]/10 px-3 py-2 text-xs text-[#FF7B7B]">
          {error}
        </div>
      )}

      {!result ? (
        <>
          {/* Plain emoji grid — 3 per row, equal spacing all sides */}
          <div className="mb-2 grid grid-cols-3 place-items-center gap-4 sm:mb-3 sm:gap-5">
            {moodOptions.map((option) => {
              const isSelected = selectedMood === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  title={option.label}
                  aria-label={option.label}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedMood(option.value)}
                  className={
                    "group relative inline-flex h-12 w-12 items-center justify-center transition-transform sm:h-14 sm:w-14 " +
                    (isSelected ? "scale-125" : "scale-100 opacity-80 hover:scale-110 hover:opacity-100")
                  }
                >
                  <span className="text-[32px] leading-none sm:text-[36px]">{option.emoji}</span>

                  <span
                    className={
                      "pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#111023] px-2 py-0.5 text-[11px] font-semibold text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity " +
                      "group-hover:opacity-100 group-focus-visible:opacity-100"
                    }
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mb-3 min-h-[1.1rem] text-center text-xs text-white/55">
            {selectedLabel ? (
              <>
                Selected: <span className="font-semibold text-white/90">{selectedLabel}</span>
              </>
            ) : (
              <span className="text-white/35">Tap an emoji</span>
            )}
          </p>

          <label className="mb-1.5 block text-xs text-white/70">
            Anything to share? <span className="text-white/40">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="I feel nervous about today's lesson…"
            rows={2}
            className="mb-3 w-full resize-none rounded-xl border border-white/10 bg-[#111023] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#60D624]/50"
          />

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!selectedMood || isSubmitting}
              onClick={handleSubmit}
              className="min-w-0 flex-1 rounded-full bg-[#60D624] px-4 py-2.5 text-sm font-semibold text-[#111023] disabled:opacity-50 sm:flex-none sm:px-6"
            >
              {isSubmitting ? "Sharing…" : "Share how I feel"}
            </button>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="shrink-0 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/70 sm:px-5"
              >
                Skip
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-[#60D624]/20 bg-[#111023] px-3 py-3">
            <p className="text-sm leading-relaxed text-white">{result.response.displayText}</p>
            {result.response.suggestedActivity && (
              <p className="mt-2 text-sm text-[#60D624]">
                Try this: {result.response.suggestedActivity}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="w-full rounded-full bg-[#00CED1] px-6 py-2.5 text-sm font-semibold text-[#111023] sm:w-auto"
          >
            Continue to lesson
          </button>
        </div>
      )}
    </div>
  );
}
