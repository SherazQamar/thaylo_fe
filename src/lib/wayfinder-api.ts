import { api } from "@/lib/api";
import type {
  WayfinderLessonAlert,
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

export async function fetchWayfinderAlerts(
  params: WayfinderAlertsParams = {},
): Promise<WayfinderAlertsResult> {
  const { data } = await api.get<
    ApiResponse<{
      items: WayfinderLessonAlert[];
      meta: PaginatedMeta & { activeCount?: number };
      selAlerts: WayfinderSelAlert[];
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

export const wayfinderQueryKeys = {
  students: (params: WayfinderStudentsParams) => ["wayfinder", "students", params] as const,
  alerts: (params: WayfinderAlertsParams) => ["wayfinder", "alerts", params] as const,
  alertCount: () => ["wayfinder", "alerts", "count"] as const,
};
