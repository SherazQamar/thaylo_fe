"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import {
  fetchBloomBuddyStatus,
  submitBloomBuddyCheckIn,
  type BloomBuddyCheckInResult,
  type BloomBuddyStatus,
  type SelMood,
  type SelCheckInTiming,
} from "@/lib/bloom-buddy-api";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { KaraokeText } from "@/components/child/class/ClassInstructorCaption";
import { notify } from "@/lib/notify";

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
  const [visibleWords, setVisibleWords] = useState(0);
  const [messageWordCount, setMessageWordCount] = useState(0);
  const [speechPhase, setSpeechPhase] = useState<"idle" | "speaking" | "done">("idle");

  const { speakProgress, stop: stopSpeech } = useSpeechSynthesis(settings.voice, "child");

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
        notify.error(err, "Unable to load Bloom Buddy.");
      })
      .finally(() => setIsLoading(false));
  }, [timing]);

  const speakResponse = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setSpeechPhase("speaking");
      setVisibleWords(0);
      const totalWords = text.split(/\s+/).filter(Boolean).length;

      try {
        await speakProgress(text, {
          onWord: (index) => {
            setVisibleWords(index + 1);
          },
        });
      } finally {
        // If the audio engine fails, we still want the child unblocked.
        setVisibleWords(totalWords);
        setMessageWordCount(totalWords);
        setSpeechPhase("done");
      }
    },
    [speakProgress],
  );

  const handleSubmit = async () => {
    if (!selectedMood || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const data = await submitBloomBuddyCheckIn({
        mood: selectedMood,
        note: note.trim() || undefined,
        timing,
      });
      setResult(data);
      const displayWordCount = (data.response.displayText ?? "").split(/\s+/).filter(Boolean).length;
      setMessageWordCount(displayWordCount);
      await speakResponse(data.response.speechText || data.response.displayText || "");
    } catch (err) {
      notify.error(err, "Unable to save your check-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      // Ensure we don't keep speaking after route change / unmount.
      try {
        stopSpeech();
      } catch {
        // ignore
      }
    };
  }, [stopSpeech]);

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
      className="w-full max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-[#60D624]/25 bg-[#313044]/80 backdrop-blur px-3 py-3 sm:px-6 sm:py-5"
      style={inter}
    >
      <div className="mb-2 flex items-center gap-2.5 sm:mb-4 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#60D624]/20 text-base sm:h-10 sm:w-10 sm:text-xl">
          🌼
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white sm:text-lg">
            {buddyName}
            <span className="ml-1 text-[10px] font-normal text-white/50 sm:ml-1.5 sm:text-xs">{buddyTagline}</span>
          </h2>
          <p className="mt-0.5 text-[11px] text-white/60 sm:text-sm">{promptText}</p>
        </div>
      </div>

      {!result ? (
        <>
          {/* Plain emoji grid — 3 per row, equal spacing all sides */}
          <div className="mb-2 grid grid-cols-3 place-items-center gap-2.5 sm:mb-3 sm:gap-5">
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
                    "group relative inline-flex h-10 w-10 items-center justify-center transition-transform sm:h-14 sm:w-14 " +
                    (isSelected ? "scale-125" : "scale-100 opacity-80 hover:scale-110 hover:opacity-100")
                  }
                >
                  <span className="text-[26px] leading-none sm:text-[36px]">{option.emoji}</span>

                  <span
                    className={
                      "pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#111023] px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity sm:-top-8 sm:text-[11px] sm:px-2 " +
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

          <label className="mb-1 block text-[11px] text-white/70 sm:mb-1.5 sm:text-xs">
            Anything to share? <span className="text-white/40">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="I feel nervous about today's lesson…"
            rows={2}
            className="mb-2 w-full resize-none rounded-xl border border-white/10 bg-[#111023] px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/30 focus:border-[#60D624]/50 sm:mb-3 sm:text-sm"
          />

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!selectedMood || isSubmitting}
              onClick={handleSubmit}
              className="min-w-0 flex-1 rounded-full bg-[#60D624] px-3 py-2 text-[13px] font-semibold text-[#111023] disabled:opacity-50 sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm"
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
          <div className="rounded-xl border border-[#60D624]/20 bg-[#111023]/70 px-2.5 py-2.5 sm:px-3 sm:py-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="shrink-0">
                <Image
                  src="/assets/new-learning-support.png"
                  alt="Support avatar"
                  width={56}
                  height={56}
                  className="w-10 h-10 object-contain sm:w-[56px] sm:h-[56px]"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-relaxed text-white sm:text-sm">
                  <KaraokeText
                    text={result.response.displayText}
                    // Only reveal words while Calyx is actually speaking.
                    // When speech hasn't started yet (idle), show 0 words to avoid a flash of the full sentence.
                    visibleWords={
                      speechPhase === "idle"
                        ? 0
                        : speechPhase === "speaking"
                          ? visibleWords
                          : messageWordCount
                    }
                    keyPrefix="bloom-support"
                  />
                </p>
              </div>
            </div>
            {result.response.suggestedActivity && (
              <p className="mt-2 text-sm text-[#60D624]">
                Try this: {result.response.suggestedActivity}
              </p>
            )}
          </div>

          {speechPhase !== "done" ? (
            <div className="flex items-center justify-center gap-2 py-1 text-xs text-white/60">
              <span className="inline-block h-2 w-2 rounded-full bg-[#00CED1] animate-pulse" />
              <span>Listening…</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              className="w-full rounded-full bg-[#00CED1] px-4 py-2 text-[13px] font-semibold text-[#111023] sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm"
            >
              Continue to lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}
