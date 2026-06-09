"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchParentProfile,
  getApiErrorMessage,
  updateParentProfile,
} from "@/lib/auth-api";
import { fetchParentChildren } from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function displayValue(value: string | null | undefined): string {
  return value?.trim() || "—";
}

function getInitial(name: string | null | undefined): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "P";
}

export default function ParentProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["parent-profile"],
    queryFn: fetchParentProfile,
  });
  const { data: children = [] } = useQuery({
    queryKey: ["parent-children"],
    queryFn: fetchParentChildren,
  });

  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    timeZone: "",
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      country: profile.country ?? "",
      timeZone: profile.timeZone ?? "",
    });
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: updateParentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-profile"] });
      setShowEdit(false);
      setSaveError(null);
    },
    onError: (error) => {
      setSaveError(getApiErrorMessage(error));
    },
  });

  const profileRows = useMemo(
    () => [
      { label: "Country", value: displayValue(profile?.country) },
      { label: "Timezone", value: displayValue(profile?.timeZone) },
    ],
    [profile],
  );

  function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaveError(null);
    saveMutation.mutate({
      name: form.name.trim(),
      phone: form.phone.trim(),
      country: form.country.trim(),
      timeZone: form.timeZone.trim(),
    });
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="mb-8">
        <h1 style={{ ...inter, fontWeight: 700, fontSize: "28px", lineHeight: "36px", color: "#FFFFFF", marginBottom: "8px" }}>
          Parent Profile
        </h1>
        <p style={{ ...inter, fontWeight: 400, fontSize: "15px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>
          Update your account details, preferences, and family settings.
        </p>
      </div>

      <div className="rounded-[12px] p-5 md:p-6 mb-6" style={{ backgroundColor: "#313044" }}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF" }}>Profile</h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>
              Basic info shown across your dashboards and reports.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSaveError(null);
              setShowEdit(true);
            }}
            disabled={isLoading || !profile}
            className="rounded-[12px] px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-50"
            style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}
          >
            Edit
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-[50px] h-[50px] rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0">
            <span style={{ ...inter, fontWeight: 600, fontSize: "22px", color: "#FFFFFF" }}>
              {isLoading ? "…" : getInitial(profile?.name)}
            </span>
          </div>
          <div>
            <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>
              {isLoading ? "Loading…" : displayValue(profile?.name)}
            </p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>
              {displayValue(profile?.email)}
            </p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>
              {displayValue(profile?.phone)}
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
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
              <span style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
        <h2 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF", marginBottom: "4px" }}>Children</h2>
        <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>
          At-a-glance list (full details live in dashboards/reports).
        </p>

        {children.length === 0 ? (
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)" }}>
            No children registered yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between rounded-[12px] px-4 py-3"
                style={{ backgroundColor: "#525162" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#313044] overflow-hidden flex-shrink-0">
                    <Image src="/assets/wayfinder Em.png" alt={child.userName} width={36} height={36} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{child.userName}</p>
                    <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
                      {formatChildGrade(child.grade)}
                    </p>
                  </div>
                </div>
                <span
                  className="uppercase"
                  style={{ ...inter, fontWeight: 700, fontSize: "12px", lineHeight: "16px", letterSpacing: "0.5px", color: "#858C94" }}
                >
                  Not started
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-[680px] rounded-[16px] p-5 md:p-7 relative" style={{ backgroundColor: "#313044" }}>
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80"
              style={{ backgroundColor: "#525162" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF", marginBottom: "4px" }}>
              Account information
            </h3>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
              Keep this accurate for reports, support, and billing.
            </p>

            <form onSubmit={handleSave} className="flex flex-col gap-2.5">
              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white/60 cursor-not-allowed"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Country
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Timezone
                </label>
                <input
                  type="text"
                  value={form.timeZone}
                  onChange={(e) => setForm((prev) => ({ ...prev, timeZone: e.target.value }))}
                  required
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              {saveError && (
                <p className="text-sm text-red-400 text-center" role="alert">
                  {saveError}
                </p>
              )}

              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="w-full rounded-[16px] py-3 mt-4 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-wait"
                style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF", letterSpacing: "1px" }}
              >
                {saveMutation.isPending ? "Saving…" : "SAVE CHANGES"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
