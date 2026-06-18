import { api } from "@/lib/api";
import type { PaginatedApiResponse, PaginatedMeta } from "@/types/api";

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

function withDefaultPagination(params: WayfinderStudentsParams = {}) {
  return {
    page: params.page ?? 1,
    limit: WAYFINDER_PAGE_SIZE,
    ...(params.search ? { search: params.search } : {}),
  };
}

function unwrapPaginated(body: PaginatedApiResponse<WayfinderStudent>): WayfinderStudentsResult {
  return { items: body.data ?? [], meta: body.meta ?? null };
}

export async function fetchWayfinderStudents(
  params: WayfinderStudentsParams = {},
): Promise<WayfinderStudentsResult> {
  const { data } = await api.get<PaginatedApiResponse<WayfinderStudent>>(
    "/wayfinder/students",
    { params: withDefaultPagination(params) },
  );
  return unwrapPaginated(data);
}

export const wayfinderQueryKeys = {
  students: (params: WayfinderStudentsParams) => ["wayfinder", "students", params] as const,
};
