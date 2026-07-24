"use client";

import Link from "next/link";
import BadgePreviewStrip, {
  type BadgePreviewItem,
} from "@/components/shared/BadgePreviewStrip";
import InfoTooltip from "@/components/shared/InfoTooltip";
import PortalAvatar from "@/components/shared/PortalAvatar";
import ProgressRing from "@/components/shared/ProgressRing";
import { SHARED_PROGRESS_HINTS } from "@/lib/portal-help-text";

const inter = { fontFamily: "Inter, sans-serif" } as const;

/** Message snapshot shows at most 2 badge icons, then +N. */
export const MESSAGE_BADGE_PREVIEW_MAX = 2;
export const MESSAGE_BADGE_PREVIEW_SIZE_PX = 28;

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="#00CED1"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="#00CED1"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export type MessageSnapshotData = {
  displayName: string;
  gradeLabel: string;
  metaLine?: string | null;
  activeStatus?: string | null;
  profileHref: string;
  profileLabel?: string;
  avatarUrl?: string | null;
  currentLessonTitle?: string | null;
  lessonSubtitle?: string;
  masteryPercent?: number | null;
  masteryDetail?: string;
  progressCompleted?: number;
  progressTotal?: number;
  badgePreviews?: BadgePreviewItem[];
  badgesEarned?: number;
};

type MessageSnapshotCardProps = {
  data: MessageSnapshotData | null;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
};

export default function MessageSnapshotCard({
  data,
  isLoading,
  error,
  className = "",
}: MessageSnapshotCardProps) {
  return (
    <aside
      className={`rounded-[12px] p-3 w-full min-w-0 overflow-hidden ${className}`}
      style={{ backgroundColor: "#313044", border: "1px solid rgba(255,255,255,0.06)" }}
      aria-label="Participant snapshot"
    >
      {isLoading && (
        <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
          Loading snapshot…
        </p>
      )}

      {error && (
        <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "#FF7B7B" }} role="alert">
          {error}
        </p>
      )}

      {data && !isLoading && !error ? <SnapshotBody data={data} /> : null}
    </aside>
  );
}

function SnapshotBody({ data }: { data: MessageSnapshotData }) {
  const masteryPct = data.masteryPercent ?? null;
  const progressCompleted = data.progressCompleted ?? 0;
  const progressTotal = data.progressTotal ?? 0;
  const progressPct =
    progressTotal > 0
      ? Math.round((progressCompleted / progressTotal) * 100)
      : null;
  const previews = data.badgePreviews ?? [];
  const badgesEarned =
    data.badgesEarned ??
    previews.reduce((sum, badge) => sum + (badge.count ?? 1), 0);

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <PortalAvatar
            name={data.displayName}
            avatarUrl={data.avatarUrl}
            size={44}
            useWordInitials
          />
          <div className="min-w-0">
            <p
              className="truncate"
              style={{ ...inter, fontWeight: 700, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}
            >
              {data.displayName}
            </p>
            <p
              className="truncate"
              style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}
            >
              {data.gradeLabel}
              {data.metaLine ? ` · ${data.metaLine}` : ""}
            </p>
          </div>
        </div>

        <Link
          href={data.profileHref}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition-opacity hover:opacity-90 shrink-0"
          style={{
            ...inter,
            fontWeight: 600,
            fontSize: "12px",
            color: "#111023",
            backgroundColor: "#00CED1",
          }}
        >
          <UserIcon />
          <span className="hidden sm:inline">{data.profileLabel ?? "View Profile"}</span>
        </Link>
      </div>

      {/* Compact row for phones / tablets — keeps composer visible */}
      <div className="flex lg:hidden items-center justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <p style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Current Lesson
          </p>
          <p
            className="truncate"
            style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#FFFFFF", marginTop: "2px" }}
          >
            {data.currentLessonTitle ?? "Not in a lesson"}
          </p>
        </div>
        <div className="shrink-0">
          {previews.length > 0 ? (
            <BadgePreviewStrip
              previews={previews}
              totalEarned={badgesEarned}
              maxVisible={MESSAGE_BADGE_PREVIEW_MAX}
              size={MESSAGE_BADGE_PREVIEW_SIZE_PX}
              className="!justify-end !gap-1.5 !flex-nowrap"
            />
          ) : (
            <p style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              0 badges
            </p>
          )}
        </div>
      </div>

      {/* Full stats grid — desktop only */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-3 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 rounded-lg px-2.5 py-2 bg-white/[0.03]">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(0,206,209,0.12)" }}
          >
            <BookIcon />
          </div>
          <div className="min-w-0">
            <p style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Current Lesson
            </p>
            <p
              className="truncate"
              style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#FFFFFF", marginTop: "2px" }}
              title={data.currentLessonTitle ?? undefined}
            >
              {data.currentLessonTitle ?? "Not in a lesson"}
            </p>
            <p className="truncate" style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>
              {data.lessonSubtitle ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 min-w-0 rounded-lg px-2.5 py-2 bg-white/[0.03]">
          <ProgressRing percent={masteryPct} size={44} strokeWidth={3.5}>
            <span style={{ ...inter, fontWeight: 700, fontSize: "11px", color: "#FFFFFF" }}>
              {masteryPct != null ? `${masteryPct}%` : "—"}
            </span>
          </ProgressRing>
          <div className="min-w-0">
            <p
              className="flex items-center gap-1"
              style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              Mastery
              <InfoTooltip content={SHARED_PROGRESS_HINTS.mastery} align="left" />
            </p>
            <p className="truncate" style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
              {data.masteryDetail ?? "No attempts yet"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 min-w-0 rounded-lg px-2.5 py-2 bg-white/[0.03]">
          <ProgressRing percent={progressPct} size={44} strokeWidth={3.5}>
            <span style={{ ...inter, fontWeight: 700, fontSize: "10px", color: "#FFFFFF" }}>
              {progressCompleted}/{progressTotal || "—"}
            </span>
          </ProgressRing>
          <div className="min-w-0">
            <p
              className="flex items-center gap-1"
              style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              Course Progress
              <InfoTooltip content={SHARED_PROGRESS_HINTS.courseProgress} align="left" />
            </p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
              Lessons Completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 min-w-0 rounded-lg px-2.5 py-2 bg-white/[0.03]">
          <div className="min-w-0 flex-1">
            <p
              className="flex items-center gap-1"
              style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              Badges Earned
              <InfoTooltip content={SHARED_PROGRESS_HINTS.badgesEarned} align="left" />
            </p>
            <div className="mt-1.5">
              {previews.length > 0 ? (
                <BadgePreviewStrip
                  previews={previews}
                  totalEarned={badgesEarned}
                  maxVisible={MESSAGE_BADGE_PREVIEW_MAX}
                  size={MESSAGE_BADGE_PREVIEW_SIZE_PX}
                  className="!justify-start !gap-1.5 !flex-nowrap"
                />
              ) : (
                <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                  0 badges yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
