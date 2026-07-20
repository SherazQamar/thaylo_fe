import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export interface ParentDashboardMasteryBar {
  childId: number;
  label: string;
  grade: string | null;
  masteredCount: number;
  attemptedCount: number;
  progressPercent: number;
}

export interface ParentDashboardChildSel {
  childId: number;
  userName: string;
  grade: string | null;
  happyCount: number;
  confusedCount: number;
  sadCount: number;
}

export interface ParentDashboardWeeklyTime {
  childId: number;
  userName: string;
  minutes: number;
  label: string;
}

export interface ParentDashboardChildMastery {
  id: number;
  userName: string;
  grade: string | null;
  contentArea: string;
  masteredCount: number;
  attemptedCount: number;
  remainingCount: number;
  masteredLabel: string;
  attemptedLabel: string;
  remainingLabel: string;
  focusArea: string;
  confidence: string;
}

export interface ParentDashboardStats {
  activeTodayNames: string[];
  weeklyTimeByChild: ParentDashboardWeeklyTime[];
  masteredSkills: number;
  masteryProgressBars: ParentDashboardMasteryBar[];
  childrenSel: ParentDashboardChildSel[];
  childrenMastery: ParentDashboardChildMastery[];
}

export interface ParentChildBadgePreview {
  kind: string;
  name: string;
  imageUrl: string;
  count: number;
}

export interface ParentChildListItem {
  id: number;
  userName: string;
  grade: string | null;
  plantStatus: string;
  badgesEarned: number;
  badgePreviews?: ParentChildBadgePreview[];
  interestAreas?: string[];
}

export async function fetchParentChildren() {
  const { data } = await api.get<ApiResponse<ParentChildListItem[]>>(
    "/parent/children",
  );
  return data.data;
}

export async function fetchParentDashboardStats() {
  const { data } = await api.get<ApiResponse<ParentDashboardStats>>(
    "/parent/dashboard/stats",
  );
  return data.data;
}

export interface SubscriptionPlan {
  priceId: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  productName: string;
  productDescription: string | null;
}

export interface ParentPaymentMethodPreview {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface ParentSubscriptionStatus {
  billingMode?: "beta" | "stripe";
  status: string | null;
  planLabel: string;
  isActive: boolean;
  currentPeriodEnd: string | null;
  childrenCount: number;
  monthlyPlan: SubscriptionPlan | null;
  annualPlan: SubscriptionPlan | null;
  betaMessage?: string;
  currentInterval?: "month" | "year" | null;
  canSwitchToMonthly?: boolean;
  canSwitchToAnnual?: boolean;
  paymentMethod?: ParentPaymentMethodPreview | null;
  canCollectCard?: boolean;
}

export async function fetchParentSubscription() {
  const { data } = await api.get<ApiResponse<ParentSubscriptionStatus>>(
    "/parent/subscription",
  );
  return data.data;
}

export async function createParentPaymentMethodSetup() {
  const { data } = await api.post<
    ApiResponse<{ clientSecret: string; publishableKey: string | null }>
  >("/parent/subscription/payment-method/setup");
  return data.data;
}

export async function confirmParentPaymentMethod(paymentMethodId: string) {
  const { data } = await api.post<ApiResponse<ParentPaymentMethodPreview>>(
    "/parent/subscription/payment-method/confirm",
    { paymentMethodId },
  );
  return data.data;
}

export async function changeParentSubscriptionPlan(
  planType: "monthly" | "annual",
) {
  const { data } = await api.post<ApiResponse<ParentSubscriptionStatus>>(
    "/parent/subscription/change-plan",
    { planType },
  );
  return data.data;
}

export async function createParentSubscriptionCheckout(options?: {
  priceId?: string;
  planType?: "monthly" | "annual";
}) {
  const { data } = await api.post<ApiResponse<{ url: string }>>(
    "/parent/subscription/checkout",
    options ?? {},
  );
  return data.data;
}

export async function confirmParentSubscriptionCheckout(sessionId: string) {
  const { data } = await api.post<ApiResponse<ParentSubscriptionStatus>>(
    "/parent/subscription/confirm",
    { sessionId },
  );
  return data.data;
}

export interface ParentChildDetail {
  id: number;
  firstName?: string | null;
  secondName?: string | null;
  userName: string;
  grade?: string | null;
  interestAreas: string[];
  /** Note written by the child for the parent (read-only on parent side). */
  notesForParent: string | null;
  createdAt: string;
}

export interface UpdateParentChildPayload {
  firstName?: string;
  secondName?: string;
  grade?: string;
  interestAreas?: string[];
}

export async function fetchParentChild(childId: number) {
  const { data } = await api.get<ApiResponse<ParentChildDetail>>(
    `/parent/children/${childId}`,
  );
  return data.data;
}

export async function updateParentChild(
  childId: number,
  payload: UpdateParentChildPayload,
) {
  const { data } = await api.patch<ApiResponse<ParentChildDetail>>(
    `/parent/children/${childId}`,
    payload,
  );
  return data.data;
}

export async function archiveParentChild(childId: number) {
  const { data } = await api.delete<ApiResponse<{ id: number }>>(
    `/parent/children/${childId}`,
  );
  return data.data;
}

export async function resetParentChildPin(childId: number, pin: string) {
  const { data } = await api.post<ApiResponse<{ id: number }>>(
    `/parent/children/${childId}/reset-pin`,
    { pin },
  );
  return data.data;
}

export interface ParentProgressReportLesson {
  lessonTitle: string;
  lessonKey: string;
  status: string;
  passed: boolean | null;
  scoreCorrect: number | null;
  scoreTotal: number | null;
  durationMinutes: number;
  startedAt: string;
  completedAt: string | null;
}

export interface ParentProgressReport {
  childId: number;
  childName: string;
  grade: string | null;
  from: string;
  until: string;
  generatedAt: string;
  lessonsAttempted: number;
  lessonsPassed: number;
  masteryPercent: number;
  totalMinutes: number;
  averageScorePercent: number | null;
  selHappy: number;
  selConfused: number;
  selSad: number;
  lessons: ParentProgressReportLesson[];
  pdfConsentGranted: boolean;
}

export async function fetchParentProgressReport(params: {
  childId: number;
  from: string;
  until: string;
}) {
  const { data } = await api.get<ApiResponse<ParentProgressReport>>(
    "/parent/reports/progress",
    { params },
  );
  return data.data;
}

async function parseBlobErrorMessage(blob: Blob): Promise<string> {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text) as {
      message?: string | string[];
    };
    if (typeof parsed.message === "string") return parsed.message;
    if (Array.isArray(parsed.message)) return parsed.message.join(", ");
  } catch {
    // Not JSON — fall through.
  }
  return "Could not download PDF";
}

export async function downloadParentProgressReportPdf(
  params: {
    childId: number;
    from: string;
    until: string;
  },
  options?: { signal?: AbortSignal },
): Promise<Blob> {
  try {
    const response = await api.get<Blob>("/parent/reports/progress/pdf", {
      params,
      responseType: "blob",
      signal: options?.signal,
    });

    const data = response.data;
    if (!(data instanceof Blob) || data.size === 0) {
      throw new Error("Could not download PDF");
    }

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data instanceof Blob) {
      throw new Error(await parseBlobErrorMessage(error.response.data));
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not download PDF");
  }
}
