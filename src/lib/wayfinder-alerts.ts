export type WayfinderAlertSeverity = "YELLOW" | "ORANGE" | "RED";
export type WayfinderAlertStatus = "ACTIVE" | "RESOLVED" | "DISMISSED";

export type WayfinderFlagKind = "RED" | "ORANGE" | "YELLOW" | "BLUE";

export interface WayfinderLessonAlert {
  id: number;
  type: "LESSON_FAILURE";
  severity: WayfinderAlertSeverity;
  status: WayfinderAlertStatus;
  attemptNumber: number;
  lessonKey: string;
  lessonTitle: string;
  scorePercent: number;
  title: string;
  message: string;
  requiresInvolvement: boolean;
  childId: number;
  childName: string;
  childUserName: string;
  grade: string | null;
  parentName: string | null;
  classSessionId: number | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface WayfinderSelAlert {
  type: "SEL_RED_FLAG";
  childId: number;
  childName: string;
  grade: string | null;
  consecutiveLowDays: number;
  message: string;
  createdAt: string;
}

export interface WayfinderParentAlert {
  type: "PARENT_COMMUNICATION";
  roomId: number;
  childId: number;
  childName: string;
  grade: string | null;
  parentName: string | null;
  message: string;
  hoursWaiting: number;
  createdAt: string;
}

export type WayfinderAlertCard =
  | {
      kind: "lesson";
      id: string;
      alert: WayfinderLessonAlert;
    }
  | {
      kind: "sel";
      id: string;
      alert: WayfinderSelAlert;
    }
  | {
      kind: "parent";
      id: string;
      alert: WayfinderParentAlert;
    };

/** One student row in Alerts Center — name first, flags second. */
export interface WayfinderStudentAlertGroup {
  childId: number;
  childName: string;
  grade: string | null;
  parentName: string | null;
  flags: WayfinderFlagKind[];
  summaryLines: string[];
  latestAt: string;
  cards: WayfinderAlertCard[];
  /** Highest-priority lesson card (for resolve/dismiss actions). */
  primaryLesson: WayfinderLessonAlert | null;
}

const SEVERITY_ACCENTS: Record<WayfinderAlertSeverity, string> = {
  YELLOW: "#FBBF24",
  ORANGE: "#FB923C",
  RED: "#FF6F6F",
};

const FLAG_META: Record<
  WayfinderFlagKind,
  { label: string; accent: string }
> = {
  RED: { label: "Red flag", accent: "#FF6F6F" },
  ORANGE: { label: "Orange flag", accent: "#FB923C" },
  YELLOW: { label: "Yellow flag", accent: "#FBBF24" },
  BLUE: { label: "Blue flag", accent: "#3B82F6" },
};

const FLAG_SORT_RANK: Record<WayfinderFlagKind, number> = {
  RED: 0,
  ORANGE: 1,
  YELLOW: 2,
  BLUE: 3,
};

const SEVERITY_LABELS: Record<WayfinderAlertSeverity, string> = {
  YELLOW: "Yellow flag",
  ORANGE: "Orange flag",
  RED: "Red flag",
};

export function flagMeta(flag: WayfinderFlagKind) {
  return FLAG_META[flag];
}

export function lessonAlertAccent(severity: WayfinderAlertSeverity): string {
  return SEVERITY_ACCENTS[severity];
}

export function lessonAlertPriority(severity: WayfinderAlertSeverity): string {
  return SEVERITY_LABELS[severity];
}

export function mapLessonAlertToCard(alert: WayfinderLessonAlert): WayfinderAlertCard {
  return { kind: "lesson", id: `lesson-${alert.id}`, alert };
}

export function mapSelAlertToCard(alert: WayfinderSelAlert): WayfinderAlertCard {
  return { kind: "sel", id: `sel-${alert.childId}`, alert };
}

export function mapParentAlertToCard(alert: WayfinderParentAlert): WayfinderAlertCard {
  return { kind: "parent", id: `parent-${alert.roomId}`, alert };
}

/** Primary heading is always the student name. */
export function cardTitle(card: WayfinderAlertCard): string {
  return card.alert.childName;
}

export function cardText(card: WayfinderAlertCard): string {
  if (card.kind === "lesson") {
    const attempt =
      card.alert.attemptNumber === 1
        ? "first"
        : card.alert.attemptNumber === 2
          ? "second"
          : card.alert.attemptNumber === 3
            ? "third"
            : `${card.alert.attemptNumber}th`;
    return `Failed ${attempt} attempt · ${card.alert.lessonTitle} · ${card.alert.scorePercent}%`;
  }
  if (card.kind === "sel") return card.alert.message;
  return card.alert.message;
}

export function cardDate(card: WayfinderAlertCard): string {
  return new Date(card.alert.createdAt).toLocaleDateString();
}

export function cardAccent(card: WayfinderAlertCard): string {
  if (card.kind === "lesson") return lessonAlertAccent(card.alert.severity);
  if (card.kind === "sel") return FLAG_META.RED.accent;
  return FLAG_META.BLUE.accent;
}

export function cardPriority(card: WayfinderAlertCard): string | null {
  if (card.kind === "lesson") return lessonAlertPriority(card.alert.severity);
  if (card.kind === "sel") return "Red flag";
  return "Blue flag";
}

export function cardChildId(card: WayfinderAlertCard): number | undefined {
  return card.alert.childId;
}

function flagsFromCard(card: WayfinderAlertCard): WayfinderFlagKind[] {
  if (card.kind === "lesson") return [card.alert.severity];
  if (card.kind === "sel") return ["RED"];
  return ["BLUE"];
}

function groupSortRank(group: WayfinderStudentAlertGroup): number {
  if (group.flags.length === 0) return 99;
  return Math.min(...group.flags.map((f) => FLAG_SORT_RANK[f]));
}

/**
 * Group flat alert cards by student. Red-flag students first, then by name.
 */
export function groupAlertsByStudent(
  cards: WayfinderAlertCard[],
): WayfinderStudentAlertGroup[] {
  const byChild = new Map<number, WayfinderStudentAlertGroup>();

  for (const card of cards) {
    const childId = card.alert.childId;
    const existing = byChild.get(childId);
    const flagSet = new Set<WayfinderFlagKind>(existing?.flags ?? []);
    for (const f of flagsFromCard(card)) flagSet.add(f);

    const summary = cardText(card);
    const summaries = existing?.summaryLines ?? [];
    if (!summaries.includes(summary)) summaries.push(summary);

    const parentName =
      card.kind === "lesson"
        ? card.alert.parentName
        : card.kind === "parent"
          ? card.alert.parentName
          : existing?.parentName ?? null;

    const primaryLesson =
      card.kind === "lesson"
        ? !existing?.primaryLesson ||
          FLAG_SORT_RANK[card.alert.severity] <
            FLAG_SORT_RANK[existing.primaryLesson.severity]
          ? card.alert
          : existing.primaryLesson
        : existing?.primaryLesson ?? null;

    const latestAt =
      !existing ||
      new Date(card.alert.createdAt).getTime() >
        new Date(existing.latestAt).getTime()
        ? card.alert.createdAt
        : existing.latestAt;

    byChild.set(childId, {
      childId,
      childName: card.alert.childName,
      grade: card.alert.grade,
      parentName,
      flags: [...flagSet].sort(
        (a, b) => FLAG_SORT_RANK[a] - FLAG_SORT_RANK[b],
      ),
      summaryLines: summaries.slice(0, 4),
      latestAt,
      cards: [...(existing?.cards ?? []), card],
      primaryLesson,
    });
  }

  return [...byChild.values()].sort((a, b) => {
    const rankDiff = groupSortRank(a) - groupSortRank(b);
    if (rankDiff !== 0) return rankDiff;
    return a.childName.localeCompare(b.childName);
  });
}
