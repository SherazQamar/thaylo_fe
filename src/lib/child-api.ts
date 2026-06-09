import { api } from "@/lib/api";
import { useChildAuthStore } from "@/stores/child-auth.store";
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

export interface LoginChildResponseData {
  child: Child;
  accessToken: string;
}

export async function loginChild(userName: string, pin: string) {
  const { data } = await api.post<ApiResponse<LoginChildResponseData>>(
    "/child/login",
    { userName, pin },
    { authMode: "none" },
  );
  return {
    ...data.data,
    child: sanitizeChildProfile(data.data.child),
  };
}

function sanitizeChildProfile(raw: Child & { pin?: string }): Child {
  const { pin: _, ...child } = raw;
  return child;
}

export async function fetchChildProfile() {
  const { data } = await api.get<ApiResponse<Child & { pin?: string }>>(
    "/child/profile",
    { authMode: "child" },
  );
  return sanitizeChildProfile(data.data);
}

export async function refreshChildSession() {
  const profile = await fetchChildProfile();
  useChildAuthStore.getState().setChild(profile);
  return profile;
}
