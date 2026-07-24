import type { WayfinderStudent } from "@/lib/wayfinder-api";

export function formatWayfinderStudentName(student: Pick<WayfinderStudent, "firstName" | "secondName" | "userName">) {
  const fullName = [student.firstName, student.secondName].filter(Boolean).join(" ").trim();
  return fullName || student.userName;
}

export function formatStudentGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

export function formatAssignedDate(assignedAt: string | null | undefined): string {
  if (!assignedAt) return "—";
  return new Date(assignedAt).toLocaleDateString();
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Relative last-active label for student cards.
 * e.g. "Just now", "12 minutes ago", "3 hours ago", "1 day ago", "2 days ago".
 */
export function formatLastActiveAt(lastActiveAt: string | null | undefined): string {
  if (!lastActiveAt) return "Not yet active";

  const at = new Date(lastActiveAt);
  if (Number.isNaN(at.getTime())) return "Not yet active";

  const diffMs = Math.max(0, Date.now() - at.getTime());
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < minuteMs) return "Just now";

  const minutes = Math.floor(diffMs / minuteMs);
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(diffMs / hourMs);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(diffMs / dayMs);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function formatLastActiveLabel(lastActiveAt: string | null | undefined): string {
  if (!lastActiveAt) return "Last active: Not yet active";
  return `Last active: ${formatLastActiveAt(lastActiveAt)}`;
}

/**
 * Header status line for message snapshot, e.g. "Active today at 10:15 AM".
 */
export function formatActiveStatus(lastActiveAt: string | null | undefined): string {
  if (!lastActiveAt) return "Not yet active";

  const at = new Date(lastActiveAt);
  if (Number.isNaN(at.getTime())) return "Not yet active";

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const todayStart = startOfLocalDay(now);
  const atStart = startOfLocalDay(at);
  const dayDiff = Math.round((todayStart.getTime() - atStart.getTime()) / dayMs);
  const time = at.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (dayDiff === 0) return `Active today at ${time}`;
  if (dayDiff === 1) return `Active yesterday at ${time}`;
  if (dayDiff > 1 && dayDiff < 7) {
    const weekday = at.toLocaleDateString(undefined, { weekday: "long" });
    return `Active ${weekday} at ${time}`;
  }
  return `Last active ${at.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}

/** True when last activity was within the last ~2 hours (for green "Active" dot). */
export function isRecentlyActive(lastActiveAt: string | null | undefined): boolean {
  if (!lastActiveAt) return false;
  const at = new Date(lastActiveAt);
  if (Number.isNaN(at.getTime())) return false;
  return Date.now() - at.getTime() < 2 * 60 * 60 * 1000;
}

/** Elapsed lesson timer as MM:SS or H:MM:SS. */
export function formatElapsedTimer(elapsedSeconds: number): string {
  const total = Math.max(0, Math.floor(elapsedSeconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

export function riskBadgeColor(risk: string): string {
  switch (risk) {
    case "Red":
      return "#EF4444";
    case "Orange":
      return "#F97316";
    case "Amber":
      return "#F59E0B";
    default:
      return "#858C94";
  }
}
