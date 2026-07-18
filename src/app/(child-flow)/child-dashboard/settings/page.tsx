"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import OnboardingResultsPanel from "@/components/onboarding/OnboardingResultsPanel";
import { getApiErrorMessage } from "@/lib/auth-api";
import { updateChildClassGoals } from "@/lib/child-api";
import { useChildAuthStore } from "@/stores/child-auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const CLASS_GOAL_DAY_OPTIONS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
] as const;

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function splitDisplayName(userName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const trimmed = userName?.trim();
  if (!trimmed) {
    return { firstName: "—", lastName: "—" };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "—" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export default function ChildSettingsPage() {
  const child = useChildAuthStore((state) => state.child);
  const [activeTab, setActiveTab] = useState<"general" | "preferences">("general");
  const [soundEffects, setSoundEffects] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dailyMinutes, setDailyMinutes] = useState("");
  const [goalsError, setGoalsError] = useState<string | null>(null);
  const [goalsSaved, setGoalsSaved] = useState(false);

  const displayName = child?.userName?.trim() || "Student";
  const { firstName, lastName } = splitDisplayName(child?.userName);
  const gradeLabel = formatChildGrade(child?.grade);

  useEffect(() => {
    setSelectedDays(child?.classGoalDays ?? []);
    setDailyMinutes(
      child?.classGoalDailyMinutes != null
        ? String(child.classGoalDailyMinutes)
        : "",
    );
  }, [child?.id, child?.classGoalDays, child?.classGoalDailyMinutes]);

  const goalsMutation = useMutation({
    mutationFn: () => {
      const trimmed = dailyMinutes.trim();
      let minutes: number | null = null;
      if (trimmed) {
        const parsed = Number(trimmed);
        if (!Number.isFinite(parsed) || parsed < 1 || parsed > 480) {
          throw new Error("Enter a daily goal between 1 and 480 minutes.");
        }
        minutes = Math.round(parsed);
      }
      return updateChildClassGoals({
        classGoalDays: selectedDays,
        classGoalDailyMinutes: minutes,
      });
    },
    onSuccess: (updated) => {
      setSelectedDays(updated.classGoalDays ?? []);
      setDailyMinutes(
        updated.classGoalDailyMinutes != null
          ? String(updated.classGoalDailyMinutes)
          : "",
      );
      setGoalsError(null);
      setGoalsSaved(true);
      setTimeout(() => setGoalsSaved(false), 2500);
    },
    onError: (err) => setGoalsError(getApiErrorMessage(err)),
  });

  function toggleDay(day: string) {
    setGoalsSaved(false);
    setGoalsError(null);
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function handleSaveGoals() {
    setGoalsError(null);
    goalsMutation.mutate();
  }

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
            Settings
          </h1>
          <div className="hidden md:block">
            <ChildUserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/child-dashboard", label: "Student Dashboard" },
            { href: "/child-dashboard/settings", label: "Settings" },
          ]}
        />
      </div>

      <div className="flex gap-6 mb-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`pb-2.5 cursor-pointer transition-colors ${activeTab === "general" ? "border-b-2 border-[#00CED1] text-[#00CED1]" : "text-white/40 hover:text-white/60"}`}
          style={{ ...inter, fontWeight: 500, fontSize: "14px" }}
        >
          General Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`pb-2.5 cursor-pointer transition-colors ${activeTab === "preferences" ? "border-b-2 border-[#00CED1] text-[#00CED1]" : "text-white/40 hover:text-white/60"}`}
          style={{ ...inter, fontWeight: 500, fontSize: "14px" }}
        >
          Learning Preferences
        </button>
      </div>

      {activeTab === "general" ? (
        <>
          <div className="mb-6">
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "4px" }}>General Settings</h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              Customize your daily goals, difficulty settings, and study focus.
            </p>
          </div>

          <div className="rounded-[16px] p-5 mb-6" style={{ backgroundColor: "#313044" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center flex-shrink-0 text-3xl"
                style={{ border: "2px dashed #00CED1" }}
              >
                🧒
              </div>
              <div>
                <p style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF" }}>{displayName}</p>
                <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                  {gradeLabel}
                </p>
                <button
                  type="button"
                  disabled
                  className="rounded-full px-4 py-1.5 mt-2 cursor-not-allowed opacity-50"
                  style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "12px", color: "#111023" }}
                  title="Photo upload coming soon"
                >
                  Upload Photo
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] p-5 mb-6" style={{ backgroundColor: "#313044" }}>
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF", marginBottom: "4px" }}>
              Class schedule goals
            </h3>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", lineHeight: "20px" }}>
              Choose the days and daily minutes you want to be in class. These goals can help unlock badges later.
            </p>

            <p style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "10px" }}>
              Days in class
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {CLASS_GOAL_DAY_OPTIONS.map((day) => {
                const selected = selectedDays.includes(day.key);
                return (
                  <label
                    key={day.key}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 cursor-pointer select-none"
                    style={{
                      backgroundColor: selected
                        ? "rgba(0,206,209,0.2)"
                        : "rgba(255,255,255,0.06)",
                      border: selected
                        ? "1px solid #00CED1"
                        : "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleDay(day.key)}
                      className="accent-[#00CED1] cursor-pointer"
                    />
                    <span
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "13px",
                        color: selected ? "#00CED1" : "rgba(255,255,255,0.75)",
                      }}
                    >
                      {day.label}
                    </span>
                  </label>
                );
              })}
            </div>

            <label
              htmlFor="daily-minutes-goal"
              style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "8px" }}
            >
              Daily minutes
            </label>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <input
                id="daily-minutes-goal"
                type="number"
                min={1}
                max={480}
                inputMode="numeric"
                value={dailyMinutes}
                onChange={(e) => {
                  setDailyMinutes(e.target.value);
                  setGoalsError(null);
                  setGoalsSaved(false);
                }}
                placeholder="e.g. 30"
                className="w-[140px] rounded-full px-5 py-3 outline-none text-white"
                style={{ backgroundColor: "#525162", border: "1px solid #525162", ...inter, fontSize: "14px" }}
              />
              <span style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                minutes per day
              </span>
            </div>

            {goalsError && (
              <p className="text-sm text-red-400 mb-3" role="alert" style={inter}>
                {goalsError}
              </p>
            )}
            {goalsSaved && !goalsError && (
              <p className="mb-3" style={{ ...inter, fontSize: "13px", color: "#22C55E" }}>
                Class goals saved.
              </p>
            )}

            <button
              type="button"
              onClick={handleSaveGoals}
              disabled={goalsMutation.isPending}
              className="rounded-full px-5 py-2.5 cursor-pointer hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "#00CED1",
                ...inter,
                fontWeight: 600,
                fontSize: "14px",
                color: "#111023",
              }}
            >
              {goalsMutation.isPending ? "Saving…" : "Save goals"}
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>Personal Information</h3>
            </div>
            <div className="flex items-center gap-1.5 mb-5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Managed by parent</span>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    readOnly
                    className="w-full rounded-full px-5 py-3 outline-none text-white/50 cursor-not-allowed"
                    style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    readOnly
                    className="w-full rounded-full px-5 py-3 outline-none text-white/50 cursor-not-allowed"
                    style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontSize: "14px" }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={displayName}
                  readOnly
                  className="w-full rounded-full px-5 py-3 outline-none text-white/50 cursor-not-allowed"
                  style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                  Grade
                </label>
                <input
                  type="text"
                  value={gradeLabel}
                  readOnly
                  className="w-full rounded-full px-5 py-3 outline-none text-white/50 cursor-not-allowed"
                  style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontSize: "14px" }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "12px" }}>Preferences</h2>
            <div className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 mb-6" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                Some settings are managed by parents
              </span>
            </div>

            <div className="rounded-[16px] p-5" style={{ backgroundColor: "#313044" }}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#111023] flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>Sound Effects</p>
                    <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Play sounds for correct answers and streaks.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEffects(!soundEffects)}
                  className="w-[44px] h-[24px] rounded-full relative cursor-pointer transition-colors flex-shrink-0"
                  style={{ backgroundColor: soundEffects ? "#00CED1" : "#525162" }}
                  aria-pressed={soundEffects}
                >
                  <div
                    className="w-[20px] h-[20px] rounded-full bg-white absolute top-[2px] transition-all"
                    style={{ left: soundEffects ? "22px" : "2px" }}
                  />
                </button>
              </div>

              <div className="border-t border-white/5" />

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#111023] flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>Microphone</p>
                    <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                      Use microphone to interact with AI Instructor
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <span style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Requires parent approval. Audio is not stored.</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMicrophoneEnabled(!microphoneEnabled)}
                  className="w-[44px] h-[24px] rounded-full relative cursor-pointer transition-colors flex-shrink-0"
                  style={{ backgroundColor: microphoneEnabled ? "#00CED1" : "#525162" }}
                  aria-pressed={microphoneEnabled}
                >
                  <div
                    className="w-[20px] h-[20px] rounded-full bg-white absolute top-[2px] transition-all"
                    style={{ left: microphoneEnabled ? "22px" : "2px" }}
                  />
                </button>
              </div>
            </div>

            <div className="rounded-[16px] p-5 mt-4" style={{ backgroundColor: "#313044" }}>
              <OnboardingResultsPanel
                mode={{ portal: "child" }}
                emptyMessage="Complete your onboarding assessment to see results here."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
