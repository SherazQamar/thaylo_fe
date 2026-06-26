import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type OnboardingProgressStatus = "pending" | "in_progress" | "completed";

export interface OnboardingWalkthroughProgress {
  id: number;
  title: string;
  slug: string;
  timing: string;
  sortOrder: number;
  progressStatus: OnboardingProgressStatus;
  sessionId?: number;
  totalQuestions: number;
  answeredQuestions: number;
  estimatedMinutes?: number | null;
  deliveryMode?: "standalone" | "combined";
  combinedGroupKey?: string | null;
  studentWalkthroughId?: number;
  parentWalkthroughId?: number;
  combinedPhase?: "student" | "parent" | "completed";
}

export interface OnboardingStatus {
  isComplete: boolean;
  completedAt?: string | null;
  requiredWalkthroughCount: number;
  completedWalkthroughCount: number;
  walkthroughs: OnboardingWalkthroughProgress[];
  currentWalkthroughId?: number;
  currentWalkthroughPortal?: "child" | "parent";
  currentCombinedPhase?: "student" | "parent";
}

export interface OnboardingQuestion {
  key: string;
  order: number;
  prompt: string;
  type: string;
  options?: string[];
  subItems?: string[];
  requiresResponse?: boolean;
}

export interface OnboardingAnswer {
  questionKey: string;
  questionTitle: string;
  questionType: string;
  value: Record<string, unknown>;
  audioUrl?: string | null;
  transcript?: string | null;
}

export interface OnboardingSessionDetail {
  id: number;
  status: string;
  walkthroughId: number;
  walkthroughTitle: string;
  estimatedMinutes?: number | null;
  tone?: string | null;
  questions: OnboardingQuestion[];
  answers: OnboardingAnswer[];
  totalQuestions: number;
  answeredQuestions: number;
}

type Portal = "parent" | "child";

function basePath(portal: Portal) {
  return portal === "parent" ? "/parent/onboarding" : "/child/onboarding";
}

function authMode(portal: Portal): "user" | "child" {
  return portal === "parent" ? "user" : "child";
}

export async function fetchOnboardingStatus(portal: Portal) {
  const { data } = await api.get<ApiResponse<OnboardingStatus>>(
    `${basePath(portal)}/status`,
    { authMode: authMode(portal) },
  );
  return data.data;
}

export async function needsOnboardingBeforeClass() {
  const status = await fetchOnboardingStatus("child");
  return !status.isComplete;
}

export async function startOnboardingSession(
  portal: Portal,
  walkthroughId: number,
) {
  const { data } = await api.post<ApiResponse<OnboardingSessionDetail>>(
    `${basePath(portal)}/sessions`,
    { walkthroughId },
    { authMode: authMode(portal) },
  );
  return data.data;
}

export async function fetchOnboardingSession(
  portal: Portal,
  sessionId: number,
) {
  const { data } = await api.get<ApiResponse<OnboardingSessionDetail>>(
    `${basePath(portal)}/sessions/${sessionId}`,
    { authMode: authMode(portal) },
  );
  return data.data;
}

export async function submitOnboardingAnswer(
  portal: Portal,
  sessionId: number,
  payload: {
    questionKey: string;
    questionTitle: string;
    questionType: string;
    value: Record<string, unknown>;
  },
) {
  const { data } = await api.post<ApiResponse<OnboardingAnswer>>(
    `${basePath(portal)}/sessions/${sessionId}/answers`,
    payload,
    { authMode: authMode(portal) },
  );
  return data.data;
}

export async function completeOnboardingSession(
  portal: Portal,
  sessionId: number,
) {
  const { data } = await api.post<ApiResponse<OnboardingStatus>>(
    `${basePath(portal)}/sessions/${sessionId}/complete`,
    {},
    { authMode: authMode(portal) },
  );
  return data.data;
}

export interface OnboardingResultItem {
  sessionId: number;
  walkthroughId: number;
  walkthroughTitle: string;
  audience: string;
  respondentLabel: string;
  completedAt?: string | null;
  answers: OnboardingAnswer[];
}

export interface OnboardingResults {
  results: OnboardingResultItem[];
}

export async function fetchOnboardingResults(portal: Portal) {
  const { data } = await api.get<ApiResponse<OnboardingResults>>(
    `${basePath(portal)}/results`,
    { authMode: authMode(portal) },
  );
  return data.data;
}

export async function fetchChildOnboardingResultsForParent(childId: number) {
  const { data } = await api.get<ApiResponse<OnboardingResults>>(
    `/parent/children/${childId}/onboarding/results`,
  );
  return data.data;
}
