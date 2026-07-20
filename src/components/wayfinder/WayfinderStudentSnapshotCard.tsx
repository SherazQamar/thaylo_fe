"use client";

import { useQuery } from "@tanstack/react-query";
import MessageSnapshotCard, {
  type MessageSnapshotData,
} from "@/components/shared/chat/MessageSnapshotCard";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  fetchWayfinderStudentSnapshot,
  wayfinderQueryKeys,
} from "@/lib/wayfinder-api";
import {
  formatActiveStatus,
  formatStudentGrade,
  formatWayfinderStudentName,
} from "@/lib/wayfinder-student";

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

  const snapshot = snapshotQuery.data;
  let data: MessageSnapshotData | null = null;

  if (snapshot) {
    const displayName = formatWayfinderStudentName(snapshot);
    data = {
      displayName,
      gradeLabel: formatStudentGrade(snapshot.grade),
      metaLine: snapshot.parentName,
      activeStatus: formatActiveStatus(snapshot.lastActiveAt),
      profileHref: `/dashboard/student?id=${snapshot.childId}`,
      avatarUrl: snapshot.avatarUrl,
      currentLessonTitle: snapshot.currentLessonTitle,
      lessonSubtitle:
        snapshot.currentLessonOrder != null && snapshot.progressTotal > 0
          ? `Lesson ${snapshot.currentLessonOrder} of ${snapshot.progressTotal}`
          : snapshot.progressLabel,
      masteryPercent: snapshot.masteryPercent,
      masteryDetail:
        snapshot.masteryAttempted > 0
          ? `${snapshot.masteryPassed} of ${snapshot.masteryAttempted} Attempted`
          : "No attempts yet",
      progressCompleted: snapshot.progressCompleted,
      progressTotal: snapshot.progressTotal,
      badgePreviews: snapshot.badgePreviews ?? [],
    };
  }

  return (
    <MessageSnapshotCard
      className={className}
      data={data}
      isLoading={snapshotQuery.isLoading}
      error={
        snapshotQuery.isError ? getApiErrorMessage(snapshotQuery.error) : null
      }
    />
  );
}
