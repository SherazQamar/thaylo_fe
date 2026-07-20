import { api } from "@/lib/api";
import type {
  WayfinderLessonAlert,
  WayfinderParentAlert,
  WayfinderSelAlert,
} from "@/lib/wayfinder-alerts";
import type { PaginatedMeta, ApiResponse } from "@/types/api";

export const WAYFINDER_PAGE_SIZE = 10;

export interface WayfinderStudentParent {
  id: number;
  name: string | null;
  email: string;
}

export interface WayfinderStudent {
  id: number;
  firstName: string | null;
  secondName: string | null;
  userName: string;
  grade: string | null;
  assignedAt: string | null;
  createdAt: string;
  /** Most recent lesson activity ISO timestamp; null if never active in a lesson. */
  lastActiveAt: string | null;
  badgesEarned: number;
  plantStatus: string;
  avatarUrl?: string | null;
  parent: WayfinderStudentParent;
}

export interface WayfinderStudentsParams {
  page?: number;
  search?: string;
}

export interface WayfinderStudentsResult {
  items: WayfinderStudent[];
  meta: PaginatedMeta | null;
}

export interface WayfinderAlertsParams {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "RESOLVED" | "DISMISSED";
  severity?: "YELLOW" | "ORANGE" | "RED";
  search?: string;
  childId?: number;
}

export interface WayfinderAlertsResult {
  items: WayfinderLessonAlert[];
  meta: PaginatedMeta & { activeCount?: number };
  selAlerts: WayfinderSelAlert[];
  parentAlerts: WayfinderParentAlert[];
}

function withDefaultPagination(params: WayfinderStudentsParams = {}) {
  return {
    page: params.page ?? 1,
    limit: WAYFINDER_PAGE_SIZE,
    ...(params.search ? { search: params.search } : {}),
  };
}

function unwrapPaginated(body: ApiResponse<WayfinderStudent[]> & { meta?: PaginatedMeta }): WayfinderStudentsResult {
  return { items: body.data ?? [], meta: body.meta ?? null };
}

export async function fetchWayfinderStudents(
  params: WayfinderStudentsParams = {},
): Promise<WayfinderStudentsResult> {
  const { data } = await api.get<ApiResponse<WayfinderStudent[]> & { meta?: PaginatedMeta }>(
    "/wayfinder/students",
    { params: withDefaultPagination(params) },
  );
  return unwrapPaginated(data);
}

export interface WayfinderBadgePreview {
  kind: string;
  name: string;
  imageUrl: string;
  count: number;
}

export interface WayfinderStudentSnapshot {
  childId: number;
  firstName: string | null;
  secondName: string | null;
  userName: string;
  grade: string | null;
  parentName: string | null;
  avatarUrl?: string | null;
  contentArea: string;
  currentLessonTitle: string | null;
  currentLessonKey: string | null;
  currentLessonOrder: number | null;
  lastActiveAt: string | null;
  masteryPassed: number;
  masteryAttempted: number;
  masteryPercent: number | null;
  masteryLabel: string;
  progressCompleted: number;
  progressTotal: number;
  progressLabel: string;
  badgesEarned: number;
  /** @deprecated Prefer badgePreviews */
  badgeIcons: string[];
  badgePreviews?: WayfinderBadgePreview[];
}

export async function fetchWayfinderStudentSnapshot(
  childId: number,
): Promise<WayfinderStudentSnapshot> {
  const { data } = await api.get<ApiResponse<WayfinderStudentSnapshot>>(
    `/wayfinder/students/${childId}/snapshot`,
  );
  return data.data;
}

export async function fetchWayfinderAlerts(
  params: WayfinderAlertsParams = {},
): Promise<WayfinderAlertsResult> {
  const { data } = await api.get<
    ApiResponse<{
      items: WayfinderLessonAlert[];
      meta: PaginatedMeta & { activeCount?: number };
      selAlerts: WayfinderSelAlert[];
      parentAlerts?: WayfinderParentAlert[];
    }>
  >("/wayfinder/alerts", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? WAYFINDER_PAGE_SIZE,
      ...(params.status ? { status: params.status } : {}),
      ...(params.severity ? { severity: params.severity } : {}),
      ...(params.search ? { search: params.search } : {}),
      ...(params.childId ? { childId: params.childId } : {}),
    },
  });

  return {
    items: data.data.items ?? [],
    meta: data.data.meta ?? { total: 0, lastPage: 1, currentPage: 1, perPage: 10, prev: null, next: null },
    selAlerts: data.data.selAlerts ?? [],
    parentAlerts: data.data.parentAlerts ?? [],
  };
}

