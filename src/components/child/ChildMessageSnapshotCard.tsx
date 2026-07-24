"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import MessageSnapshotCard, {
  type MessageSnapshotData,
} from "@/components/shared/chat/MessageSnapshotCard";
import { getApiErrorMessage } from "@/lib/auth-api";
import { fetchChildBadges } from "@/lib/badge-api";
import { useChildAuthStore } from "@/stores/child-auth.store";

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

interface ChildMessageSnapshotCardProps {
  className?: string;
}

export default function ChildMessageSnapshotCard({
  className = "",
}: ChildMessageSnapshotCardProps) {
  const child = useChildAuthStore((s) => s.child);

  const badgesQuery = useQuery({
    queryKey: ["child-badges"],
    queryFn: fetchChildBadges,
    enabled: Boolean(child?.id),
    refetchInterval: 30_000,
  });

  const data = useMemo<MessageSnapshotData | null>(() => {
    if (!child || !badgesQuery.data) return null;
    const badges = badgesQuery.data;
    const masteryPercent =
      badges.totalLessons > 0
        ? Math.round((badges.masteredCount / badges.totalLessons) * 100)
        : null;

    return {
      displayName: child.userName,
      gradeLabel: formatChildGrade(child.grade),
      metaLine: badges.plantStatus,
      profileHref: "/child-dashboard/profile",
      profileLabel: "My Profile",
      avatarUrl: child.avatarUrl,
      currentLessonTitle: null,
      lessonSubtitle: `${badges.masteredCount} of ${badges.totalLessons} mastered`,
      masteryPercent,
      masteryDetail:
        badges.masteredCount > 0
          ? `${badges.masteredCount} of ${badges.totalLessons} Attempted`
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
  }, [badgesQuery.data, child]);

  if (!child) return null;

  return (
    <MessageSnapshotCard
      className={className}
      data={data}
      isLoading={badgesQuery.isLoading}
      error={
        badgesQuery.isError ? getApiErrorMessage(badgesQuery.error) : null
      }
    />
  );
}
