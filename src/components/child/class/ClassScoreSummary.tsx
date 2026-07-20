"use client";

import { useState } from "react";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const PASS_THRESHOLD = 85;

type ClassScoreSummaryProps = {
  scoreCorrect: number;
  scoreTotal: number;
  lessonTitle: string;
  instructorName?: string;
  passed?: boolean;
  passThreshold?: number;
  wayfinderBlocked?: boolean;
  onContinue: () => void;
  onRetake?: () => void | Promise<void>;
};

export default function ClassScoreSummary({
  scoreCorrect,
  scoreTotal,
  lessonTitle,
  instructorName = "AI Instructor",
  passed = true,
  passThreshold = PASS_THRESHOLD,
  wayfinderBlocked = false,
  onContinue,
  onRetake,
}: ClassScoreSummaryProps) {
  const [isRetaking, setIsRetaking] = useState(false);
  const percent = scoreTotal > 0 ? Math.round((scoreCorrect / scoreTotal) * 100) : 0;

  const handleRetake = async () => {
    if (!onRetake || isRetaking) return;
    setIsRetaking(true);
    try {
      await onRetake();
    } finally {
      setIsRetaking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
      <div
        className="w-full max-w-md rounded-[20px] p-8 border text-center"
        style={{
          backgroundColor: "#313044",
          borderColor: passed ? "rgba(0,206,209,0.3)" : "rgba(255,197,66,0.35)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ ...inter, color: passed ? "#00CED1" : "#FFC542" }}
        >
          {passed ? "Lesson passed" : "Retake needed"}
        </p>
        <h2 className="text-white text-xl font-semibold mb-1" style={inter}>
          {lessonTitle}
        </h2>
        <p className="text-white/55 text-sm mb-6" style={inter}>
          {passed
            ? "You scored high enough to move on to the next lesson."
            : `You need at least ${passThreshold}% to pass. ${instructorName} will prepare a fresh retake with new examples.`}
        </p>

        <div className="rounded-2xl bg-[#111023] border border-white/10 py-6 px-4 mb-6">
          <p className="text-4xl font-bold" style={{ ...inter, color: passed ? "#00CED1" : "#FFC542" }}>
            {scoreCorrect}/{scoreTotal}
          </p>
          <p className="text-white/50 text-sm mt-2" style={inter}>
            {percent}% correct · need {passThreshold}% to pass
          </p>
        </div>

        {passed ? (
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3.5 rounded-xl bg-[#00CED1] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
            style={inter}
          >
            Back to Pathway
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            {wayfinderBlocked ? (
              <div
                className="rounded-xl px-4 py-3 text-sm text-left mb-1"
                style={{ backgroundColor: "rgba(255,111,111,0.12)", color: "#FF9B9B" }}
              >
                Your Wayfinder teacher needs to help you before you can try this lesson again. Check back soon!
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void handleRetake()}
                disabled={isRetaking}
                className="w-full py-3.5 rounded-xl bg-[#FFC542] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60"
                style={inter}
              >
                {isRetaking ? "Preparing your retake…" : "Retake class"}
              </button>
            )}
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-3 rounded-xl text-sm text-white/50 hover:text-white/80"
              style={inter}
            >
              Back to Pathway
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
