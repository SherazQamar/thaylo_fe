"use client";

import Link from "next/link";
import type { WeeklyGuidanceNextStep, WeeklyGuidanceSession } from "@/lib/weekly-guidance";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface RecommendedNextStepModalProps {
  open: boolean;
  childName: string;
  recommendation: string;
  source: "ai" | "fallback";
  sessions: WeeklyGuidanceSession[];
  nextStep?: WeeklyGuidanceNextStep | null;
  /** Parent vs student deep-links */
  modulesHref?: string;
  onClose: () => void;
}

export default function RecommendedNextStepModal({
  open,
  childName,
  recommendation,
  source,
  sessions,
  nextStep,
  modulesHref = "/child-dashboard/modules",
  onClose,
}: RecommendedNextStepModalProps) {
  if (!open) return null;

  const passed = sessions.filter((s) => s.passed === true).length;
  const failed = sessions.filter((s) => s.passed === false).length;
  const retakes = sessions.filter((s) => s.attemptNumber > 1).length;
  const hasSessions = sessions.length > 0;
  const why =
    nextStep?.why?.trim() ||
    "This tip is based on this week's lesson activity and the related Grade 4 ELA standard.";
  const skillFamily = nextStep?.skillFamily;
  const lessonTitle = nextStep?.lessonTitle;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 cursor-pointer"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-[20px] border border-[#525162]/50 bg-[#313044] shadow-xl flex flex-col"
        style={inter}
      >
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-white text-lg font-semibold">
              Recommended next step
            </h2>
            <p className="text-white/50 text-sm mt-1">{childName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
            aria-label="Close dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div
            className="rounded-xl border p-4"
            style={{
              borderColor: "rgba(255,111,111,0.35)",
              backgroundColor: "rgba(255,111,111,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{
                  color: "#FF9B9B",
                  backgroundColor: "rgba(255,111,111,0.15)",
                }}
              >
                {source === "ai" ? "AI guidance" : "Suggested tip"}
              </span>
              {skillFamily ? (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    color: "#00CED1",
                    backgroundColor: "rgba(0,206,209,0.12)",
                  }}
                >
                  {skillFamily}
                </span>
              ) : null}
            </div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {recommendation}
            </p>
            {lessonTitle ? (
              <p className="text-white/55 text-xs mt-2">
                Standards-linked lesson: <span className="text-white/80">{lessonTitle}</span>
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-[#00CED1]/25 bg-[#00CED1]/5 p-4">
            <p className="text-[#00CED1] text-xs font-semibold uppercase tracking-wide mb-2">
              Why this next step
            </p>
            <p className="text-white/80 text-sm leading-relaxed">{why}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/child-dashboard"
              onClick={onClose}
              className="rounded-full px-3.5 py-2 text-xs font-semibold"
              style={{ backgroundColor: "#00CED1", color: "#111023" }}
            >
              Start next lesson
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3.5 py-2 text-xs font-semibold border border-white/20 text-white/80 cursor-pointer"
            >
              Review tips
            </button>
            <Link
              href={modulesHref}
              onClick={onClose}
              className="rounded-full px-3.5 py-2 text-xs font-semibold border border-[#00CED1]/40 text-[#00CED1]"
            >
              Pick module
            </Link>
          </div>

          {!hasSessions ? (
            <div className="flex flex-col items-center text-center py-4 gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(245,158,11,0.15)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <p className="text-white text-sm font-semibold">
                No lesson taken this week.
              </p>
              <p className="text-white/50 text-sm max-w-sm">
                This tip is a gentle starter suggestion until {childName} begins
                lessons this week.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-white/45 text-xs uppercase tracking-wide mb-3">
                Based on this week
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-white/45 text-xs">Sessions</p>
                  <p className="text-white text-lg font-semibold">{sessions.length}</p>
                </div>
                <div>
                  <p className="text-white/45 text-xs">Passed</p>
                  <p className="text-white text-lg font-semibold">{passed}</p>
                </div>
                <div>
                  <p className="text-white/45 text-xs">Retakes</p>
                  <p className="text-white text-lg font-semibold">{retakes}</p>
                </div>
              </div>
              {failed > 0 && (
                <p className="text-white/50 text-xs mt-3">
                  {failed} lesson{failed === 1 ? "" : "s"} not passed this week —
                  focus tips prioritize supportive practice.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
