"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import MessageSnapshotCard, {
  type MessageSnapshotData,
} from "@/components/shared/chat/MessageSnapshotCard";
import { getApiErrorMessage } from "@/lib/auth-api";
import { fetchParentChildBadges } from "@/lib/badge-api";
import {
  fetchParentChild,
  fetchParentDashboardStats,
} from "@/lib/parent-api";

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function formatChildName(child: {
  firstName?: string | null;
  secondName?: string | null;
  userName: string;
}) {
  const full = [child.firstName, child.secondName].filter(Boolean).join(" ").trim();
  return full || child.userName;
}

interface ParentChildMessageSnapshotCardProps {
  childId: number | null;
  className?: string;
}

export default function ParentChildMessageSnapshotCard({
  childId,
  className = "",
}: ParentChildMessageSnapshotCardProps) {
  const enabled = typeof childId === "number" && childId > 0;

  const childQuery = useQuery({
    queryKey: ["parent-child", childId],
    queryFn: () => fetchParentChild(childId!),
    enabled,
  });

  const badgesQuery = useQuery({
    queryKey: ["parent-child-badges", childId],
    queryFn: () => fetchParentChildBadges(childId!),
    enabled,
    refetchInterval: 30_000,
  });

  const statsQuery = useQuery({
    queryKey: ["parent-dashboard-stats"],
    queryFn: fetchParentDashboardStats,
    enabled,
    staleTime: 60_000,
  });

  const data = useMemo<MessageSnapshotData | null>(() => {
    if (!childId || !childQuery.data || !badgesQuery.data) return null;
    const child = childQuery.data;
    const badges = badgesQuery.data;
    const mastery = statsQuery.data?.childrenMastery.find((m) => m.id === childId);
    const mastered = mastery?.masteredCount ?? badges.masteredCount;
    const attempted = mastery?.attemptedCount ?? badges.masteredCount;
    const masteryPercent =
      attempted > 0 ? Math.round((mastered / attempted) * 100) : null;

    return {
      displayName: formatChildName(child),
      gradeLabel: formatChildGrade(child.grade),
      metaLine: badges.plantStatus,
      profileHref: `/parent-dashboard/child?id=${childId}`,
      avatarUrl: child.avatarUrl,
      currentLessonTitle: null,
      lessonSubtitle: `${badges.masteredCount} of ${badges.totalLessons} mastered`,
      masteryPercent,
      masteryDetail:
        attempted > 0
          ? `${mastered} of ${attempted} Attempted`
          : "No attempts yet",
      progressCompleted: badges.masteredCount,
      progressTotal: badges.totalLessons,
      badgePreviews: badges.badges
        .filter((b) => b.count > 0 && (b.imageUrlSmall || b.imageUrl))
        .map((b) => ({
          kind: b.kind,
          name: b.name,
          imageUrl: b.imageUrlSmall || b.imageUrl!,
          count: b.count,
        })),
      badgesEarned: badges.badgesEarned,
    };
  }, [badgesQuery.data, childId, childQuery.data, statsQuery.data]);

  if (!childId) return null;

  const error =
    childQuery.isError
      ? getApiErrorMessage(childQuery.error)
      : badgesQuery.isError
        ? getApiErrorMessage(badgesQuery.error)
        : null;

  return (
    <MessageSnapshotCard
      className={className}
      data={data}
      isLoading={childQuery.isLoading || badgesQuery.isLoading}
      error={error}
    />
  );
}
