import { api } from "@/lib/api";
import { useChildAuthStore } from "@/stores/child-auth.store";
import type { ApiResponse, Child } from "@/types/api";

export interface CreateChildPayload {
  firstName: string;
  secondName: string;
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
  rememberDevice?: boolean;
  expiresInDays?: number;
}

export async function loginChild(
  userName: string,
  pin: string,
  rememberDevice = false,
) {
  const { data } = await api.post<ApiResponse<LoginChildResponseData>>(
    "/child/login",
    { userName, pin, rememberDevice },
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

export async function updateChildInterestAreas(interestAreas: string[]) {
  const { data } = await api.patch<
    ApiResponse<Child & { rejectedInterests?: string[] }>
  >(
    "/child/profile/interest-areas",
    { interestAreas },
    { authMode: "child" },
  );
  const { rejectedInterests: _, ...child } = data.data;
  const sanitized = sanitizeChildProfile(child as Child & { pin?: string });
  useChildAuthStore.getState().setChild(sanitized);
  return {
    child: sanitized,
    rejectedInterests: data.data.rejectedInterests ?? [],
  };
}

export async function updateChildNotesForParent(notesForParent: string) {
  const { data } = await api.patch<ApiResponse<Child>>(
    "/child/profile/notes-for-parent",
    { notesForParent },
    { authMode: "child" },
  );
  const sanitized = sanitizeChildProfile(data.data as Child & { pin?: string });
  useChildAuthStore.getState().setChild(sanitized);
  return sanitized;
}

export async function updateChildClassGoals(payload: {
  classGoalDays: string[];
  classGoalDailyMinutes?: number | null;
}) {
  const { data } = await api.patch<ApiResponse<Child>>(
    "/child/profile/class-goals",
    payload,
    { authMode: "child" },
  );
  const sanitized = sanitizeChildProfile(data.data as Child & { pin?: string });
  useChildAuthStore.getState().setChild(sanitized);
  return sanitized;
}

export async function refreshChildSession() {
  const profile = await fetchChildProfile();
  useChildAuthStore.getState().setChild(profile);
  return profile;
}