export async function fetchWayfinderAlertCount(): Promise<number> {
  const { data } = await api.get<ApiResponse<{ count: number }>>("/wayfinder/alerts/count");
  return data.data.count ?? 0;
}

export async function resolveWayfinderAlert(alertId: number) {
  const { data } = await api.patch<ApiResponse<{ id: number; status: string }>>(
    `/wayfinder/alerts/${alertId}/resolve`,
  );
  return data.data;
}

export async function dismissWayfinderAlert(alertId: number) {
  const { data } = await api.patch<ApiResponse<{ id: number; status: string }>>(
    `/wayfinder/alerts/${alertId}/dismiss`,
  );
  return data.data;
}

export async function sendWayfinderHeartbeat(): Promise<{
  id: number;
  lastSeenAt: string;
  onlineWindowMs: number;
  isOnline: boolean;
}> {
  const { data } = await api.post<
    ApiResponse<{
      id: number;
      lastSeenAt: string;
      onlineWindowMs: number;
      isOnline: boolean;
    }>
  >("/wayfinder/presence/heartbeat");
  return data.data;
}

export interface WayfinderDashboardStat {
  key: string
  label: string
  value: string
  changePercent: number | null
  hint?: string
}

export interface WayfinderDashboardStudent {
  id: number
  firstName: string | null
  secondName: string | null
  userName: string
  grade: string | null
  assignedAt: string | null
  plantStage: string
  masteredLabel: string
  masteredCount: number
  totalLessons: number
  contentArea: string
  focusArea: string
  confidence: string
  parent: WayfinderStudentParent
}

export interface WayfinderPriorityStudent {
  childId: number
  name: string
  grade: string | null
  reason: string
  source: "LESSON_RED" | "SEL_RED"
  severity: "RED"
}

export interface WayfinderDashboard {
  stats: WayfinderDashboardStat[]
  students: WayfinderDashboardStudent[]
  priorities: WayfinderPriorityStudent[]
  totalStudents: number
}

export async function fetchWayfinderDashboard(): Promise<WayfinderDashboard> {
  const { data } = await api.get<ApiResponse<WayfinderDashboard>>("/wayfinder/dashboard")
  return data.data
}

export interface WayfinderLiveSession {
  sessionId: number
  childId: number
  firstName: string | null
  secondName: string | null
  userName: string
  grade: string | null
  plantStage: string
  masteredLabel: string
  masteredCount: number
  totalLessons: number
  contentArea: string
  /** Lesson the student is currently in (replaces generic "In Lesson"). */
  currentLessonTitle: string
  lessonKey: string
  lessonOrder: number
  subject: string | null
  risk: "Clear" | "Amber" | "Orange" | "Red"
  riskSeverity: "NONE" | "YELLOW" | "ORANGE" | "RED"
  startedAt: string
  lastActiveAt: string
  elapsedSeconds: number
}

export interface WayfinderLiveSessionsResult {
  items: WayfinderLiveSession[]
  total: number
}

export async function fetchWayfinderLiveSessions(params: {
  search?: string
} = {}): Promise<WayfinderLiveSessionsResult> {
  const { data } = await api.get<ApiResponse<WayfinderLiveSessionsResult>>(
    "/wayfinder/live-sessions",
    { params: params.search ? { search: params.search } : {} },
  )
  return data.data
}

export const wayfinderQueryKeys = {
  dashboard: () => ["wayfinder", "dashboard"] as const,
  students: (params: WayfinderStudentsParams) => ["wayfinder", "students", params] as const,
  studentSnapshot: (childId: number) => ["wayfinder", "students", childId, "snapshot"] as const,
  liveSessions: (params: { search?: string } = {}) =>
    ["wayfinder", "live-sessions", params] as const,
  alerts: (params: WayfinderAlertsParams) => ["wayfinder", "alerts", params] as const,
  alertCount: () => ["wayfinder", "alerts", "count"] as const,
};
