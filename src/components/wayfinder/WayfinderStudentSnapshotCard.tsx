"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  fetchWayfinderStudentSnapshot,
  wayfinderQueryKeys,
  type WayfinderStudentSnapshot,
} from "@/lib/wayfinder-api";
import {
  formatLastActiveAt,
  formatStudentGrade,
  formatWayfinderStudentName,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function SnapshotStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p style={{ ...inter, fontWeight: 500, fontSize: "10px", lineHeight: "14px", color: "rgba(255,255,255,0.45)" }}>
        {label}
      </p>
      <p
        style={{ ...inter, fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: "#FFFFFF", marginTop: "2px" }}
        className="truncate"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function SnapshotBody({ snapshot }: { snapshot: WayfinderStudentSnapshot }) {
  const displayName = formatWayfinderStudentName(snapshot);
  const lastActive = formatLastActiveAt(snapshot.lastActiveAt);

  return (
    <>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p style={{ ...inter, fontWeight: 700, fontSize: "14px", lineHeight: "18px", color: "#FFFFFF" }} className="truncate">
            {displayName}
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
            {formatStudentGrade(snapshot.grade)} · {snapshot.contentArea}
          </p>
        </div>
        <Link
          href={`/dashboard/student?id=${snapshot.childId}`}
          className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[#00CED1] hover:opacity-80"
          style={inter}
        >
          Profile
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
        <SnapshotStat
          label="Current lesson"
          value={snapshot.currentLessonTitle ?? "Not in a lesson"}
        />
        <SnapshotStat label="Last active" value={lastActive} />
        <SnapshotStat label="Mastery (of attempted)" value={snapshot.masteryLabel} />
        <SnapshotStat label="Course progress" value={snapshot.progressLabel} />
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <p style={{ ...inter, fontWeight: 500, fontSize: "10px", color: "rgba(255,255,255,0.45)" }}>
          Badges earned
        </p>
        {snapshot.badgesEarned > 0 ? (
          <div className="flex items-center gap-1.5 mt-1.5">
            {snapshot.badgeIcons.map((src) => (
              <div
                key={src}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#525162" }}
              >
                <Image src={src} alt="badge" width={16} height={16} className="w-4 h-4 object-contain" unoptimized />
              </div>
            ))}
            <span style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.55)", marginLeft: "4px" }}>
              {snapshot.badgesEarned}
            </span>
          </div>
        ) : (
          <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            0 badges yet
          </p>
        )}
      </div>
    </>
  );
}

interface WayfinderStudentSnapshotCardProps {
  childId: number | null;
  className?: string;
}

export default function WayfinderStudentSnapshotCard({
  childId,
  className = "",
}: WayfinderStudentSnapshotCardProps) {
  const snapshotQuery = useQuery({
    queryKey: wayfinderQueryKeys.studentSnapshot(childId ?? 0),
    queryFn: () => fetchWayfinderStudentSnapshot(childId!),
    enabled: typeof childId === "number" && childId > 0,
    refetchInterval: 30_000,
  });

  if (!childId) return null;

  return (
    <aside
      className={`rounded-[12px] p-3.5 w-full max-w-[280px] ${className}`}
      style={{ backgroundColor: "#313044", border: "1px solid rgba(255,255,255,0.06)" }}
      aria-label="Student snapshot"
    >
      {snapshotQuery.isLoading && (
        <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
          Loading snapshot…
        </p>
      )}

      {snapshotQuery.isError && (
        <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "#FF7B7B" }} role="alert">
          {getApiErrorMessage(snapshotQuery.error)}
        </p>
      )}

      {snapshotQuery.data && <SnapshotBody snapshot={snapshotQuery.data} />}
    </aside>
  );
}
