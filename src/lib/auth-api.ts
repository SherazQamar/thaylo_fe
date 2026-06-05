import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import type { UserWithChildren } from "@/lib/parent-registration";
import { useAuthStore } from "@/stores/auth.store";
import type { ApiResponse, User } from "@/types/api";

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  country: string;
  timeZone: string;
}

interface LoginResponseData {
  user: User;
  accessToken: string;
}

export async function registerParent(payload: RegisterPayload) {
  const { data } = await api.post<ApiResponse<User>>(
    "/auth/register",
    {
      email: payload.email,
      name: payload.name,
      password: payload.password,
      country: payload.country,
      timeZone: payload.timeZone,
    },
    { authMode: "none" },
  );
  return data.data;
}

export interface VerifyEmailPayload {
  code: string;
  id?: number;
  email?: string;
}

export async function verifyParentEmail(payload: VerifyEmailPayload) {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/verify-email",
    payload,
    { authMode: "none" },
  );
  return data;
}

export async function resendVerificationEmail(email: string) {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/resend-verification",
    { email },
    { authMode: "none" },
  );
  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/forgot-password",
    { email },
    { authMode: "none" },
  );
  return data;
}

export async function validateResetToken(token: string) {
  const { data } = await api.get<ApiResponse<null>>(
    "/auth/validate-reset-token",
    { params: { token }, authMode: "none" },
  );
  return data;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/reset-password",
    payload,
    { authMode: "none" },
  );
  return data;
}

export async function loginParent(email: string, password: string) {
  const { data } = await api.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    { email, password },
    { authMode: "none" },
  );
  return data.data;
}

export async function fetchParentProfile() {
  const { data } = await api.get<ApiResponse<UserWithChildren>>("/auth/profile");
  return data.data;
}

export async function refreshParentSession() {
  const profile = await fetchParentProfile();
  useAuthStore.getState().setUser(profile);
  return profile;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error && !isAxiosError(error)) {
    return error.message;
  }
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }
  return "Something went wrong. Please try again.";
}
