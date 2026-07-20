"use client";

import Link from "next/link";
import BadgePreviewStrip, {
  type BadgePreviewItem,
} from "@/components/shared/BadgePreviewStrip";
import PortalAvatar from "@/components/shared/PortalAvatar";
import ProgressRing from "@/components/shared/ProgressRing";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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
      className={`rounded-[12px] p-4 w-full min-w-0 ${className}`}
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

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-5 w-full min-w-0">
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <PortalAvatar
          name={data.displayName}
          avatarUrl={data.avatarUrl}
          size={52}
          useWordInitials
        />
        <div className="min-w-0">
          <p
            className="truncate"
            style={{ ...inter, fontWeight: 700, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}
          >
            {data.displayName}
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>
            {data.gradeLabel}
            {data.metaLine ? ` · ${data.metaLine}` : ""}
          </p>
          {data.activeStatus ? (
            <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
              {data.activeStatus}
            </p>
          ) : null}
        </div>
      </div>

      <div className="hidden xl:block w-px self-stretch bg-white/10 shrink-0" />

      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(0,206,209,0.12)" }}
        >
          <BookIcon />
        </div>
        <div className="min-w-0">
          <p style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Current Lesson
          </p>
          <p
            className="truncate max-w-[160px]"
            style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#FFFFFF", marginTop: "2px" }}
            title={data.currentLessonTitle ?? undefined}
          >
            {data.currentLessonTitle ?? "Not in a lesson"}
          </p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>
            {data.lessonSubtitle ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <ProgressRing percent={masteryPct} size={52} strokeWidth={4}>
          <span style={{ ...inter, fontWeight: 700, fontSize: "12px", color: "#FFFFFF" }}>
            {masteryPct != null ? `${masteryPct}%` : "—"}
          </span>
        </ProgressRing>
        <div className="min-w-0">
          <p style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Mastery
          </p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
            {data.masteryDetail ?? "No attempts yet"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <ProgressRing percent={progressPct} size={52} strokeWidth={4}>
          <span style={{ ...inter, fontWeight: 700, fontSize: "11px", color: "#FFFFFF" }}>
            {progressCompleted}/{progressTotal || "—"}
          </span>
        </ProgressRing>
        <div className="min-w-0">
          <p style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Course Progress
          </p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
            Lessons Completed
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0 shrink-0">
        <p style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Badges Earned
        </p>
        {previews.length > 0 ? (
          <BadgePreviewStrip previews={previews} className="!justify-start" />
        ) : (
          <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            0 badges yet
          </p>
        )}
      </div>

      <div className="xl:ml-auto shrink-0">
        <Link
          href={data.profileHref}
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-opacity hover:opacity-90"
          style={{
            ...inter,
            fontWeight: 600,
            fontSize: "12px",
            color: "#111023",
            backgroundColor: "#00CED1",
          }}
        >
          <UserIcon />
          {data.profileLabel ?? "View Profile"}
        </Link>
      </div>
    </div>
  );
}
