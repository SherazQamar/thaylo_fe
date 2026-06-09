import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export interface ParentDashboardMasteryBar {
  childId: number;
  label: string;
  progressPercent: number;
}

export interface ParentDashboardChildMastery {
  id: number;
  userName: string;
  grade: string | null;
  plantStage: string;
  masteredLabel: string;
  focusArea: string;
  confidence: string;
}

export interface ParentDashboardStats {
  totalChildren: number;
  activeToday: number;
  avgWeeklyTimeMinutes: number;
  masteredSkills: number;
  masteryProgressBars: ParentDashboardMasteryBar[];
  childrenMastery: ParentDashboardChildMastery[];
}

export interface ParentChildListItem {
  id: number;
  userName: string;
  grade: string | null;
  plantStatus: string;
  badgesEarned: number;
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

export interface ParentSubscriptionStatus {
  status: string | null;
  planLabel: string;
  isActive: boolean;
  currentPeriodEnd: string | null;
  childrenCount: number;
  monthlyPlan: SubscriptionPlan | null;
  annualPlan: SubscriptionPlan | null;
}

export async function fetchParentSubscription() {
  const { data } = await api.get<ApiResponse<ParentSubscriptionStatus>>(
    "/parent/subscription",
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
