import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export type AvatarPreset = {
  key: string;
  imageUrl: string;
};

export async function fetchUserAvatarPresets() {
  const { data } = await api.get<ApiResponse<{ presets: AvatarPreset[] }>>(
    "/avatars/presets",
  );
  return data.data.presets;
}

export async function setUserAvatar(avatarKey: string) {
  const { data } = await api.put<
    ApiResponse<{
      id: number;
      avatarKey: string | null;
      avatarUrl: string | null;
      [key: string]: unknown;
    }>
  >("/avatars/me", { avatarKey });
  return data.data;
}

export async function fetchChildAvatarPresets() {
  const { data } = await api.get<ApiResponse<{ presets: AvatarPreset[] }>>(
    "/child/avatars/presets",
    { authMode: "child" },
  );
  return data.data.presets;
}

export async function setChildAvatar(avatarKey: string) {
  const { data } = await api.put<
    ApiResponse<{
      id: number;
      avatarKey: string | null;
      avatarUrl: string | null;
      [key: string]: unknown;
    }>
  >("/child/avatars/me", { avatarKey }, { authMode: "child" });
  return data.data;
}
