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
