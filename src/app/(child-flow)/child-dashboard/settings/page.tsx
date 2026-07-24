"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AvatarPicker from "@/components/shared/AvatarPicker";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
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

function splitDisplayName(
  child: {
    firstName?: string | null;
    secondName?: string | null;
    userName?: string | null;
  } | null,
): { firstName: string; lastName: string } {
  const fromFields = {
    firstName: child?.firstName?.trim() || "",
    lastName: child?.secondName?.trim() || "",
  };
  if (fromFields.firstName || fromFields.lastName) {
    return {
      firstName: fromFields.firstName || "—",
      lastName: fromFields.lastName || "—",
    };
  }

  const trimmed = child?.userName?.trim();
  if (!trimmed) return { firstName: "—", lastName: "—" };

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "—" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function FieldInput({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="w-full">
      <label
        style={{
          ...inter,
          fontWeight: 500,
          fontSize: "16px",
          color: "#FFFFFF",
          display: "block",
          marginBottom: "10px",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled
        readOnly
        tabIndex={-1}
        aria-disabled="true"
        className="w-full rounded-full px-7 py-[18px] outline-none text-white/70 cursor-default pointer-events-none select-none caret-transparent"
        style={{
          backgroundColor: "#313044",
          border: "1px solid rgba(0,206,209,0.55)",
          ...inter,
          fontSize: "16px",
          opacity: 1,
          WebkitTextFillColor: "rgba(255,255,255,0.7)",
        }}
      />
    </div>
  );
}

function PreferenceToggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative w-[46px] h-[28px] flex-shrink-0 cursor-pointer rounded-full transition-colors"
      style={{ backgroundColor: on ? "#00CED1" : "#525162" }}
      aria-pressed={on}
      aria-label={label}
    >
      <span
        className="absolute top-[3px] block size-[22px] rounded-full bg-white shadow-sm transition-all"
        style={{ left: on ? "21px" : "3px" }}
      />
    </button>
  );
}

function SoundIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="white" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
      <path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}

function SpeakingIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="7.5" r="3" fill="white" stroke="white" />
      <path d="M3.5 19c.5-3.4 2.7-5.2 5.5-5.2S14 15.6 14.5 19" />
      <path d="M16.2 8v3.2" />
      <path d="M18.6 6.6v6" />
      <path d="M21 8v3.2" />
    </svg>
  );
}

