import { api } from "@/lib/api";
import type {
  WayfinderLessonAlert,
  WayfinderParentAlert,
  WayfinderSelAlert,
} from "@/lib/wayfinder-alerts";
import type { PaginatedMeta, ApiResponse } from "@/types/api";
import type { WeeklyGuidance } from "@/lib/weekly-guidance";

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
  /** Blueprint W3 presence triad. */
  presenceStatus?: "IN_LESSON" | "ONLINE" | "IDLE";
  presenceLabel?: string;
  liveSessionId?: number | null;
  badgesEarned: number;
  /** Distinct earned badge kinds for card preview strip (original artwork). */
  badgePreviews?: WayfinderBadgePreview[];
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
  risk?: "Clear" | "Amber" | "Orange" | "Red";
  riskSeverity?: "NONE" | "YELLOW" | "ORANGE" | "RED";
  riskReason?: string | null;
  wellnessFlag?: "GREEN" | "AMBER" | "RED";
  wellnessReason?: string | null;
  confidence?: string;
  curricularProgress?: Array<{
    label: string;
    value: number;
    mastered: number;
    total: number;
  }>;
  learningSummary?: {
    currentFocus: string;
    confidence: string;
    engagement: "High" | "Medium" | "Low" | "Building";
  };
  wellbeing?: {
    positive: number;
    neutral: number;
    lowMood: number;
  };
}

export async function fetchWayfinderStudentSnapshot(
  childId: number,
): Promise<WayfinderStudentSnapshot> {
  const { data } = await api.get<ApiResponse<WayfinderStudentSnapshot>>(
    `/wayfinder/students/${childId}/snapshot`,
  );
  return data.data;
}

export interface WayfinderChildNote {
  id: number;
  childId: number;
  wayfinderId: number;
  body: string;
  sentToParentAt: string | null;
  createdAt: string;
  updatedAt: string;
  wayfinderName: string | null;
}

export async function fetchWayfinderChildNotes(
  childId: number,
): Promise<WayfinderChildNote[]> {
  const { data } = await api.get<ApiResponse<{ items: WayfinderChildNote[] }>>(
    `/wayfinder/students/${childId}/notes`,
  );
  return data.data.items ?? [];
}

export async function createWayfinderChildNote(childId: number, body: string) {
  const { data } = await api.post<ApiResponse<WayfinderChildNote>>(
    `/wayfinder/students/${childId}/notes`,
    { body },
  );
  return data.data;
}

export async function updateWayfinderChildNote(
  childId: number,
  noteId: number,
  body: string,
) {
  const { data } = await api.patch<ApiResponse<WayfinderChildNote>>(
    `/wayfinder/students/${childId}/notes/${noteId}`,
    { body },
  );
  return data.data;
}

export async function deleteWayfinderChildNote(childId: number, noteId: number) {
  const { data } = await api.delete<ApiResponse<{ id: number }>>(
    `/wayfinder/students/${childId}/notes/${noteId}`,
  );
  return data.data;
}

