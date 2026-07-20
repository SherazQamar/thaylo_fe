import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import type { UserWithChildren } from "@/lib/parent-registration";
import { useAuthStore } from "@/stores/auth.store";
import type { ApiResponse, PortalUserRole, User } from "@/types/api";
import type { GuardianRelationInput } from "@/lib/guardian";

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  country: string;
  timeZone: string;
  guardianType: GuardianRelationInput;
  secondaryGuardianName?: string;
  secondaryGuardianType?: GuardianRelationInput;
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
      guardianType: payload.guardianType,
      ...(payload.secondaryGuardianName
        ? {
            secondaryGuardianName: payload.secondaryGuardianName,
            secondaryGuardianType: payload.secondaryGuardianType,
          }
        : {}),
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

export async function loginUser(email: string, password: string) {
  const { data } = await api.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    { email, password },
    { authMode: "none" },
  );
  return data.data;
}

export async function loginParent(email: string, password: string) {
  return loginUser(email, password);
}

export async function fetchUserProfile() {
  const { data } = await api.get<ApiResponse<UserWithChildren>>("/auth/profile");
  return data.data;
}

export async function fetchParentProfile() {
  return fetchUserProfile();
}

export interface ValidateResetTokenData {
  role: PortalUserRole;
}

export async function validateResetToken(token: string) {
  const { data } = await api.get<ApiResponse<ValidateResetTokenData>>(
    "/auth/validate-reset-token",
    { params: { token }, authMode: "none" },
  );
  return data;
}

export interface SetWayfinderPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export async function setWayfinderPassword(payload: SetWayfinderPasswordPayload) {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/wayfinder/set-password",
    payload,
    { authMode: "none" },
  );
  return data;
}

export async function refreshParentSession() {
  const profile = await fetchParentProfile();
  useAuthStore.getState().setUser(profile);
  return profile;
}

export interface UpdateParentProfilePayload {
  name: string;
  phone: string;
  country: string;
  timeZone: string;
}

export async function updateParentProfile(payload: UpdateParentProfilePayload) {
  await api.put<ApiResponse<User>>("/auth/update", payload);
  return refreshParentSession();
}

export function isIgnorableRequestError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return (
    error.code === "ERR_CANCELED" ||
    error.name === "CanceledError" ||
    error.message === "canceled"
  );
}

export function getApiErrorMessage(error: unknown): string {
  if (isIgnorableRequestError(error)) {
    return "";
  }
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

export function isEmailAlreadyRegisteredMessage(message: string): boolean {
  return message.toLowerCase().includes("email already exists");
}
