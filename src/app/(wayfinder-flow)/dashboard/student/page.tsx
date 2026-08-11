"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import WayfinderChildNotesDrawer from "@/components/wayfinder/WayfinderChildNotesDrawer";
import StudentProgressOverview, {
  type GuidanceAlertItem,
} from "@/components/shared/StudentProgressOverview";
import WeeklyGuidanceModal from "@/components/shared/WeeklyGuidanceModal";
import RecommendedNextStepModal from "@/components/shared/RecommendedNextStepModal";
import { useNotifyError } from "@/hooks/use-notify-error";
import { downloadDomSnapshotPdf } from "@/lib/dom-snapshot-pdf";
import { notify } from "@/lib/notify";
import {
  fetchWayfinderChildNotes,
  fetchWayfinderStudentSnapshot,
  fetchWayfinderWeeklyGuidance,
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
  const [notesOpen, setNotesOpen] = useState(false);
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [nextStepModalOpen, setNextStepModalOpen] = useState(false);
  const snapshotRef = useRef<HTMLDivElement>(null);

  const snapshotQuery = useQuery({
    queryKey: wayfinderQueryKeys.studentSnapshot(childId),
    queryFn: () => fetchWayfinderStudentSnapshot(childId),
    enabled: hasValidId,
  });
  useNotifyError(snapshotQuery.error, snapshotQuery.isError);

  const notesQuery = useQuery({
    queryKey: wayfinderQueryKeys.studentNotes(childId),
    queryFn: () => fetchWayfinderChildNotes(childId),
    enabled: hasValidId,
  });

  const guidanceQuery = useQuery({
    queryKey: wayfinderQueryKeys.studentWeeklyGuidance(childId),
    queryFn: () => fetchWayfinderWeeklyGuidance(childId),
    enabled: hasValidId,
  });

  const snapshot = snapshotQuery.data;
  const displayName = snapshot
    ? formatWayfinderStudentName(snapshot)
    : "Student";
  const noteCount = notesQuery.data?.length ?? 0;
  const notesSubtitle =
    noteCount === 0
      ? "Add or review internal notes"
      : `${noteCount} note${noteCount === 1 ? "" : "s"} · tap to manage`;

  const guidanceAlerts: GuidanceAlertItem[] | undefined = guidanceQuery.data
    ? [
        {
          id: "week-alert",
          tone: guidanceQuery.data.weekAlert.tone,
          text: guidanceQuery.data.weekAlert.text,
          onClick: () => setWeekModalOpen(true),
        },
        {
          id: "next-step",
          tone: "coral",
          text: `Recommended next step: ${guidanceQuery.data.recommendedNextStep.text}`,
          onClick: () => setNextStepModalOpen(true),
        },
      ]
    : undefined;

  const reportMutation = useMutation({
    mutationFn: async () => {
      const node = snapshotRef.current;
      if (!node) {
        throw new Error("Student details are not ready to export yet.");
      }
      const safeName =
        displayName.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "-").toLowerCase() ||
        "student";
      const dateStamp = new Date().toISOString().slice(0, 10);
      await downloadDomSnapshotPdf(
        node,
        `thaylo-snapshot-${safeName}-${dateStamp}.pdf`,
        { backgroundColor: "#111023" },
      );
    },
    onSuccess: () => notify.success("Snapshot PDF downloaded"),
    onError: (err) => {
      console.error("[snapshot-pdf]", err);
      notify.error(err, "Could not create snapshot PDF");
    },
  });

  return (
    <div className="p-4 md:p-6 lg:p-10 overflow-y-auto">
      <div
        className="flex items-center justify-between mb-6 md:mb-8"
        data-snapshot-ignore="true"
      >
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
        <>
          <div
            ref={snapshotRef}
            className="rounded-[12px]"
            style={{ backgroundColor: "#111023" }}
          >
            <StudentProgressOverview
              displayName={displayName}
              gradeLabel={formatStudentGrade(snapshot.grade)}
              avatarUrl={snapshot.avatarUrl}
              messagesHref={`/dashboard/message?childId=${snapshot.childId}`}
              showRiskBadge
              riskLabel={snapshot.risk ?? "Clear"}
              riskReason={snapshot.riskReason}
              progressLabel={snapshot.progressLabel}
              confidenceLabel={
                snapshot.learningSummary?.confidence ??
                snapshot.confidence ??
                "Medium"
              }
              gardenMessage={`${displayName}'s plant · ${snapshot.masteryLabel}`}
              badgeCount={snapshot.badgesEarned}
              badgePreviews={snapshot.badgePreviews}
              curricularProgress={snapshot.curricularProgress}
              learningSummary={snapshot.learningSummary}
              wellbeing={snapshot.wellbeing}
              onWayfinderNotesClick={() => setNotesOpen(true)}
              wayfinderNotesSubtitle={notesSubtitle}
              onReportClick={() => reportMutation.mutate()}
              reportBusy={reportMutation.isPending}
              guidanceAlerts={guidanceAlerts}
              guidanceLoading={guidanceQuery.isLoading}
            />
          </div>
          <WayfinderChildNotesDrawer
            open={notesOpen}
            childId={snapshot.childId}
            onClose={() => setNotesOpen(false)}
          />
          <WeeklyGuidanceModal
            open={weekModalOpen}
            childName={displayName}
            emptyMessage={guidanceQuery.data?.emptyStateMessage ?? null}
            sessions={guidanceQuery.data?.sessionsThisWeek ?? []}
            onClose={() => setWeekModalOpen(false)}
          />
          <RecommendedNextStepModal
            open={nextStepModalOpen}
            childName={displayName}
            recommendation={
              guidanceQuery.data?.recommendedNextStep.text ??
              "Keep encouraging steady practice this week."
            }
            source={guidanceQuery.data?.recommendedNextStep.source ?? "fallback"}
            sessions={guidanceQuery.data?.sessionsThisWeek ?? []}
            nextStep={guidanceQuery.data?.recommendedNextStep}
            modulesHref="/child-dashboard/modules"
            onClose={() => setNextStepModalOpen(false)}
          />
        </>
      ) : null}
    </div>
  );
}