export async function sendWayfinderChildNoteToParent(
  childId: number,
  noteId: number,
) {
  const { data } = await api.post<ApiResponse<WayfinderChildNote>>(
    `/wayfinder/students/${childId}/notes/${noteId}/send-to-parent`,
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
  avatarUrl?: string | null
  assignedAt: string | null
  plantStage: string
  masteredLabel: string
  masteredCount: number
  totalLessons: number
  contentArea: string
  focusArea: string
  confidence: string
  masteryTrend?: "Improving" | "Steady" | "Declining" | "—"
  /** Daily distinct lesson passes (last 7 days) for sparkline. */
  masteryTrendSeries?: number[]
  wellnessFlag?: "GREEN" | "AMBER" | "RED"
  wellnessReason?: string | null
  /** Blueprint W3 presence triad. */
  presenceStatus?: "IN_LESSON" | "ONLINE" | "IDLE"
  presenceLabel?: string
  liveSessionId?: number | null
  parent: WayfinderStudentParent
}

export interface WayfinderPriorityStudent {
  childId: number
  name: string
  grade: string | null
  reason: string
  source: "LESSON_RED" | "SEL_RED" | "SEL_AMBER"
  severity: "RED" | "AMBER"
}

export interface WayfinderDashboard {
  stats: WayfinderDashboardStat[]
  students: WayfinderDashboardStudent[]
  priorities: WayfinderPriorityStudent[]
  totalStudents: number
  masteryTrendSeries?: number[]
  presenceSummary?: {
    inLesson: number
    online: number
    idle: number
  }
}

export async function fetchWayfinderDashboard(): Promise<WayfinderDashboard> {
  const { data } = await api.get<ApiResponse<WayfinderDashboard>>("/wayfinder/dashboard")
  return data.data
}

export interface WayfinderLiveSession {
  sessionId: number | null
  childId: number
  firstName: string | null
  secondName: string | null
  userName: string
  grade: string | null
  avatarUrl?: string | null
  plantStage: string
  masteredLabel: string
  masteredCount: number
  totalLessons: number
  contentArea: string
  /** Lesson the student is currently in (or last known). */
  currentLessonTitle: string
  lessonKey: string | null
  lessonOrder: number | null
  subject: string | null
  risk: "Clear" | "Amber" | "Orange" | "Red"
  riskSeverity: "NONE" | "YELLOW" | "ORANGE" | "RED"
  startedAt: string | null
  lastActiveAt: string | null
  elapsedSeconds: number
  durationMinutes: number
  isLive: boolean
  presenceStatus?: "IN_LESSON" | "ONLINE" | "IDLE"
  presenceLabel?: string
}

export interface WayfinderLiveSessionsResult {
  items: WayfinderLiveSession[]
  total: number
  liveCount: number
}

export async function fetchWayfinderLiveSessions(params: {
  search?: string
  grade?: string
  risk?: string
} = {}): Promise<WayfinderLiveSessionsResult> {
  const { data } = await api.get<ApiResponse<WayfinderLiveSessionsResult>>(
    "/wayfinder/live-sessions",
    {
      params: {
        ...(params.search ? { search: params.search } : {}),
        ...(params.grade ? { grade: params.grade } : {}),
        ...(params.risk ? { risk: params.risk } : {}),
      },
    },
  )
  return data.data
}

export interface WayfinderLiveSessionDetail {
  sessionId: number
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED"
  isLive: boolean
  childId: number
  firstName: string | null
  secondName: string | null
  userName: string
  grade: string | null
  avatarUrl: string | null
  subject: string | null
  contentArea: string
  currentLessonTitle: string
  lessonKey: string
  lessonOrder: number
  lessonCount: number
  concept: string | null
  focusArea: string | null
  risk: "Clear" | "Amber" | "Orange" | "Red"
  riskSeverity: "NONE" | "YELLOW" | "ORANGE" | "RED"
  startedAt: string
  lastActiveAt: string
  elapsedSeconds: number
  durationMinutes: number
  teachUntilMinute: number
  progressPercent: number
  elapsedMinutesLabel: string
  phase: "teach" | "quick_check" | "ended"
  phaseLabel: string
  liveStatus: string
  board: {
    aiPrompt: string | null
    studentResponse: string | null
    evaluating: boolean
  }
  quickChecks: {
    correct: number
    incorrect: number
    hintRequested: number
    reteachTriggers: number
    longPauses: number
    engagementLevel: "High" | "Medium" | "Low" | "Building"
  }
  transcript: Array<{
    id: string
    at: string
    speaker: "AI" | "STUDENT"
    text: string
    isCorrect?: boolean
  }>
  answers: Array<{
    stepId: string
    interactionId: string
    optionLabel: string
    isCorrect: boolean
    answeredAt: string
    prompt: string | null
  }>
  reteach: {
    active: boolean
    reason: string | null
    concept: string | null
    incorrectAttempts: number
    status: string | null
    isRetake: boolean
    attemptNumber: number
  }
  selEvents: Array<{
    id: string
    kind: string
    title: string
    detail: string
    at: string
  }>
  summary: {
    conceptsCovered: number
    questionsAttempted: number
    correctAnswers: number
    correctPercent: number | null
    hintsUsed: number
    reteachTriggered: number
    engagementLevel: "High" | "Medium" | "Low" | "Building"
  }
  recentParentNotes: Array<{
    id: number
    body: string
    sentToParentAt: string
    createdAt: string
  }>
  plantStage: string
  masteredLabel: string
  learningRecord: {
    instructionalPathway: string
    instructionalModel: string
    attemptNumber: number
    likelyMisconception: string | null
    prerequisiteWeakness: string | null
    promptingLevel: string
    independentMastery: boolean
    recommendedNextAction: string
    examplesAndAssessmentsUsed: string[]
  } | null
}

export async function fetchWayfinderLiveSessionDetail(
  sessionId: number,
): Promise<WayfinderLiveSessionDetail> {
  const { data } = await api.get<ApiResponse<WayfinderLiveSessionDetail>>(
    `/wayfinder/live-sessions/${sessionId}`,
  )
  return data.data
}

export interface AnalyticsLightPoint {
  date: string
  value: number
}

export interface AnalyticsLightStudentRow {
  childId: number
  name: string
  grade: string | null
  masteryPasses: number
  masteryTrendLabel: "Improving" | "Steady" | "Declining" | "—"
  reteachCount: number
  engagementMinutes: number
  selFlag: "GREEN" | "AMBER" | "RED"
  selAmberSignals: number
  selRedSignals: number
}

export interface WayfinderAnalyticsLight {
  rangeDays: number
  generatedAt: string
  summary: {
    masteryPasses: number
    reteachSessions: number
    engagementMinutes: number
    selGreen: number
    selAmber: number
    selRed: number
  }
  masteryTrend: AnalyticsLightPoint[]
  reteachFrequency: AnalyticsLightPoint[]
  engagementTime: AnalyticsLightPoint[]
  selFlagCounts: { green: number; amber: number; red: number }
  students: AnalyticsLightStudentRow[]
}

export async function fetchWayfinderAnalyticsLight(
  days = 14,
): Promise<WayfinderAnalyticsLight> {
  const { data } = await api.get<ApiResponse<WayfinderAnalyticsLight>>(
    "/wayfinder/analytics-light",
    { params: { days } },
  )
  return data.data
}

async function parseBlobErrorMessage(blob: Blob): Promise<string> {
  try {
    const text = await blob.text()
    const parsed = JSON.parse(text) as { message?: string }
    return parsed.message?.trim() || "Download failed"
  } catch {
    return "Download failed"
  }
}

export async function downloadAnalyticsLightCsv(
  days = 14,
): Promise<{ blob: Blob; filename: string }> {
  const response = await api.get<Blob>("/wayfinder/analytics-light/export.csv", {
    params: { days },
    responseType: "blob",
  })
  if (response.data.type?.includes("application/json")) {
    throw new Error(await parseBlobErrorMessage(response.data))
  }
  const disposition = String(response.headers["content-disposition"] ?? "")
  const match = /filename="?([^"]+)"?/i.exec(disposition)
  return {
    blob: response.data,
    filename: match?.[1] ?? `thaylo-analytics-light.csv`,
  }
}

