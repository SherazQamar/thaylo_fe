export type WayfinderAlertSeverity = "YELLOW" | "ORANGE" | "RED";
export type WayfinderAlertStatus = "ACTIVE" | "RESOLVED" | "DISMISSED";

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
    };

const SEVERITY_ACCENTS: Record<WayfinderAlertSeverity, string> = {
  YELLOW: "#FBBF24",
  ORANGE: "#FB923C",
  RED: "#FF6F6F",
};

const SEVERITY_LABELS: Record<WayfinderAlertSeverity, string> = {
  YELLOW: "Yellow flag",
  ORANGE: "Orange alert",
  RED: "Red alert",
};

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

export function cardTitle(card: WayfinderAlertCard): string {
  if (card.kind === "lesson") return card.alert.title;
  return "SEL Red Flag";
}

export function cardText(card: WayfinderAlertCard): string {
  if (card.kind === "lesson") {
    return `${card.alert.lessonTitle} · ${card.alert.scorePercent}%`;
  }
  return card.alert.message;
}

export function cardDate(card: WayfinderAlertCard): string {
  const raw = card.kind === "lesson" ? card.alert.createdAt : card.alert.createdAt;
  return new Date(raw).toLocaleDateString();
}

export function cardAccent(card: WayfinderAlertCard): string {
  if (card.kind === "lesson") return lessonAlertAccent(card.alert.severity);
  return "#FFC542";
}

export function cardPriority(card: WayfinderAlertCard): string | null {
  if (card.kind === "lesson") return lessonAlertPriority(card.alert.severity);
  return card.alert.consecutiveLowDays >= 3 ? "High" : "Medium";
}

export function cardChildId(card: WayfinderAlertCard): number | undefined {
  return card.kind === "lesson" ? card.alert.childId : card.alert.childId;
}
