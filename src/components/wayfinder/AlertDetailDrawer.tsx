"use client";

import type { WayfinderAlertCard } from "@/lib/wayfinder-alerts";
import { lessonAlertPriority } from "@/lib/wayfinder-alerts";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface AlertDetailDrawerProps {
  open: boolean;
  card: WayfinderAlertCard | null;
  onClose: () => void;
  onStartChat?: (childId: number) => void;
  onResolve?: (alertId: number) => void;
  onDismiss?: (alertId: number) => void;
  isUpdating?: boolean;
}

export default function AlertDetailDrawer({
  open,
  card,
  onClose,
  onStartChat,
  onResolve,
  onDismiss,
  isUpdating = false,
}: AlertDetailDrawerProps) {
  const lesson = card?.kind === "lesson" ? card.alert : null;
  const sel = card?.kind === "sel" ? card.alert : null;
  const accent = card
    ? card.kind === "lesson"
      ? ({ YELLOW: "#FBBF24", ORANGE: "#FB923C", RED: "#FF6F6F" } as const)[card.alert.severity]
      : "#FFC542"
    : "#00CED1";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#313044", ...inter }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-white text-lg font-bold">Alert Detail</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {card && (
          <div className="px-6 py-5 flex-1 overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-white text-xl font-bold leading-tight">
                {lesson?.title ?? "SEL Red Flag"}
              </h3>
              {lesson && (
                <span
                  className="inline-flex items-center justify-center rounded-full border shrink-0"
                  style={{
                    borderColor: accent,
                    color: accent,
                    backgroundColor: `${accent}15`,
                    fontWeight: 500,
                    fontSize: "12px",
                    padding: "5px 12px",
                  }}
                >
                  {lessonAlertPriority(lesson.severity)}
                </span>
              )}
            </div>

            <p className="text-white/40 text-xs mt-1.5">
              {new Date(lesson?.createdAt ?? sel?.createdAt ?? "").toLocaleString()}
            </p>

            <div className="border-t border-white/5 my-4" />

            {lesson && (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/[0.04] p-4 space-y-3">
                  <div>
                    <p className="text-white/45 text-[11px] uppercase tracking-wide">Student</p>
                    <p className="text-white font-semibold">{lesson.childName}</p>
                    <p className="text-white/55 text-sm">@{lesson.childUserName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-white/45 text-[11px] uppercase tracking-wide">Grade</p>
                      <p className="text-white text-sm">{lesson.grade ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-white/45 text-[11px] uppercase tracking-wide">Parent</p>
                      <p className="text-white text-sm">{lesson.parentName ?? "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/45 text-[11px] uppercase tracking-wide">Lesson</p>
                    <p className="text-white text-sm font-medium">{lesson.lessonTitle}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-white/45 text-[11px] uppercase tracking-wide">Score</p>
                      <p className="text-white text-sm">{lesson.scorePercent}%</p>
                    </div>
                    <div>
                      <p className="text-white/45 text-[11px] uppercase tracking-wide">Attempt</p>
                      <p className="text-white text-sm">#{lesson.attemptNumber}</p>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-sm leading-relaxed">{lesson.message}</p>

                {lesson.requiresInvolvement && lesson.status === "ACTIVE" && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{ backgroundColor: "rgba(255,111,111,0.12)", color: "#FF9B9B" }}
                  >
                    This student cannot retake until you mark this alert resolved.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onStartChat?.(lesson.childId)}
                  className="w-full py-3 rounded-xl bg-[#00CED1] hover:bg-[#00B8BB] text-[#111023] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Start chat with student
                </button>
              </div>
            )}

            {sel && (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/[0.04] p-4">
                  <p className="text-white font-semibold">{sel.childName}</p>
                  <p className="text-white/55 text-sm mt-1">{sel.grade ?? "Grade unknown"}</p>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{sel.message}</p>
                <button
                  type="button"
                  onClick={() => onStartChat?.(sel.childId)}
                  className="w-full py-3 rounded-xl bg-[#00CED1] hover:bg-[#00B8BB] text-[#111023] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Start chat with student
                </button>
              </div>
            )}

            {lesson && lesson.status === "ACTIVE" && (
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onDismiss?.(lesson.id)}
                  className="py-3 rounded-xl border border-[#00CED1] text-[#00CED1] text-sm font-semibold hover:bg-[#00CED1]/10 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onResolve?.(lesson.id)}
                  className="py-3 rounded-xl bg-[#00CED1] hover:bg-[#00B8BB] text-[#111023] text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Mark resolved
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
