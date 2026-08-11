"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  fetchBloomBuddyStatus,
  submitBloomBuddyCheckIn,
  uploadBloomBuddyVoiceNote,
  type BloomBuddyCheckInResult,
  type BloomBuddyStatus,
  type SelCheckInMood,
  type SelCheckInTiming,
} from "@/lib/bloom-buddy-api";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { KaraokeText } from "@/components/child/class/ClassInstructorCaption";
import { notify } from "@/lib/notify";

const inter = { fontFamily: "Inter, sans-serif" } as const;
const MAX_VOICE_MS = 45_000;

type BloomBuddyCheckInProps = {
  timing?: SelCheckInTiming;
  onComplete: () => void;
  onSkip?: () => void;
  /** Compact overlay copy for in-lesson mid-session check-ins. */
  compact?: boolean;
};

export default function BloomBuddyCheckIn({
  timing = "BEFORE_LESSON",
  onComplete,
  onSkip,
  compact = false,
}: BloomBuddyCheckInProps) {
  const { settings } = useAiSettings("child");
  const [status, setStatus] = useState<BloomBuddyStatus | null>(null);
  const [selectedMood, setSelectedMood] = useState<SelCheckInMood | null>(null);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<BloomBuddyCheckInResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleWords, setVisibleWords] = useState(0);
  const [messageWordCount, setMessageWordCount] = useState(0);
  const [speechPhase, setSpeechPhase] = useState<"idle" | "speaking" | "done">("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { speakProgress, stop: stopSpeech } = useSpeechSynthesis(settings.voice, "child");

  const buddyName = status?.bloomBuddy?.name ?? settings.bloomBuddy?.name ?? "Calyx";
  const buddyTagline =
    status?.bloomBuddy?.tagline ?? settings.bloomBuddy?.tagline ?? "your Bloom Buddy";

  const promptText =
    timing === "AFTER_LESSON"
      ? "How are you feeling after your lesson?"
      : timing === "MID_SESSION"
        ? "This question felt tricky — how are you feeling right now?"
        : "How are you feeling today?";

  const continueLabel =
    timing === "MID_SESSION"
      ? "Back to lesson"
      : timing === "AFTER_LESSON"
        ? "Continue"
        : "Continue to lesson";

  useEffect(() => {
    fetchBloomBuddyStatus(timing)
      .then((data) => {
        setStatus(data);
        // Mid-session is optional and may fire more than once across days;
        // only auto-complete if THIS timing already has today's check-in
        // and we are not mid-session (struggle may still want a fresh tap).
        if (!data.needsCheckIn && data.todayCheckIn && timing !== "MID_SESSION") {
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

  const stopRecordingTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (recordTimerRef.current) {
      window.clearTimeout(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    setIsRecording(false);
    stopRecordingTracks();
  }, [stopRecordingTracks]);

  const startRecording = useCallback(async () => {
    setVoiceError(null);
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setVoiceError("Voice notes aren’t supported on this device.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (blob.size > 0) setVoiceBlob(blob);
        stopRecordingTracks();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setVoiceBlob(null);
      recordTimerRef.current = window.setTimeout(() => {
        stopRecording();
      }, MAX_VOICE_MS);
    } catch {
      setVoiceError("Couldn’t access the microphone. You can still type a note.");
      stopRecordingTracks();
    }
  }, [stopRecording, stopRecordingTracks]);

  useEffect(() => {
    return () => {
      stopRecording();
      stopRecordingTracks();
    };
  }, [stopRecording, stopRecordingTracks]);

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
      let voiceNoteUrl: string | undefined;
      if (voiceBlob) {
        voiceNoteUrl = await uploadBloomBuddyVoiceNote(voiceBlob);
      }
      const data = await submitBloomBuddyCheckIn({
        mood: selectedMood,
        note: note.trim() || undefined,
        voiceNoteUrl,
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
      className={
        "w-full overflow-y-auto rounded-2xl border border-[#60D624]/25 bg-[#313044]/80 backdrop-blur px-3 py-3 sm:px-6 sm:py-5 " +
        (compact ? "max-h-[min(70dvh,520px)]" : "max-h-[calc(100dvh-2rem)]")
      }
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
          <p className="mt-0.5 text-[10px] text-white/40 sm:text-xs">
            Tap one face: Happy, Okay, or Worried
          </p>
        </div>
      </div>

      {!result ? (
        <>
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
                  onClick={() => setSelectedMood(option.value as SelCheckInMood)}
                  className={
                    "group relative inline-flex h-12 w-12 items-center justify-center transition-transform sm:h-16 sm:w-16 " +
                    (isSelected ? "scale-125" : "scale-100 opacity-80 hover:scale-110 hover:opacity-100")
                  }
                >
                  <span className="text-[32px] leading-none sm:text-[42px]">{option.emoji}</span>
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
            rows={compact ? 2 : 2}
            className="mb-2 w-full resize-none rounded-xl border border-white/10 bg-[#111023] px-3 py-2 text-[13px] text-white outline-none placeholder:text-white/30 focus:border-[#60D624]/50 sm:mb-3 sm:text-sm"
          />

          <div className="mb-3 flex flex-wrap items-center gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={() => void startRecording()}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[12px] font-semibold text-white/80 hover:bg-white/5"
              >
                <span aria-hidden>🎙️</span>
                {voiceBlob ? "Re-record voice note" : "Add voice note"}
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6F6F]/40 bg-[#FF6F6F]/15 px-3 py-1.5 text-[12px] font-semibold text-[#FFB4B4]"
              >
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#FF6F6F]" />
                Stop recording
              </button>
            )}
            {voiceBlob && !isRecording ? (
              <span className="text-[11px] text-[#60D624]">Voice note ready</span>
            ) : null}
            {voiceError ? (
              <span className="text-[11px] text-[#FFB4B4]">{voiceError}</span>
            ) : null}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!selectedMood || isSubmitting || isRecording}
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
              {continueLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
