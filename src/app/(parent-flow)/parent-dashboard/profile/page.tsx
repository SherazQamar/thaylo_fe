"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { US_TIMEZONES } from "@/constants/us-timezones";
import {
  getApiErrorMessage,
  updateParentProfile,
} from "@/lib/auth-api";
import { fetchParentChildren } from "@/lib/parent-api";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
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

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  return name.trim().charAt(0).toUpperCase();
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
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState<EditFormState>({
    name: "",
    phone: "",
    country: "",
    timeZone: "",
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ["parent-children"],
    queryFn: fetchParentChildren,
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateParentProfile({
        name: form.name.trim(),
        phone: normalizePhoneDigits(form.phone),
        country: form.country.trim(),
        timeZone: form.timeZone.trim(),
      }),
    onSuccess: () => {
      setSaveError(null);
      setShowEdit(false);
      void queryClient.invalidateQueries({ queryKey: ["parent-children"] });
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
      timeZone: user?.timeZone ?? "",
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
    if (!form.timeZone.trim()) {
      setSaveError("Timezone is required");
      return;
    }

    saveMutation.mutate();
  }

  const profileRows = [
    { label: "Primary contact type", value: formatGuardianRelationLabel(user?.guardianType) },
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
    { label: "Country", value: formatDisplayValue(user?.country) },
    { label: "Timezone", value: formatTimezoneLabel(user?.timeZone) },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="mb-8">
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
            Parent Profile
          </h1>
          <div className="hidden md:block">
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
        className="rounded-[12px] p-5 md:p-6 mb-6"
        style={{ backgroundColor: "#313044" }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
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
            className="rounded-[12px] px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
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
          <div className="w-[50px] h-[50px] rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0">
            <span
              style={{
                ...inter,
                fontWeight: 600,
                fontSize: "22px",
                color: "#FFFFFF",
              }}
            >
              {getInitials(user?.name)}
            </span>
          </div>
          <div>
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

        <div className="flex flex-col gap-2.5">
          {profileRows.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-[12px] px-4 py-3"
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
                style={{
                  ...inter,
                  fontWeight: 600,
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
      </div>

      <div
        className="rounded-[12px] p-5 md:p-6"
        style={{ backgroundColor: "#313044" }}
      >
        <h2
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "18px",
            lineHeight: "26px",
            color: "#FFFFFF",
            marginBottom: "4px",
          }}
        >
          Children
        </h2>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "20px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "16px",
          }}
        >
          At-a-glance list — click a child to open their profile and interest areas.
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
          <div className="flex flex-col gap-2.5">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/parent-dashboard/child?id=${child.id}&from=profile`}
                className="flex items-center justify-between rounded-[12px] px-4 py-3 hover:bg-white/10 transition-colors"
                style={{ backgroundColor: "#525162" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#313044] overflow-hidden flex-shrink-0 flex items-center justify-center text-lg">
                    🧒
                  </div>
                  <div className="min-w-0">
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#FFFFFF",
                      }}
                    >
                      {child.userName}
                    </p>
                    <p
                      className="truncate"
                      style={{
                        ...inter,
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "16px",
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
                  className="uppercase shrink-0 ml-3"
                  style={{
                    ...inter,
                    fontWeight: 700,
                    fontSize: "12px",
                    lineHeight: "16px",
                    letterSpacing: "0.5px",
                    color: "#00CED1",
                  }}
                >
                  View
                </span>
              </Link>
            ))}
          </div>
        )}
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
                    setForm((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value) }))
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
                  color: "#FFFFFF",
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
