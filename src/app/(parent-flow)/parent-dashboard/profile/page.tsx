"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { US_TIMEZONES } from "@/constants/us-timezones";
import { updateParentProfile } from "@/lib/auth-api";
import { notify } from "@/lib/notify";
import { fetchParentChildren } from "@/lib/parent-api";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import AvatarPicker from "@/components/shared/AvatarPicker";
import PortalAvatar from "@/components/shared/PortalAvatar";
import {
  formatPhoneDisplay,
  formatPhoneInput,
  isValidPhoneDigits,
  normalizePhoneDigits,
  PHONE_INPUT_PLACEHOLDER,
  PHONE_VALIDATION_MESSAGE,
} from "@/lib/validation/phone";
import { formatGuardianRelationLabel } from "@/lib/guardian";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatDisplayValue(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function formatTimezoneLabel(timeZone: string | null | undefined): string {
  if (!timeZone?.trim()) return "—";
  const match = US_TIMEZONES.find((tz) => tz.value === timeZone);
  return match ? match.label : timeZone;
}

function formatPreferredLanguage(languages: string[] | undefined): string {
  const cleaned = (languages ?? []).map((l) => l.trim()).filter(Boolean);
  if (cleaned.length === 0) return "—";
  return cleaned.join(", ");
}

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

/** Figma Parent Profile child row status from plantStatus. */
function childTrackStatus(plantStatus: string | undefined): {
  label: "Needs attention" | "On track";
  color: string;
} {
  const lower = (plantStatus ?? "").toLowerCase();
  if (
    !lower ||
    lower.includes("not started") ||
    lower.includes("slow") ||
    lower.includes("struggl") ||
    lower.includes("risk") ||
    lower.includes("wilt") ||
    lower.includes("attention")
  ) {
    return { label: "Needs attention", color: "#F59E0B" };
  }
  return { label: "On track", color: "#00CED1" };
}

interface EditFormState {
  name: string;
  phone: string;
  country: string;
  timeZone: string;
}

export default function ParentProfilePage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState<EditFormState>({
    name: "",
    phone: "",
    country: "",
    timeZone: "",
  });

  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ["parent-children"],
    queryFn: fetchParentChildren,
  });

  const preferredLanguage = formatPreferredLanguage(user?.languagesSpoken);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateParentProfile({
        name: form.name.trim(),
        phone: normalizePhoneDigits(form.phone),
        country: form.country.trim(),
        timeZone: form.timeZone.trim(),
      }),
    onSuccess: () => {
      setShowEdit(false);
      void queryClient.invalidateQueries({ queryKey: ["parent-children"] });
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
      timeZone: user?.timeZone ?? "",
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
    if (!form.timeZone.trim()) {
      notify.error("Timezone is required");
      return;
    }

    saveMutation.mutate();
  }

  /** Figma rows first; keep guardian fields so nothing is removed. */
  const profileRows = [
    { label: "Country", value: formatDisplayValue(user?.country) },
    { label: "Timezone", value: formatTimezoneLabel(user?.timeZone) },
    { label: "Preferred language", value: preferredLanguage },
    {
      label: "Primary contact type",
      value: formatGuardianRelationLabel(user?.guardianType),
    },
    ...(user?.secondaryGuardianName?.trim()
      ? [
          {
            label: "Second parent/guardian",
            value: user.secondaryGuardianName.trim(),
          },
          {
            label: "Second contact type",
            value: formatGuardianRelationLabel(user?.secondaryGuardianType),
          },
        ]
      : []),
  ];

  return (
    <div className="px-6 py-4 md:p-6 lg:p-10">
      <div className="mb-6 md:mb-8">
        <div className="flex items-start justify-between gap-4 mb-2 md:mb-3">
          <h1
            className="text-[32px] leading-[40px] md:text-[36px] md:leading-[54px]"
            style={{
              ...inter,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Parent Profile
          </h1>
          <div className="hidden md:block flex-shrink-0 pt-2">
            <ParentUserDropdown />
          </div>
        </div>

        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/parent-dashboard", label: "Parent Dashboard" },
            { href: "/parent-dashboard/profile", label: "Profile" },
          ]}
        />

        <p
          className="text-[14px] leading-6 md:text-[15px] md:leading-6 max-w-[475px]"
          style={{
            ...inter,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Update your account details, preferences, and family settings.
        </p>
      </div>

      {/* Profile card — Figma 40000474:2471 / 40000563:12368 */}
      <div
        className="rounded-[12px] p-5 md:p-7 mb-6"
        style={{ backgroundColor: "#313044" }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
          <div className="min-w-0">
            <h2
              className="text-[22px] leading-9 md:text-[24px] md:leading-9"
              style={{
                ...inter,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              Profile
            </h2>
            <p
              className="mt-1 text-[13px] leading-5 md:leading-5"
              style={{
                ...inter,
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Basic info shown across your dashboards and reports.
            </p>
          </div>

          {/* Desktop Edit — top right */}
          <button
            type="button"
            onClick={openEdit}
            className="hidden md:inline-flex items-center justify-center rounded-[12px] h-12 px-10 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
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

          {/* Mobile Edit — under header (Figma) */}
          <button
            type="button"
            onClick={openEdit}
            className="md:hidden w-full rounded-[12px] h-12 cursor-pointer hover:opacity-90 transition-opacity"
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

        <div className="flex items-center gap-3 mb-6">
          <AvatarPicker
            mode="user"
            displayName={user?.name ?? "Parent"}
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
                lineHeight: "23px",
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
                lineHeight: "19px",
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
                lineHeight: "19px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {formatPhoneDisplay(user?.phone)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {profileRows.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 rounded-[12px] px-4 md:px-5 py-4 min-h-[59px]"
              style={{ backgroundColor: "#525162" }}
            >
              <span
                style={{
                  ...inter,
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "23px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {item.label}
              </span>
              <span
                className="text-right"
                style={{
                  ...inter,
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "23px",
                  color: "#FFFFFF",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Children card */}
      <div
        className="rounded-[12px] p-5 md:p-7"
        style={{ backgroundColor: "#313044" }}
      >
        <h2
          className="text-[22px] leading-9 md:text-[24px] md:leading-9"
          style={{
            ...inter,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: "4px",
          }}
        >
          Children
        </h2>
        <p
          className="text-[13px] leading-5 mb-5"
          style={{
            ...inter,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          At-a-glance list (full details live in dashboards/reports).
        </p>

        {childrenLoading ? (
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "22px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading children…
          </p>
        ) : children.length === 0 ? (
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "22px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No children registered yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {children.map((child) => {
              const track = childTrackStatus(child.plantStatus);
              return (
                <Link
                  key={child.id}
                  href={`/parent-dashboard/child?id=${child.id}&from=profile`}
                  className="rounded-[12px] px-4 py-3.5 hover:bg-white/10 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  style={{ backgroundColor: "#525162" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <PortalAvatar
                      name={child.userName}
                      avatarUrl={child.avatarUrl}
                      size={40}
                      useWordInitials
                    />
                    <div className="min-w-0">
                      <p
                        style={{
                          ...inter,
                          fontWeight: 600,
                          fontSize: "15px",
                          lineHeight: "28px",
                          color: "#FFFFFF",
                        }}
                      >
                        {child.userName}
                      </p>
                      <p
                        style={{
                          ...inter,
                          fontWeight: 500,
                          fontSize: "12px",
                          lineHeight: "20px",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {formatChildGrade(child.grade)}
                        {(child.interestAreas?.length ?? 0) > 0
                          ? ` · ${child.interestAreas!.slice(0, 3).join(", ")}${
                              child.interestAreas!.length > 3 ? "…" : ""
                            }`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className="pl-[52px] md:pl-0 md:shrink-0"
                    style={{
                      ...inter,
                      fontWeight: 500,
                      fontSize: "13px",
                      lineHeight: "18px",
                      color: track.color,
                    }}
                  >
                    {track.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
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
                lineHeight: "36px",
                color: "#FFFFFF",
                marginBottom: "4px",
                paddingRight: "28px",
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
              Keep this accurate for reports, support, and billing.
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
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
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
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
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
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
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
                <input
                  type="text"
                  value={preferredLanguage === "—" ? "" : preferredLanguage}
                  readOnly
                  placeholder="—"
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white/60 cursor-not-allowed"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
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
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
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
                  Timezone
                </label>
                <select
                  value={form.timeZone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, timeZone: e.target.value }))
                  }
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                >
                  <option value="" disabled>
                    Select timezone
                  </option>
                  {US_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
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
                  lineHeight: "29px",
                  color: "#FFFFFF",
                  letterSpacing: "0.5px",
                }}
              >
                {saveMutation.isPending ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