export async function downloadAnalyticsLightPdf(
  days = 14,
): Promise<{ blob: Blob; filename: string }> {
  const response = await api.get<Blob>("/wayfinder/analytics-light/export.pdf", {
    params: { days },
    responseType: "blob",
  })
  if (response.data.type?.includes("application/json")) {
    throw new Error(await parseBlobErrorMessage(response.data))
  }
  const disposition = String(response.headers["content-disposition"] ?? "")
  const match = /filename="?([^"]+)"?/i.exec(disposition)
  return {
    blob: response.data,
    filename: match?.[1] ?? `thaylo-analytics-light.pdf`,
  }
}

export const wayfinderQueryKeys = {
  dashboard: () => ["wayfinder", "dashboard"] as const,
  students: (params: WayfinderStudentsParams) => ["wayfinder", "students", params] as const,
  studentSnapshot: (childId: number) => ["wayfinder", "students", childId, "snapshot"] as const,
  studentNotes: (childId: number) => ["wayfinder", "students", childId, "notes"] as const,
  studentWeeklyGuidance: (childId: number) =>
    ["wayfinder", "students", childId, "weekly-guidance"] as const,
  liveSessions: (params: { search?: string; grade?: string; risk?: string } = {}) =>
    ["wayfinder", "live-sessions", params] as const,
  liveSessionDetail: (sessionId: number) =>
    ["wayfinder", "live-sessions", "detail", sessionId] as const,
  alerts: (params: WayfinderAlertsParams) => ["wayfinder", "alerts", params] as const,
  alertCount: () => ["wayfinder", "alerts", "count"] as const,
  analyticsLight: (days: number) => ["wayfinder", "analytics-light", days] as const,
  notifications: (params: Record<string, unknown>) =>
    ["wayfinder", "notifications", params] as const,
  notificationCount: () => ["wayfinder", "notifications", "count"] as const,
};

export async function fetchWayfinderWeeklyGuidance(
  childId: number,
): Promise<WeeklyGuidance> {
  const { data } = await api.get<ApiResponse<WeeklyGuidance>>(
    `/wayfinder/students/${childId}/weekly-guidance`,
  );
  return data.data;
}
