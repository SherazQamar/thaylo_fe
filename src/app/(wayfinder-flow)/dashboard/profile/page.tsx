"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  formatHiringRegionLabel,
  formatHiringTimezoneLabel,
} from "@/constants/wayfinder-hiring-regions";
import {
  getApiErrorMessage,
  updateParentProfile,
} from "@/lib/auth-api";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import AvatarPicker from "@/components/shared/AvatarPicker";
import {
  formatPhoneDisplay,
  formatPhoneInput,
  isValidPhoneDigits,
  normalizePhoneDigits,
  PHONE_INPUT_PLACEHOLDER,
  PHONE_VALIDATION_MESSAGE,
} from "@/lib/validation/phone";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatDisplayValue(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

interface EditFormState {
  name: string;
  phone: string;
  country: string;
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState<EditFormState>({
    name: "",
    phone: "",
    country: "",
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  const hiringRegionLabel = formatHiringRegionLabel(user?.region, user?.timeZone);
  const hiringTimezoneLabel = formatHiringTimezoneLabel(
    user?.region,
    user?.timeZone,
  );

  const saveMutation = useMutation({
    mutationFn: () =>
      updateParentProfile({
        name: form.name.trim(),
        phone: normalizePhoneDigits(form.phone),
        country: form.country.trim(),
        // Locked to hiring region on the server; sent for DTO validation only.
        timeZone: user?.timeZone?.trim() || "America/Los_Angeles",
      }),
    onSuccess: () => {
      setSaveError(null);
      setShowEdit(false);
    },
    onError: (err) => {
      setSaveError(getApiErrorMessage(err));
    },
  });

  function openEdit() {
    setForm({
      name: user?.name ?? "",
      phone: formatPhoneInput(user?.phone ?? ""),
      country: user?.country ?? "USA",
    });
    setSaveError(null);
    setShowEdit(true);
  }

  function closeEdit() {
    if (saveMutation.isPending) return;
    setShowEdit(false);
    setSaveError(null);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaveError(null);

    if (!form.name.trim()) {
      setSaveError("Full name is required");
      return;
    }
    if (!isValidPhoneDigits(form.phone)) {
      setSaveError(PHONE_VALIDATION_MESSAGE);
      return;
    }
    if (!form.country.trim()) {
      setSaveError("Country is required");
      return;
    }

    saveMutation.mutate();
  }

  const profileRows = [
    { label: "Country", value: formatDisplayValue(user?.country) },
    { label: "Hiring region", value: hiringRegionLabel },
    { label: "Timezone", value: hiringTimezoneLabel },
    { label: "Role", value: "Wayfinder" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2">
        <h1
          className="uppercase"
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "25px",
            letterSpacing: "0.8px",
            color: "#DCE6EC",
          }}
        >
          Wayfinder Profile
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Wayfinder Dashboard" },
          { href: "/dashboard/profile", label: "Profile" },
        ]}
      />

      <p
        style={{
          ...inter,
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "22px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "24px",
        }}
      >
        Update your account details. Hiring region and timezone are set during onboarding.
      </p>

      <div className="rounded-[12px] p-4 md:p-6" style={{ backgroundColor: "#313044" }}>
        <div className="flex items-center justify-between mb-2">
          <h2
            style={{
              ...inter,
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "28px",
              color: "#FFFFFF",
            }}
          >
            Profile
          </h2>
          <button
            type="button"
            onClick={openEdit}
            className="hidden md:block rounded-[8px] px-8 py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#00CED1",
              ...inter,
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#111023",
            }}
          >
            Edit
          </button>
        </div>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "20px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "24px",
          }}
        >
          Basic info shown across your dashboards and reports.
        </p>

        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-6">
          <AvatarPicker
            mode="user"
            displayName={user?.name ?? "Wayfinder"}
            currentAvatarUrl={user?.avatarUrl}
            size={56}
            onAvatarSaved={(avatarUrl, avatarKey) => {
              if (!user) return;
              setUser({ ...user, avatarUrl, avatarKey });
            }}
          />
          <div className="text-center sm:text-left">
            <p
              style={{
                ...inter,
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "22px",
                color: "#FFFFFF",
              }}
            >
              {formatDisplayValue(user?.name)}
            </p>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {formatDisplayValue(user?.email)}
            </p>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {formatPhoneDisplay(user?.phone)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div
            className="rounded-[12px] px-4 py-3 flex items-center gap-3 sm:col-span-3 md:col-span-1"
            style={{ backgroundColor: "rgba(0,206,209,0.1)" }}
          >
            <div
              className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#00CED1" }}
            >
              <span className="text-lg">🧭</span>
            </div>
            <p
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#FFFFFF",
              }}
            >
              Wayfinder
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {profileRows.map((item) => (
            <div
              key={item.label}
              className="rounded-[12px] px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-between"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <p
                style={{
                  ...inter,
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  ...inter,
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#FFFFFF",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={openEdit}
          className="md:hidden w-full rounded-[8px] py-3 mt-6 cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#111023",
          }}
        >
          Edit
        </button>
      </div>

      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="w-full max-w-[680px] rounded-[16px] p-5 md:p-7 relative"
            style={{ backgroundColor: "#313044" }}
          >
            <button
              type="button"
              onClick={closeEdit}
              disabled={saveMutation.isPending}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: "#525162" }}
              aria-label="Close"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "18px",
                lineHeight: "26px",
                color: "#FFFFFF",
                marginBottom: "4px",
              }}
            >
              Account information
            </h3>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "20px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "20px",
              }}
            >
              Keep this accurate for reports, support, and scheduling.
            </p>

            <form onSubmit={handleSave} className="flex flex-col gap-2.5">
              <div>
                <label
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{
                    backgroundColor: "#525162",
                    ...inter,
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white/60 cursor-not-allowed"
                  style={{
                    backgroundColor: "#525162",
                    ...inter,
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value) }))
                  }
                  placeholder={PHONE_INPUT_PLACEHOLDER}
                  maxLength={12}
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{
                    backgroundColor: "#525162",
                    ...inter,
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Country
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, country: e.target.value }))
                  }
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{
                    backgroundColor: "#525162",
                    ...inter,
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Hiring region
                </label>
                <p
                  className="w-full rounded-[12px] px-4 py-2.5 text-white/80"
                  style={{
                    backgroundColor: "#3f3e52",
                    ...inter,
                    fontSize: "14px",
                  }}
                >
                  {hiringRegionLabel}
                </p>
                <p
                  className="mt-1.5 text-white/40"
                  style={{ ...inter, fontSize: "12px", lineHeight: "18px" }}
                >
                  Set during hiring. Timezone follows this region’s operational hours.
                </p>
              </div>

              <div>
                <label
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Timezone
                </label>
                <p
                  className="w-full rounded-[12px] px-4 py-2.5 text-white/80"
                  style={{
                    backgroundColor: "#3f3e52",
                    ...inter,
                    fontSize: "14px",
                  }}
                >
                  {hiringTimezoneLabel}
                </p>
              </div>

              {saveError && (
                <p
                  className="text-sm text-red-400 text-center"
                  role="alert"
                  style={inter}
                >
                  {saveError}
                </p>
              )}

              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="w-full rounded-[16px] py-3 mt-4 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-wait"
                style={{
                  backgroundColor: "#00CED1",
                  ...inter,
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "22px",
                  color: "#111023",
                  letterSpacing: "1px",
                }}
              >
                {saveMutation.isPending ? "SAVING…" : "SAVE CHANGES"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
