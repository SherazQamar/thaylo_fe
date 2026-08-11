"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  formatHiringRegionLabel,
  formatHiringTimezoneLabel,
} from "@/constants/wayfinder-hiring-regions";
import { updateParentProfile } from "@/lib/auth-api";
import { notify } from "@/lib/notify";
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

function formatPreferredLanguage(languages: string[] | undefined): string {
  const cleaned = (languages ?? []).map((l) => l.trim()).filter(Boolean);
  if (cleaned.length === 0) return "—";
  return cleaned.join(", ");
}

function formatCertifiedLabel(specialty: string | null | undefined): string | null {
  const trimmed = specialty?.trim();
  if (!trimmed) return null;
  if (/^certified\s*:/i.test(trimmed)) return trimmed;
  return `Certified: ${trimmed}`;
}

interface EditFormState {
  name: string;
  phone: string;
  country: string;
}

type CredentialChip = {
  key: string;
  label: string;
  icon: "document" | "star" | "edu";
};

function ChipIcon({ type }: { type: CredentialChip["icon"] }) {
  if (type === "star") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1 1 5.78L12 16.9l-5.21 2.6 1-5.78-4.21-4.1 5.82-.85L12 3.5z"
          fill="#111023"
        />
      </svg>
    );
  }
  if (type === "edu") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3L2 8l10 5 9-4.5V17h2V8L12 3z"
          fill="#111023"
        />
        <path
          d="M6 12.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-3.5"
          stroke="#111023"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="#111023"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke="#111023" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h6" stroke="#111023" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
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

  const hiringRegionLabel = formatHiringRegionLabel(user?.region, user?.timeZone);
  const hiringTimezoneLabel = formatHiringTimezoneLabel(
    user?.region,
    user?.timeZone,
  );
  const preferredLanguage = formatPreferredLanguage(user?.languagesSpoken);

  const credentialChips = useMemo((): CredentialChip[] => {
    const chips: CredentialChip[] = [];
    const certified = formatCertifiedLabel(user?.specialty);
    if (certified) {
      chips.push({ key: "specialty", label: certified, icon: "document" });
    }
    // Figma desktop shows a middle “years experience” chip; no BE field yet — omit.
    if (user?.gradeLevel?.trim()) {
      chips.push({
        key: "gradeLevel",
        label: user.gradeLevel.trim(),
        icon: "edu",
      });
    }
    return chips;
  }, [user?.specialty, user?.gradeLevel]);

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
      setShowEdit(false);
    },
    onError: (err) => {
      notify.error(err);
    },
  });

  function openEdit() {
    setForm({
      name: user?.name ?? "",
      phone: formatPhoneInput(user?.phone ?? ""),
      country: user?.country ?? "USA",
    });
    setShowEdit(true);
  }

  function closeEdit() {
    if (saveMutation.isPending) return;
    setShowEdit(false);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      notify.error("Full name is required");
      return;
    }
    if (!isValidPhoneDigits(form.phone)) {
      notify.error(PHONE_VALIDATION_MESSAGE);
      return;
    }
    if (!form.country.trim()) {
      notify.error("Country is required");
      return;
    }

    saveMutation.mutate();
  }

  /** Profile rows: Country / Hiring region / Timezone / Preferred language */
  const profileRows = [
    { label: "Country", value: formatDisplayValue(user?.country) },
    { label: "Hiring region", value: hiringRegionLabel },
    { label: "Timezone", value: formatDisplayValue(user?.timeZone) },
    { label: "Preferred language", value: preferredLanguage },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <h1
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "28px",
              lineHeight: "36px",
              color: "#FFFFFF",
            }}
          >
            WayFinder Profile
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
            fontSize: "15px",
            lineHeight: "24px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Update your account details, preferences, and family settings.
        </p>
      </div>

      <div
        className="rounded-[12px] p-5 md:p-6"
        style={{ backgroundColor: "#313044" }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <h2
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "18px",
                lineHeight: "26px",
                color: "#FFFFFF",
              }}
            >
              Profile
            </h2>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "20px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Basic info shown across your dashboards and reports.
            </p>
          </div>
          <button
            type="button"
            onClick={openEdit}
            className="hidden md:inline-flex items-center justify-center rounded-[12px] px-10 py-3 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            style={{
              backgroundColor: "#00CED1",
              ...inter,
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#FFFFFF",
              minWidth: "198px",
            }}
          >
            Edit
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5 md:mb-6">
          <AvatarPicker
            mode="user"
            displayName={user?.name ?? "Wayfinder"}
            currentAvatarUrl={user?.avatarUrl}
            size={70}
            onAvatarSaved={(avatarUrl, avatarKey) => {
              if (!user) return;
              setUser({ ...user, avatarUrl, avatarKey });
            }}
          />
          <div className="min-w-0">
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

        {/* Desktop-only credential chips (Figma WayFinder Profile) */}
        {credentialChips.length > 0 && (
          <div
            className={`hidden md:grid gap-3 mb-5 ${
              credentialChips.length >= 3
                ? "grid-cols-3"
                : credentialChips.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-1 max-w-md"
            }`}
          >
            {credentialChips.map((chip) => (
              <div
                key={chip.key}
                className="rounded-[12px] px-3 py-3 flex items-center gap-3 min-h-[72px]"
                style={{ backgroundColor: "rgba(0,206,209,0.12)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#00CED1" }}
                >
                  <ChipIcon type={chip.icon} />
                </div>
                <p
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "15px",
                    lineHeight: "22px",
                    color: "#FFFFFF",
                  }}
                >
                  {chip.label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {profileRows.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 rounded-[12px] px-4 md:px-5 py-3.5 md:py-4"
              style={{ backgroundColor: "#525162" }}
            >
              <span
                style={{
                  ...inter,
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {item.label}
              </span>
              <span
                className="text-right"
                style={{
                  ...inter,
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#FFFFFF",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={openEdit}
          className="md:hidden w-full rounded-[12px] py-3 mt-6 cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#FFFFFF",
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
            className="w-full max-w-[680px] rounded-[16px] p-5 md:p-7 relative max-h-[90vh] overflow-y-auto"
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
                    setForm((prev) => ({
                      ...prev,
                      phone: formatPhoneInput(e.target.value),
                    }))
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
                  Preferred language
                </label>
                <p
                  className="w-full rounded-[12px] px-4 py-2.5 text-white/80"
                  style={{
                    backgroundColor: "#3f3e52",
                    ...inter,
                    fontSize: "14px",
                  }}
                >
                  {preferredLanguage}
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
