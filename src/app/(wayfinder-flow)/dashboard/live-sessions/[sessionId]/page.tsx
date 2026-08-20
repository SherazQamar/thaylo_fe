"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import PortalAvatar from "@/components/shared/PortalAvatar";
import WayfinderChildNotesDrawer from "@/components/wayfinder/WayfinderChildNotesDrawer";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { notify } from "@/lib/notify";
import {
  createWayfinderChildNote,
  fetchWayfinderLiveSessionDetail,
  sendWayfinderChildNoteToParent,
  wayfinderQueryKeys,
} from "@/lib/wayfinder-api";
import {
  formatElapsedTimer,
  formatStudentGrade,
  formatWayfinderStudentName,
  riskBadgeColor,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatClock(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatShortTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatRelativeNoteTime(iso: string) {
  try {
    const at = new Date(iso);
    const now = new Date();
    const sameDay =
      at.getFullYear() === now.getFullYear() &&
      at.getMonth() === now.getMonth() &&
      at.getDate() === now.getDate();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      at.getFullYear() === yesterday.getFullYear() &&
      at.getMonth() === yesterday.getMonth() &&
      at.getDate() === yesterday.getDate();
    const time = formatShortTime(iso);
    if (sameDay) return time;
    if (isYesterday) return `Yesterday · ${time}`;
    return at.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[16px] border border-[#525162]/50 bg-[#1C1B2E] p-4 md:p-5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "15px", color: "#FFFFFF" }}>
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function QuickCheckStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[64px]">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ backgroundColor: `${color}22`, color, ...inter }}
      >
        {value}
      </div>
      <span
        className="text-center"
        style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.5)", lineHeight: "12px" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function LiveSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionIdRaw = params?.sessionId;
  const sessionId = Number(Array.isArray(sessionIdRaw) ? sessionIdRaw[0] : sessionIdRaw);
  const hasValidId = Number.isFinite(sessionId) && sessionId > 0;

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [notesOpen, setNotesOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyDraft, setNotifyDraft] = useState("");
  const [reviewConfirmOpen, setReviewConfirmOpen] = useState(false);
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const leftLiveRef = useRef(false);

  useEffect(() => {
    const tick = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  const detailQuery = useQuery({
    queryKey: wayfinderQueryKeys.liveSessionDetail(sessionId),
    queryFn: () => fetchWayfinderLiveSessionDetail(sessionId),
    enabled: hasValidId,
    refetchInterval: 5_000,
    retry: false,
  });

  const detail =
    detailQuery.data?.isLive === true ? detailQuery.data : undefined;

  useEffect(() => {
    if (!hasValidId || leftLiveRef.current) return;

    const notLiveAnymore =
      detailQuery.isError ||
      (detailQuery.isSuccess && detailQuery.data && !detailQuery.data.isLive);

    if (!notLiveAnymore) return;

    leftLiveRef.current = true;
    notify.info("Child is not in a live session");
    router.replace("/dashboard/live-sessions");
  }, [
    hasValidId,
    detailQuery.isError,
    detailQuery.isSuccess,
    detailQuery.data,
    router,
  ]);

  const displayName = detail
    ? formatWayfinderStudentName(detail)
    : "Student";

  const startedMs = detail ? new Date(detail.startedAt).getTime() : NaN;
  const elapsedSeconds =
    detail && Number.isFinite(startedMs)
      ? Math.max(0, Math.floor((nowMs - startedMs) / 1000))
      : detail?.elapsedSeconds ?? 0;

  const progressPercent = detail
    ? Math.min(
        100,
        Math.round(
          (elapsedSeconds / Math.max(1, detail.durationMinutes * 60)) * 100,
        ),
      )
    : 0;

  const elapsedMinutesLabel = detail
    ? `${Math.min(detail.durationMinutes, Math.floor(elapsedSeconds / 60))} / ${detail.durationMinutes} min`
    : "";

  const visibleTranscript = useMemo(() => {
    const turns = detail?.transcript ?? [];
    if (transcriptExpanded) return turns;
    return turns.slice(-6);
  }, [detail?.transcript, transcriptExpanded]);

  const invalidateDetail = async () => {
    await queryClient.invalidateQueries({
      queryKey: wayfinderQueryKeys.liveSessionDetail(sessionId),
    });
    if (detail?.childId) {
      await queryClient.invalidateQueries({
        queryKey: wayfinderQueryKeys.studentNotes(detail.childId),
      });
    }
  };

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!detail) throw new Error("Session not loaded");
      const body = `[Review] Live session “${detail.currentLessonTitle}” (attempt ${detail.reteach.attemptNumber}). Check reteach / quick-check performance.`;
      return createWayfinderChildNote(detail.childId, body);
    },
    onSuccess: async () => {
      setReviewConfirmOpen(false);
      await invalidateDetail();
      notify.success("Marked for review");
    },
    onError: (err) => notify.error(err),
  });

  const notifyMutation = useMutation({
    mutationFn: async (body: string) => {
      if (!detail) throw new Error("Session not loaded");
      const note = await createWayfinderChildNote(detail.childId, body);
      return sendWayfinderChildNoteToParent(detail.childId, note.id);
    },
    onSuccess: async () => {
      setNotifyOpen(false);
      setNotifyDraft("");
      await invalidateDetail();
      notify.success("Parent notified");
    },
    onError: (err) => notify.error(err),
  });

  const onSubmitNotify = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = notifyDraft.trim();
    if (!trimmed) {
      notify.error("Write a short message for the parent");
      return;
    }
    notifyMutation.mutate(trimmed);
  };

  if (!hasValidId) {
    return (
      <div className="p-6">
        <p style={{ ...inter, color: "rgba(255,255,255,0.6)" }}>Invalid session.</p>
        <Link href="/dashboard/live-sessions" className="text-[#00CED1] mt-3 inline-block">
          Back to Live Sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 pb-24">
      <div className="flex items-start justify-between gap-3 mb-2 md:mb-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1
              className="uppercase"
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "28px",
                letterSpacing: "0.8px",
                color: "#DCE6EC",
              }}
            >
              Live Session View
            </h1>
            {detail ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
                style={{
                  backgroundColor: "rgba(255, 77, 79, 0.18)",
                  color: "#FF6F6F",
                  ...inter,
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.6px",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4F] animate-pulse" />
                LIVE
              </span>
            ) : null}
          </div>
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "13px",
              color: "rgba(255,255,255,0.45)",
              marginTop: "6px",
            }}
          >
            You are monitoring a live AI Instructor session.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/live-sessions")}
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 border border-[#525162] hover:bg-white/5 cursor-pointer"
            style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#DCE6EC" }}
          >
            Exit Live View
          </button>
          <div className="hidden md:block">
            <UserDropdown />
          </div>
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Wayfinder Dashboard" },
          { href: "/dashboard/live-sessions", label: "Live Sessions" },
          { href: `/dashboard/live-sessions/${sessionId}`, label: displayName },
        ]}
      />

      {detailQuery.isLoading && (
        <p className="py-16 text-center" style={{ ...inter, color: "rgba(255,255,255,0.5)" }}>
          Loading live session…
        </p>
      )}

      {!detailQuery.isLoading && !detail && (
        <p className="py-16 text-center" style={{ ...inter, color: "rgba(255,255,255,0.5)" }}>
          Returning to Live Sessions…
        </p>
      )}

      {detail && (
        <>
          {/* Overview bar */}
          <div
            className="mt-6 rounded-[16px] border border-[#525162]/50 bg-[#1C1B2E] p-4 md:p-5 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_0.9fr] gap-4 md:gap-5"
          >
            <div className="flex items-start gap-3">
              <PortalAvatar name={displayName} avatarUrl={detail.avatarUrl} size={56} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>
                    {displayName}
                  </p>
                  {detail.isLive && (
                    <span className="inline-flex items-center gap-1 text-[#4ADE80]" style={{ ...inter, fontSize: "11px", fontWeight: 600 }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                      Online
                    </span>
                  )}
                </div>
                <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                  {formatStudentGrade(detail.grade)}
                  {detail.focusArea ? ` · ${detail.focusArea}` : ""}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor: riskBadgeColor(detail.risk),
                      ...inter,
                      fontWeight: 600,
                      fontSize: "10px",
                      color: "#111023",
                    }}
                  >
                    Risk {detail.risk}
                  </span>
                  <Link
                    href={`/dashboard/student?id=${detail.childId}`}
                    className="text-[#00CED1] hover:opacity-80"
                    style={{ ...inter, fontWeight: 600, fontSize: "12px" }}
                  >
                    View Student Profile
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>
                Subject
              </p>
              <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>
                {detail.subject || detail.contentArea}
              </p>
            </div>

            <div>
              <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>
                Lesson
              </p>
              <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }} className="line-clamp-2">
                {detail.currentLessonTitle}
              </p>
              <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
                Lesson {detail.lessonOrder} of {detail.lessonCount}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                  Lesson Progress
                </p>
                <p style={{ ...inter, fontWeight: 700, fontSize: "13px", color: "#4ADE80" }}>
                  {progressPercent}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-[#313044] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4ADE80] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "6px" }}>
                {elapsedMinutesLabel} · {detail.phaseLabel}
              </p>
            </div>

            <div>
              <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>
                Session Time
              </p>
              <p style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF" }}>
                {formatElapsedTimer(elapsedSeconds)}
              </p>
              <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
                Started at {formatShortTime(detail.startedAt)}
              </p>
            </div>
          </div>

          {/* Main grid */}
          <div className="mt-4 md:mt-5 grid grid-cols-1 xl:grid-cols-[1.35fr_1fr_0.9fr] gap-4 md:gap-5">
            {/* Left column */}
            <div className="flex flex-col gap-4 md:gap-5">
              <Card title="Live Session View">
                <div className="rounded-[14px] bg-[#313044]/70 border border-[#525162]/40 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#7C6AF2]/30 flex items-center justify-center text-[#C4B5FD] text-xs font-bold flex-shrink-0">
                      AI
                    </div>
                    <div className="rounded-[12px] rounded-tl-sm bg-[#525162]/60 px-3 py-2 max-w-[90%]">
                      <p style={{ ...inter, fontSize: "13px", color: "#FFFFFF", lineHeight: "18px" }}>
                        {detail.board.aiPrompt || "AI Instructor is guiding the lesson…"}
                      </p>
                    </div>
                  </div>
                  {detail.board.studentResponse && (
                    <div className="flex items-start gap-3 justify-end">
                      <div className="rounded-[12px] rounded-tr-sm bg-[#00CED1]/15 border border-[#00CED1]/25 px-3 py-2 max-w-[90%]">
                        <p style={{ ...inter, fontSize: "13px", color: "#FFFFFF", lineHeight: "18px" }}>
                          {detail.board.studentResponse}
                        </p>
                      </div>
                      <PortalAvatar name={displayName} avatarUrl={detail.avatarUrl} size={36} />
                    </div>
                  )}
                  <p
                    className="pt-1"
                    style={{
                      ...inter,
                      fontSize: "12px",
                      color: detail.board.evaluating ? "#FBBF24" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {detail.liveStatus}
                  </p>
                </div>

                <div className="mt-4">
                  <p style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "12px" }}>
                    Quick Checks (Live)
                  </p>
                  <div className="flex flex-wrap gap-3 md:gap-4 justify-between">
                    <QuickCheckStat label="Correct" value={detail.quickChecks.correct} color="#4ADE80" />
                    <QuickCheckStat label="Incorrect" value={detail.quickChecks.incorrect} color="#FF6F6F" />
                    <QuickCheckStat label="Hints" value={detail.quickChecks.hintRequested} color="#60A5FA" />
                    <QuickCheckStat label="Reteach" value={detail.quickChecks.reteachTriggers} color="#FB923C" />
                    <QuickCheckStat label="Long Pause" value={detail.quickChecks.longPauses} color="#A78BFA" />
                    <QuickCheckStat label="Engagement" value={detail.quickChecks.engagementLevel} color="#F472B6" />
                  </div>
                </div>
              </Card>

              <Card
                title="Redacted Transcript"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                }
              >
                <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "12px" }}>
                  Learning answers only — chat is not stored. Sensitive content stays private.
                </p>
                {visibleTranscript.length === 0 ? (
                  <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                    No quick-check answers yet. Transcript updates as the student responds.
                  </p>
                ) : (
                  <ul className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {visibleTranscript.map((turn) => (
                      <li key={turn.id} className="flex gap-2.5">
                        <span
                          className="flex-shrink-0 tabular-nums"
                          style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.35)", width: "72px" }}
                        >
                          {formatClock(turn.at)}
                        </span>
                        <div className="min-w-0">
                          <p style={{ ...inter, fontWeight: 600, fontSize: "12px", color: turn.speaker === "AI" ? "#C4B5FD" : "#00CED1" }}>
                            {turn.speaker === "AI" ? "AI Instructor" : "Student"}
                          </p>
                          <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: "18px" }}>
                            {turn.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {(detail.transcript.length > 6 || transcriptExpanded) && (
                  <button
                    type="button"
                    onClick={() => setTranscriptExpanded((v) => !v)}
                    className="mt-3 text-[#00CED1] hover:opacity-80 cursor-pointer"
                    style={{ ...inter, fontWeight: 600, fontSize: "12px" }}
                  >
                    {transcriptExpanded ? "Show less" : "View Full (Redacted) Transcript"}
                  </button>
                )}
              </Card>
            </div>

            {/* Middle column */}
            <div className="flex flex-col gap-4 md:gap-5">
              <Card title="Reteach Triggers">
                {detail.reteach.active ? (
                  <div className="rounded-[12px] border border-[#FB923C]/35 bg-[#FB923C]/10 p-3 space-y-2">
                    <p style={{ ...inter, fontWeight: 700, fontSize: "13px", color: "#FB923C" }}>
                      Active Reteach
                    </p>
                    <MetaRow label="Reason" value={detail.reteach.reason ?? "—"} />
                    <MetaRow label="Concept" value={detail.reteach.concept ?? "—"} />
                    <MetaRow
                      label="Attempts"
                      value={`${detail.reteach.incorrectAttempts} incorrect · attempt #${detail.reteach.attemptNumber}`}
                    />
                    <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
                      {detail.reteach.status}
                    </p>
                  </div>
                ) : (
                  <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                    No active reteach. Attempt #{detail.reteach.attemptNumber}
                    {detail.reteach.isRetake ? " (retake session)." : "."}
                  </p>
                )}
              </Card>

              <Card title="SEL Events (Live)">
                {detail.selEvents.length === 0 ? (
                  <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                    No SEL signals detected in this session yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {detail.selEvents.map((ev) => (
                      <li key={ev.id} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}>
                            {ev.title}
                          </p>
                          <span style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                            {formatShortTime(ev.at)}
                          </span>
                        </div>
                        <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>
                          {ev.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card title="Session Summary (So Far)">
                <SummaryRow label="Concepts Covered" value={String(detail.summary.conceptsCovered)} />
                <SummaryRow label="Questions Attempted" value={String(detail.summary.questionsAttempted)} />
                <SummaryRow
                  label="Correct Answers"
                  value={
                    detail.summary.correctPercent != null
                      ? `${detail.summary.correctAnswers} (${detail.summary.correctPercent}%)`
                      : String(detail.summary.correctAnswers)
                  }
                />
                <SummaryRow label="Hints Used" value={String(detail.summary.hintsUsed)} />
                <SummaryRow label="Reteach Triggered" value={String(detail.summary.reteachTriggered)} />
                <SummaryRow label="Engagement Level" value={detail.summary.engagementLevel} />
              </Card>

              {detail.learningRecord ? (
                <Card title="Student Learning Record">
                  <SummaryRow label="Pathway" value={detail.learningRecord.instructionalPathway.replace(/_/g, " ")} />
                  <SummaryRow label="Instructional model" value={detail.learningRecord.instructionalModel} />
                  <SummaryRow label="Attempt" value={`#${detail.learningRecord.attemptNumber}`} />
                  <SummaryRow
                    label="Prompting"
                    value={detail.learningRecord.promptingLevel.replace(/_/g, " ")}
                  />
                  <SummaryRow
                    label="Independent mastery"
                    value={detail.learningRecord.independentMastery ? "Yes" : "Not yet"}
                  />
                  <SummaryRow
                    label="Next action"
                    value={detail.learningRecord.recommendedNextAction.replace(/_/g, " ")}
                  />
                  {detail.learningRecord.likelyMisconception ? (
                    <SummaryRow
                      label="Likely misconception"
                      value={detail.learningRecord.likelyMisconception}
                    />
                  ) : null}
                  {detail.learningRecord.prerequisiteWeakness ? (
                    <SummaryRow
                      label="Prerequisite"
                      value={detail.learningRecord.prerequisiteWeakness}
                    />
                  ) : null}
                </Card>
              ) : null}
            </div>

            {/* Right column — actions */}
            <div className="flex flex-col gap-4 md:gap-5">
              <Card title="Wayfinder Actions">
                <ActionBlock
                  title="Add Note"
                  description="Add an observation or note about this session."
                  buttonLabel="Add Note"
                  color="#60A5FA"
                  onClick={() => setNotesOpen(true)}
                />
                <ActionBlock
                  title="Mark for Review"
                  description="Flag this session for later review."
                  buttonLabel="Mark for Review"
                  color="#FB923C"
                  onClick={() => setReviewConfirmOpen(true)}
                  className="mt-3"
                />
                <ActionBlock
                  title="Notify Parent"
                  description="Send a note or alert to the parent."
                  buttonLabel="Notify Parent"
                  color="#4ADE80"
                  onClick={() => setNotifyOpen(true)}
                  className="mt-3"
                />
              </Card>

              <Card title="Recent Notes to Parent">
                {detail.recentParentNotes.length === 0 ? (
                  <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                    No notes have been shared with the parent yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {detail.recentParentNotes.map((note) => (
                      <li key={note.id} className="border-b border-white/5 pb-2 last:border-0">
                        <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                          {formatRelativeNoteTime(note.sentToParentAt)}
                        </p>
                        <p
                          className="line-clamp-3"
                          style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}
                        >
                          {note.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/dashboard/message?studentId=${detail.childId}&contact=parent`}
                  className="inline-flex items-center gap-1 mt-3 text-[#00CED1] hover:opacity-80"
                  style={{ ...inter, fontWeight: 600, fontSize: "12px" }}
                >
                  View All Messages
                  <span aria-hidden>→</span>
                </Link>
              </Card>
            </div>
          </div>
        </>
      )}

      <div
        className="fixed bottom-[72px] md:bottom-0 left-0 right-0 md:left-[var(--sidebar-w,0)] z-20 px-4 py-2.5 border-t border-[#525162]/40 bg-[#111023]/95 backdrop-blur"
      >
        <p
          className="max-w-5xl mx-auto flex items-center gap-2"
          style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 opacity-70">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          You are viewing in observer mode. The student and AI Instructor are not aware you are watching.
        </p>
      </div>

      {detail && (
        <WayfinderChildNotesDrawer
          open={notesOpen}
          childId={detail.childId}
          onClose={() => setNotesOpen(false)}
        />
      )}

      <ConfirmModal
        open={reviewConfirmOpen}
        title="Mark for review?"
        description={`Create an internal review flag note for ${displayName}'s current lesson so you can follow up later.`}
        confirmLabel="Mark for Review"
        tone="teal"
        isConfirming={reviewMutation.isPending}
        onConfirm={() => reviewMutation.mutate()}
        onCancel={() => setReviewConfirmOpen(false)}
      />

      {notifyOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 cursor-pointer"
            aria-label="Close"
            onClick={() => !notifyMutation.isPending && setNotifyOpen(false)}
          />
          <form
            onSubmit={onSubmitNotify}
            className="relative w-full max-w-md rounded-[20px] border border-[#525162]/50 bg-[#313044] p-6 shadow-xl"
            style={inter}
          >
            <h2 className="text-white text-lg font-semibold">Notify Parent</h2>
            <p className="text-white/60 text-sm mt-2">
              This creates a note and immediately shares it with the parent.
            </p>
            <textarea
              value={notifyDraft}
              onChange={(e) => setNotifyDraft(e.target.value)}
              rows={4}
              placeholder={`e.g. ${displayName} is working through ${detail?.currentLessonTitle ?? "today's lesson"} — here's what I noticed…`}
              className="mt-4 w-full rounded-[12px] bg-[#1C1B2E] border border-[#525162] px-3 py-2.5 text-white/90 outline-none resize-none"
              style={{ ...inter, fontSize: "14px" }}
              disabled={notifyMutation.isPending}
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                disabled={notifyMutation.isPending}
                onClick={() => setNotifyOpen(false)}
                className="px-4 py-2 rounded-full text-white/70 border border-white/15 hover:bg-white/5 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={notifyMutation.isPending}
                className="px-4 py-2 rounded-full font-semibold bg-[#4ADE80] text-[#111023] hover:opacity-90 cursor-pointer disabled:opacity-60"
              >
                {notifyMutation.isPending ? "Sending…" : "Send to Parent"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
      <span style={{ color: "rgba(255,255,255,0.45)" }}>{label}: </span>
      {value}
    </p>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
      <span style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{label}</span>
      <span style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}>{value}</span>
    </div>
  );
}

function ActionBlock({
  title,
  description,
  buttonLabel,
  color,
  onClick,
  className = "",
}: {
  title: string;
  description: string;
  buttonLabel: string;
  color: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div className={`rounded-[12px] border border-[#525162]/40 bg-[#313044]/50 p-3 ${className}`}>
      <p style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}>{title}</p>
      <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px", marginBottom: "10px" }}>
        {description}
      </p>
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-full py-2 font-semibold cursor-pointer hover:opacity-90"
        style={{ ...inter, fontSize: "13px", backgroundColor: color, color: "#111023" }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
