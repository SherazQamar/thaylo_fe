import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type BadgeIconStyle =
  | "open_book"
  | "plant"
  | "branch"
  | "flower"
  | "oak";

export type BadgeKind =
  | "SPROUT_STREAK"
  | "THRIVING_SEEDLING"
  | "BLOSSOMING_KNOWLEDGE"
  | "BRANCH_BUILDER"
  | "BLOOM_AHEAD"
  | "FULL_BLOOM"
  | "DEEP_ROOTS"
  | "MIGHTY_OAK";

export interface BadgeItem {
  kind: BadgeKind;
  name: string;
  description: string;
  category: "login" | "lesson" | "pretest" | "persistence" | string;
  isMilestone: boolean;
  count: number;
  maxCount: number | null;
  iconStyle: BadgeIconStyle;
  /** Full badge artwork (Badges/*.png). */
  imageUrl?: string;
  /** Compact badge artwork (badge-small/*-small.png). */
  imageUrlSmall?: string;
}

export interface NextBadgeUnlock {
  kind: BadgeKind;
  name: string;
  description: string;
  progressCurrent: number;
  progressTarget: number;
  progressLabel: string;
  iconStyle: BadgeIconStyle;
}

export interface ChildBadgesSummary {
  childId: number;
  badgesEarned: number;
  plantStage: number;
  plantStatus: string;
  masteredCount: number;
  totalLessons: number;
  loginStreakDays: number;
  badges: BadgeItem[];
  nextUnlock: NextBadgeUnlock | null;
}

export async function fetchChildBadges() {
  const { data } = await api.get<ApiResponse<ChildBadgesSummary>>(
    "/child/badges",
    { authMode: "child" },
  );
  return data.data;
}

export async function syncChildBadgeActivity() {
  const { data } = await api.post<
    ApiResponse<{
      awarded: { kind: string; name: string }[];
      summary: ChildBadgesSummary;
    }>
  >("/child/badges/activity", {}, { authMode: "child" });
  return data.data;
}

export async function fetchParentChildBadges(childId: number) {
  const { data } = await api.get<ApiResponse<ChildBadgesSummary>>(
    `/parent/children/${childId}/badges`,
  );
  return data.data;
}

export async function skipLessonViaPretest(curriculumId?: number) {
  const { data } = await api.post<
    ApiResponse<{
      sessionId: number;
      lessonKey: string;
      lessonTitle: string;
      passed: boolean;
      masteredViaPretest: boolean;
      badgesAwarded: { kind: string; name: string }[];
    }>
  >(
    "/child/classes/pretest-skip",
    curriculumId != null ? { curriculumId } : {},
    { authMode: "child" },
  );
  return data.data;
}

export type PretestQuestion = {
  id: string;
  prompt: string;
  type: "single_choice" | "word_pick" | "word_ladder";
  options: Array<{ id: string; label: string; hint?: string }>;
};

export type ChildPretest = {
  available: boolean;
  reason: string | null;
  curriculumId: number | null;
  lessonKey: string | null;
  lessonTitle: string | null;
  passThreshold: number;
  questions: PretestQuestion[];
};

export type PretestSubmitResult = {
  passed: boolean;
  scoreCorrect: number;
  scoreTotal: number;
  scorePercent: number;
  passThreshold: number;
  graded: Array<{ questionId: string; isCorrect: boolean }>;
  skip: {
    sessionId: number;
    lessonKey: string;
    lessonTitle: string;
    badgesAwarded: { kind: string; name: string }[];
  } | null;
};

export async function fetchChildPretest(curriculumId?: number) {
  const { data } = await api.get<ApiResponse<ChildPretest>>(
    "/child/classes/pretest",
    {
      authMode: "child",
      params: curriculumId != null ? { curriculumId } : undefined,
    },
  );
  return data.data;
}

export async function submitChildPretest(payload: {
  curriculumId?: number;
  answers: Array<{
    questionId: string;
    optionId?: string;
    orderedIds?: string[];
  }>;
}) {
  const { data } = await api.post<ApiResponse<PretestSubmitResult>>(
    "/child/classes/pretest/submit",
    payload,
    { authMode: "child" },
  );
  return data.data;
}
