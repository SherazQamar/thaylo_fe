"use client";

import type {
  WayfinderAlertCard,
  WayfinderStudentAlertGroup,
} from "@/lib/wayfinder-alerts";
import {
  cardText,
  flagMeta,
  lessonAlertPriority,
} from "@/lib/wayfinder-alerts";
import { formatStudentGrade } from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface AlertDetailDrawerProps {
  open: boolean;
  group: WayfinderStudentAlertGroup | null;
  card: WayfinderAlertCard | null;
  onSelectCard?: (card: WayfinderAlertCard) => void;
  onClose: () => void;
  onStartChat?: (childId: number) => void;
  onStartParentChat?: (childId: number) => void;
  onResolve?: (alertId: number) => void;
  onDismiss?: (alertId: number) => void;
  isUpdating?: boolean;
}

export default function AlertDetailDrawer({
  open,
  group,
  card,
  onSelectCard,
  onClose,
  onStartChat,
  onStartParentChat,
  onResolve,
  onDismiss,
  isUpdating = false,
}: AlertDetailDrawerProps) {
  const lesson = card?.kind === "lesson" ? card.alert : null;
  const sel = card?.kind === "sel" ? card.alert : null;
  const parent = card?.kind === "parent" ? card.alert : null;

  const accent = card
    ? card.kind === "lesson"
      ? flagMeta(card.alert.severity).accent
      : card.kind === "sel"
        ? flagMeta("RED").accent
        : flagMeta("BLUE").accent
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
          <h2 className="text-white text-lg font-bold">Student alerts</h2>
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

        {group && (
          <div className="px-6 py-5 flex-1 overflow-y-auto">
            <h3 className="text-white text-xl font-bold leading-tight">{group.childName}</h3>
            <p className="text-white/45 text-xs mt-1.5">
              {formatStudentGrade(group.grade)}
              {group.parentName ? ` · Parent: ${group.parentName}` : ""}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {group.flags.map((flag) => {
                const meta = flagMeta(flag);
                return (
                  <span
                    key={flag}
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      borderColor: meta.accent,
                      color: meta.accent,
                      backgroundColor: `${meta.accent}18`,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accent }} />
                    {meta.label}
                  </span>
                );
              })}
            </div>

            <div className="border-t border-white/5 my-4" />

            <p className="text-white/45 text-[11px] uppercase tracking-wide mb-2">Alerts</p>
            <div className="space-y-2 mb-5">
              {group.cards.map((c) => {
                const isActive = card?.id === c.id;
                const pill =
                  c.kind === "lesson"
                    ? lessonAlertPriority(c.alert.severity)
                    : c.kind === "sel"
                      ? "Red flag"
                      : "Blue flag";
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectCard?.(c)}
                    className="w-full text-left rounded-xl px-3 py-2.5 transition-colors"
                    style={{
                      backgroundColor: isActive ? "rgba(0,206,209,0.12)" : "rgba(255,255,255,0.04)",
                      border: isActive ? "1px solid rgba(0,206,209,0.35)" : "1px solid transparent",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-medium truncate">{cardText(c)}</p>
                      <span className="text-[10px] font-semibold shrink-0" style={{ color: accent }}>
                        {pill}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {lesson && (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/[0.04] p-4 space-y-3">
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
              </div>
            )}

            {sel && (
              <p className="text-white/70 text-sm leading-relaxed">{sel.message}</p>
            )}

            {parent && (
              <div className="space-y-3">
                <p className="text-white/70 text-sm leading-relaxed">{parent.message}</p>
                <p className="text-white/40 text-xs">Waiting {parent.hoursWaiting}+ hours</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => onStartChat?.(group.childId)}
                className="w-full py-3 rounded-xl bg-[#00CED1] hover:bg-[#00B8BB] text-[#111023] text-sm font-semibold transition-colors cursor-pointer"
              >
                Start chat with student
              </button>
              {(parent || group.flags.includes("BLUE")) && (
                <button
                  type="button"
                  onClick={() => onStartParentChat?.(group.childId)}
                  className="w-full py-3 rounded-xl border border-[#3B82F6] text-[#60A5FA] text-sm font-semibold hover:bg-[#3B82F6]/10 transition-colors cursor-pointer"
                >
                  Reply to parent
                </button>
              )}
            </div>

            {lesson && lesson.status === "ACTIVE" && (
              <div className="grid grid-cols-2 gap-3 mt-4">
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
                  className="py-3 rounded-xl bg-[#00CED1] text-[#111023] text-sm font-semibold hover:bg-[#00B8BB] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Resolve
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