export default function ChildSettingsPage() {
  const child = useChildAuthStore((state) => state.child);
  const setChild = useChildAuthStore((state) => state.setChild);
  const [activeTab, setActiveTab] = useState<"general" | "preferences">("general");
  const [soundEffects, setSoundEffects] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dailyMinutes, setDailyMinutes] = useState("");
  const [goalsError, setGoalsError] = useState<string | null>(null);
  const [goalsSaved, setGoalsSaved] = useState(false);

  const displayName = child?.userName?.trim() || "Student";
  const { firstName, lastName } = splitDisplayName(child);
  const gradeLabel = formatChildGrade(child?.grade);
  const subtitle = `@${displayName.replace(/\s+/g, "")}`;

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
    <div className="px-6 md:p-5 lg:p-6 pt-2 md:pt-5 pb-6 overflow-y-auto scrollbar-hide h-full">
      <div className="hidden md:flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <h1
            className="uppercase"
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "22px",
              letterSpacing: "0.8px",
              color: "#DCE6EC",
            }}
          >
            Settings
          </h1>
          <ChildUserDropdown />
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/child-dashboard", label: "Student Dashboard" },
            { href: "/child-dashboard/settings", label: "Settings" },
          ]}
        />
      </div>

      {/* Tabs — Figma underline */}
      <div className="relative flex gap-6 mb-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`relative pb-3 cursor-pointer transition-colors ${
            activeTab === "general" ? "text-[#00CED1]" : "text-white"
          }`}
          style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "20px" }}
        >
          General Settings
          {activeTab === "general" && (
            <span className="absolute left-0 right-0 -bottom-px h-[2.5px] bg-[#00CED1]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`relative pb-3 cursor-pointer transition-colors ${
            activeTab === "preferences" ? "text-[#00CED1]" : "text-white"
          }`}
          style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "20px" }}
        >
          Learning Preferences
          {activeTab === "preferences" && (
            <span className="absolute left-0 right-0 -bottom-px h-[2.5px] bg-[#00CED1]" />
          )}
        </button>
      </div>

      {/* Shared page title — Figma keeps this on both tabs */}
      <div className="mb-5">
        <h2
          style={{
            ...inter,
            fontWeight: 600,
            fontSize: "23px",
            lineHeight: "29px",
            color: "#FFFFFF",
            marginBottom: "12px",
          }}
        >
          General Settings
        </h2>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "20px",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Customize your daily goals, difficulty settings, and study focus.
        </p>
      </div>

      {activeTab === "general" ? (
        <>
          {/* Profile + Upload Photo */}
          <div
            className="rounded-[22px] md:rounded-[16px] px-5 py-7 md:p-6 mb-5"
            style={{ backgroundColor: "#313044" }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-8">
              <AvatarPicker
                mode="child"
                displayName={displayName}
                currentAvatarUrl={child?.avatarUrl}
                size={100}
                open={avatarOpen}
                onOpenChange={setAvatarOpen}
                onAvatarSaved={(avatarUrl, avatarKey) => {
                  if (!child) return;
                  setChild({ ...child, avatarUrl, avatarKey });
                }}
              />
              <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-[280px] md:max-w-none">
                <p
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: "23px",
                    lineHeight: "32px",
                    color: "#FFFFFF",
                  }}
                >
                  {displayName}
                </p>
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.55)",
                    marginTop: "6px",
                  }}
                >
                  {subtitle}
                </p>
                <button
                  type="button"
                  onClick={() => setAvatarOpen(true)}
                  className="mt-5 rounded-full h-[47px] px-10 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "transparent",
                    border: "1.5px solid #00CED1",
                    ...inter,
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#FFFFFF",
                  }}
                >
                  Upload Photo
                </button>
              </div>
            </div>
          </div>

          {/* Class schedule goals — keep + Figma-aligned chrome */}
          <div
            className="rounded-[22px] md:rounded-[16px] p-5 md:p-6 mb-5"
            style={{ backgroundColor: "#313044" }}
          >
            <h3
              style={{
                ...inter,
                fontWeight: 600,
                fontSize: "18px",
                color: "#FFFFFF",
                marginBottom: "6px",
              }}
            >
              Class schedule goals
            </h3>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "13px",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "18px",
                lineHeight: "20px",
              }}
            >
              Choose the days and daily minutes you want to be in class. These
              goals can help unlock badges later.
            </p>

            <p
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "14px",
                color: "#FFFFFF",
                marginBottom: "12px",
              }}
            >
              Days in class
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {CLASS_GOAL_DAY_OPTIONS.map((day) => {
                const selected = selectedDays.includes(day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className="min-w-[48px] rounded-full px-3.5 py-2.5 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: selected
                        ? "rgba(0,206,209,0.22)"
                        : "rgba(17,16,35,0.45)",
                      border: selected
                        ? "1px solid #00CED1"
                        : "1px solid rgba(255,255,255,0.12)",
                      ...inter,
                      fontWeight: 600,
                      fontSize: "13px",
                      color: selected ? "#00CED1" : "rgba(255,255,255,0.75)",
                    }}
                    aria-pressed={selected}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            <label
              htmlFor="daily-minutes-goal"
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "14px",
                color: "#FFFFFF",
                display: "block",
                marginBottom: "10px",
              }}
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
                className="w-full sm:w-[160px] rounded-full px-6 py-3.5 outline-none text-white"
                style={{
                  backgroundColor: "#313044",
                  border: "1px solid rgba(0,206,209,0.55)",
                  ...inter,
                  fontSize: "15px",
                }}
              />
              <span
                style={{
                  ...inter,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                minutes per day
              </span>
            </div>

            {goalsError && (
              <p className="text-sm text-red-400 mb-3" role="alert" style={inter}>
                {goalsError}
              </p>
            )}
            {goalsSaved && !goalsError && (
              <p
                className="mb-3"
                style={{ ...inter, fontSize: "13px", color: "#22C55E" }}
              >
                Class goals saved.
              </p>
            )}

            <button
              type="button"
              onClick={handleSaveGoals}
              disabled={goalsMutation.isPending}
              className="w-full sm:w-auto rounded-full px-6 py-3 cursor-pointer hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "#00CED1",
                ...inter,
                fontWeight: 600,
                fontSize: "15px",
                color: "#111023",
              }}
            >
              {goalsMutation.isPending ? "Saving…" : "Save goals"}
            </button>
          </div>

          {/* Personal Information */}
          <div>
            <h3
              style={{
                ...inter,
                fontWeight: 600,
                fontSize: "20px",
                color: "#FFFFFF",
                marginBottom: "10px",
              }}
            >
              Personal Information
            </h3>
            <div
              className="flex items-center gap-2 mb-5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <LockIcon size={16} />
              <span style={{ ...inter, fontWeight: 400, fontSize: "13px" }}>
                Managed by parent
              </span>
            </div>

            <div className="border-t border-white/10 pt-5 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldInput label="First Name" value={firstName} />
                <FieldInput label="Last Name" value={lastName} />
              </div>
              <FieldInput label="Username" value={displayName} />
              <FieldInput label="Grade" value={gradeLabel} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Learning Preferences — exact Figma match */}
          <div>
            <h3
              style={{
                ...inter,
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "24px",
                color: "#FFFFFF",
                marginBottom: "20px",
              }}
            >
              Preferences
            </h3>

            <div
              className="flex items-center gap-3 rounded-[10px] px-4 py-[15px] mb-5 w-full"
              style={{
                backgroundColor: "#313044",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <span className="flex-shrink-0 opacity-70">
                <LockIcon size={18} />
              </span>
              <span
                style={{
                  ...inter,
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "16px",
                  color: "#FFFFFF",
                }}
              >
                Some settings are managed by parents
              </span>
            </div>

            <div
              className="rounded-[16px] px-3 py-7"
              style={{ backgroundColor: "#313044" }}
            >
              {/* Sound Effects */}
              <div className="flex items-center gap-3 px-2">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    className="size-[48px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#00CED1" }}
                  >
                    <SoundIcon />
                  </div>
                  <div className="min-w-0">
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: "19px",
                        color: "#FFFFFF",
                      }}
                    >
                      Sound Effects
                    </p>
                    <p
                      style={{
                        ...inter,
                        fontWeight: 400,
                        fontSize: "13px",
                        lineHeight: "18px",
                        color: "rgba(255,255,255,0.55)",
                        marginTop: "8px",
                      }}
                    >
                      Play sounds for correct answers and streaks.
                    </p>
                  </div>
                </div>
                <PreferenceToggle
                  on={soundEffects}
                  onToggle={() => setSoundEffects(!soundEffects)}
                  label="Toggle sound effects"
                />
              </div>

              <div
                className="my-5 ml-[72px] mr-2 h-px"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              />

              {/* Speaking Exercises */}
              <div className="flex items-start gap-3 px-2">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div
                    className="size-[48px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#00CED1" }}
                  >
                    <SpeakingIcon />
                  </div>
                  <div className="min-w-0">
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: "19px",
                        color: "#FFFFFF",
                      }}
                    >
                      Speaking Exercises
                    </p>
                    <p
                      style={{
                        ...inter,
                        fontWeight: 400,
                        fontSize: "13px",
                        lineHeight: "18px",
                        color: "rgba(255,255,255,0.55)",
                        marginTop: "8px",
                      }}
                    >
                      Use microphone for pronunciation practice
                    </p>
                    <div
                      className="flex items-start gap-2 mt-2.5"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      <span className="mt-0.5 flex-shrink-0">
                        <LockIcon size={16} />
                      </span>
                      <span
                        style={{
                          ...inter,
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "16px",
                        }}
                      >
                        Requires parent approval. Audio is not stored.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 flex-shrink-0">
                  <PreferenceToggle
                    on={microphoneEnabled}
                    onToggle={() => setMicrophoneEnabled(!microphoneEnabled)}
                    label="Toggle speaking exercises"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
