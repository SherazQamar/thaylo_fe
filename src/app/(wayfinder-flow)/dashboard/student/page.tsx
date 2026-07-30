"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import StudentProgressOverview from "@/components/shared/StudentProgressOverview";
import { useNotifyError } from "@/hooks/use-notify-error";
import {
  fetchWayfinderStudentSnapshot,
  wayfinderQueryKeys,
} from "@/lib/wayfinder-api";
import {
  formatStudentGrade,
  formatWayfinderStudentName,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function StudentDetailsPage() {
  const searchParams = useSearchParams();
  const childIdRaw = searchParams.get("id");
  const childId = childIdRaw ? Number(childIdRaw) : NaN;
  const hasValidId = Number.isFinite(childId) && childId > 0;

  const snapshotQuery = useQuery({
    queryKey: wayfinderQueryKeys.studentSnapshot(childId),
    queryFn: () => fetchWayfinderStudentSnapshot(childId),
    enabled: hasValidId,
  });
  useNotifyError(snapshotQuery.error, snapshotQuery.isError);

  const snapshot = snapshotQuery.data;
  const displayName = snapshot
    ? formatWayfinderStudentName(snapshot)
    : "Student";

  return (
    <div className="p-4 md:p-6 lg:p-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/students" className="text-white/60 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1
            className="uppercase"
            style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
          >
            Student Details
          </h1>
        </div>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      {!hasValidId ? (
        <p style={{ ...inter, color: "rgba(255,255,255,0.7)" }}>
          Select a student from your caseload to view details.
        </p>
      ) : snapshotQuery.isLoading ? (
        <p style={{ ...inter, color: "rgba(255,255,255,0.7)" }}>Loading student…</p>
      ) : snapshotQuery.isError ? (
        <p style={{ ...inter, color: "rgba(255,255,255,0.7)" }}>
          Unable to load student details right now.
        </p>
      ) : snapshot ? (
        <StudentProgressOverview
          displayName={displayName}
          gradeLabel={formatStudentGrade(snapshot.grade)}
          avatarUrl={snapshot.avatarUrl}
          messagesHref={`/dashboard/message?childId=${snapshot.childId}`}
          showRiskBadge
          progressLabel={snapshot.progressLabel}
          gardenMessage={`${displayName}'s plant · ${snapshot.masteryLabel}`}
          badgeCount={snapshot.badgesEarned}
          badgePreviews={snapshot.badgePreviews}
        />
      ) : null}
    </div>
  );
}
