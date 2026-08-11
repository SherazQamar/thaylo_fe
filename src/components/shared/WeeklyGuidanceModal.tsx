"use client";

import type { WeeklyGuidanceSession } from "@/lib/weekly-guidance";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function statusLabel(session: WeeklyGuidanceSession) {
  if (session.status === "COMPLETED") {
    if (session.passed === true) return "Passed";
    if (session.passed === false) return "Not passed";
    return "Completed";
  }
  if (session.status === "IN_PROGRESS") return "In progress";
  return session.status;
}

interface WeeklyGuidanceModalProps {
  open: boolean;
  childName: string;
  emptyMessage: string | null;
  sessions: WeeklyGuidanceSession[];
  onClose: () => void;
}

export default function WeeklyGuidanceModal({
  open,
  childName,
  emptyMessage,
  sessions,
  onClose,
}: WeeklyGuidanceModalProps) {
  if (!open) return null;

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
              This week’s lessons
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

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center text-center py-8 gap-3">
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
              <p className="text-white text-base font-semibold">
                {emptyMessage || "No lesson taken this week."}
              </p>
              <p className="text-white/50 text-sm max-w-sm">
                When {childName} starts a lesson, attempt history and scores for
                this week will show up here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {sessions.map((session) => (
                <li
                  key={session.sessionId}
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {session.lessonTitle}
                      </p>
                      <p className="text-white/45 text-xs mt-1">
                        {session.skillFamily || "ELA"}
                        {" · "}
                        Attempt #{session.attemptNumber}
                        {session.isRetake ? " (retake)" : ""}
                      </p>
                    </div>
                    <span
                      className="text-[11px] font-semibold shrink-0 rounded-full px-2.5 py-1"
                      style={{
                        color:
                          session.passed === true
                            ? "#86EFAC"
                            : session.attemptNumber > 1 || session.passed === false
                              ? "#FCA5A5"
                              : "#67E8F9",
                        backgroundColor:
                          session.passed === true
                            ? "rgba(34,197,94,0.15)"
                            : session.attemptNumber > 1 || session.passed === false
                              ? "rgba(255,111,111,0.15)"
                              : "rgba(0,206,209,0.12)",
                      }}
                    >
                      {statusLabel(session)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/45">
                    <span>{formatWhen(session.startedAt)}</span>
                    {session.scorePercent != null && (
                      <span>Score {session.scorePercent}%</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
