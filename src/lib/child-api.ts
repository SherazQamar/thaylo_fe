import { api } from "@/lib/api";
import type { ApiResponse, Child } from "@/types/api";

export interface CreateChildPayload {
  userName: string;
  grade?: string;
  pin: string;
  documentUrls?: string[];
  permission?: Record<string, unknown>;
}

export async function createChild(payload: CreateChildPayload) {
  const { data } = await api.post<ApiResponse<Child>>("/child", payload);
  return data.data;
}
