"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchChildAvatarPresets,
  fetchUserAvatarPresets,
  setChildAvatar,
  setUserAvatar,
  type AvatarPreset,
} from "@/lib/avatar-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import PortalAvatar from "@/components/shared/PortalAvatar";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type AvatarPickerProps = {
  mode: "user" | "child";
  displayName: string;
  currentAvatarUrl?: string | null;
  onAvatarSaved?: (avatarUrl: string | null, avatarKey: string) => void;
  className?: string;
  size?: number;
  /** When false, only the clickable avatar is shown (no side label). Default false. */
  showLabel?: boolean;
};

function CameraIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export default function AvatarPicker({
  mode,
  displayName,
  currentAvatarUrl,
  onAvatarSaved,
  className = "",
  size = 50,
  showLabel = false,
}: AvatarPickerProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const presetsQuery = useQuery({
    queryKey: ["avatar-presets", mode],
    queryFn: mode === "child" ? fetchChildAvatarPresets : fetchUserAvatarPresets,
    enabled: open,
  });

  const saveMutation = useMutation({
    mutationFn: (avatarKey: string) =>
      mode === "child" ? setChildAvatar(avatarKey) : setUserAvatar(avatarKey),
    onSuccess: (data) => {
      onAvatarSaved?.(data.avatarUrl ?? null, data.avatarKey ?? "");
      void queryClient.invalidateQueries({ queryKey: ["avatar-presets", mode] });
      setOpen(false);
    },
  });

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const presets: AvatarPreset[] = presetsQuery.data ?? [];
  const selectedKey = presets.find((p) => p.imageUrl === currentAvatarUrl)?.key;
  const showChangeText = size >= 64;

  return (
    <div className={className}>
      <div className={`flex items-center ${showLabel ? "gap-4" : ""}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative group rounded-full overflow-hidden shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00CED1]"
          style={{ width: size, height: size }}
          aria-label="Change profile avatar"
          title="Change avatar"
        >
          <span className="block w-full h-full transition-[filter] duration-200 group-hover:blur-[2px] group-focus-visible:blur-[2px]">
            <PortalAvatar
              name={displayName}
              avatarUrl={currentAvatarUrl}
              size={size}
              useWordInitials
            />
          </span>
          <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-full bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100 group-focus-visible:bg-black/45 group-focus-visible:opacity-100">
            <CameraIcon size={showChangeText ? 20 : 16} />
            {showChangeText ? (
              <span style={{ ...inter, fontWeight: 600, fontSize: "11px" }}>Change</span>
            ) : null}
          </span>
        </button>
        {showLabel ? (
          <div className="min-w-0">
            <p style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>
              Profile avatar
            </p>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "4px",
              }}
            >
              Hover and click your avatar to choose from the official set for your role.
            </p>
          </div>
        ) : null}
      </div>

      {saveMutation.isError && !open ? (
        <p className="mt-3" style={{ ...inter, fontSize: "13px", color: "#FF7B7B" }} role="alert">
          {getApiErrorMessage(saveMutation.error)}
        </p>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close avatar picker"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative w-full max-w-lg rounded-[16px] border border-white/10 p-5 md:p-6 shadow-xl"
            style={{ backgroundColor: "#313044" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-picker-title"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3
                  id="avatar-picker-title"
                  style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF" }}
                >
                  Choose avatar
                </h3>
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: "4px",
                  }}
                >
                  Official Thaylo avatars only — no external uploads.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {presetsQuery.isLoading ? (
              <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                Loading avatars…
              </p>
            ) : null}

            {presetsQuery.isError ? (
              <p style={{ ...inter, fontSize: "13px", color: "#FF7B7B" }} role="alert">
                {getApiErrorMessage(presetsQuery.error)}
              </p>
            ) : null}

            {presets.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {presets.map((preset) => {
                  const isSelected =
                    selectedKey === preset.key || currentAvatarUrl === preset.imageUrl;
                  const isSaving =
                    saveMutation.isPending && saveMutation.variables === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      disabled={saveMutation.isPending}
                      onClick={() => saveMutation.mutate(preset.key)}
                      className={
                        "relative aspect-square rounded-full overflow-hidden transition-transform hover:scale-105 disabled:opacity-60 " +
                        (isSelected
                          ? "ring-2 ring-[#00CED1] ring-offset-2 ring-offset-[#313044]"
                          : "ring-1 ring-white/10 hover:ring-[#00CED1]/50")
                      }
                      title={preset.key}
                      aria-pressed={isSelected}
                      aria-label={`Select avatar ${preset.key}`}
                    >
                      <Image
                        src={preset.imageUrl}
                        alt=""
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                      {isSaving ? (
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-semibold">
                          …
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {saveMutation.isError ? (
              <p
                className="mt-3"
                style={{ ...inter, fontSize: "13px", color: "#FF7B7B" }}
                role="alert"
              >
                {getApiErrorMessage(saveMutation.error)}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
