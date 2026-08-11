"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BadgePreviewStrip, {
  type BadgePreviewItem,
} from "@/components/shared/BadgePreviewStrip";
import InfoTooltip from "@/components/shared/InfoTooltip";
import PortalAvatar from "@/components/shared/PortalAvatar";
import { SHARED_PROGRESS_HINTS } from "@/lib/portal-help-text";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const FALLBACK_CURRICULAR: CurricularProgressRow[] = [
  { label: "Word & Language Logic", value: 0, mastered: 0, total: 0 },
  { label: "Reading & Observation", value: 0, mastered: 0, total: 0 },
  { label: "Writing", value: 0, mastered: 0, total: 0 },
  { label: "Communication", value: 0, mastered: 0, total: 0 },
  { label: "Research", value: 0, mastered: 0, total: 0 },
  { label: "Perspective", value: 0, mastered: 0, total: 0 },
];

export type GuidanceAlertTone = "teal" | "coral" | "amber";

export type GuidanceAlertItem = {
  id: string;
  tone: GuidanceAlertTone;
  text: string;
  onClick?: () => void;
};

export type CurricularProgressRow = {
  label: string;
  value: number;
  mastered?: number;
  total?: number;
  minutes?: number;
  averageScorePercent?: number | null;
  lessons?: Array<{
    lessonOrder: number;
    lessonKey: string;
    title: string;
    status: "mastered" | "attempted" | "not_started";
    minutes: number;
    averageScorePercent: number | null;
    lastAttemptAt: string | null;
  }>;
};

export type LearningSummaryData = {
  currentFocus: string;
  confidence: string;
  engagement: string;
};

export type WellbeingSnapshotData = {
  positive: number;
  neutral: number;
  lowMood: number;
};

export interface StudentProgressOverviewProps {
  displayName: string;
  gradeLabel: string;
  avatarUrl?: string | null;
  avatarSrc?: string;
  messagesHref: string;
  showRiskBadge?: boolean;
  riskLabel?: "Clear" | "Amber" | "Orange" | "Red";
  riskReason?: string | null;
  progressLabel?: string;
  confidenceLabel?: string;
  gardenStage?: number;
  gardenMessage?: string;
  badgeCount?: number;
  badgePreviews?: BadgePreviewItem[];
  curricularProgress?: CurricularProgressRow[];
  learningSummary?: LearningSummaryData;
  wellbeing?: WellbeingSnapshotData;
  onWayfinderNotesClick?: () => void;
  wayfinderNotesSubtitle?: string;
  onReportClick?: () => void;
  reportBusy?: boolean;
  guidanceAlerts?: GuidanceAlertItem[];
  guidanceLoading?: boolean;
}

const RISK_STYLES: Record<
  "Clear" | "Amber" | "Orange" | "Red",
  { color: string; border: string }
> = {
  Clear: { color: "#00DCAB", border: "#00DCAB" },
  Amber: { color: "#F59E0B", border: "#F59E0B" },
  Orange: { color: "#FB923C", border: "#FB923C" },
  Red: { color: "#FF6F6F", border: "#FF6F6F" },
};

const FALLBACK_ALERTS: GuidanceAlertItem[] = [
  {
    id: "static-0",
    tone: "teal",
    text: "Needed reteach twice in inference this week",
  },
  {
    id: "static-1",
    tone: "coral",
    text: "Recommended next step: 10-min evidence practice",
  },
];

export default function StudentProgressOverview({
  displayName,
  gradeLabel,
  avatarUrl,
  avatarSrc,
  messagesHref,
  showRiskBadge = false,
  riskLabel = "Clear",
  riskReason = null,
  progressLabel = "Growing well",
  confidenceLabel = "Medium",
  gardenStage = 3,
  gardenMessage,
  badgeCount,
  badgePreviews = [],
  curricularProgress,
  learningSummary,
  wellbeing,
  onWayfinderNotesClick,
  wayfinderNotesSubtitle = "Tap to view notes",
  onReportClick,
  reportBusy = false,
  guidanceAlerts,
  guidanceLoading = false,
}: StudentProgressOverviewProps) {
  const gardenText = gardenMessage ?? `${displayName}'s plant is thriving`;
  const resolvedAvatarUrl = avatarUrl ?? avatarSrc ?? null;
  const resolvedAlerts = guidanceAlerts ?? FALLBACK_ALERTS;
  const riskStyle = RISK_STYLES[riskLabel] ?? RISK_STYLES.Clear;
  const riskTooltip = riskReason?.trim()
    ? `${riskReason} — Does not change grades.`
    : SHARED_PROGRESS_HINTS.risk;

  const skillRows = curricularProgress?.length
    ? curricularProgress
    : FALLBACK_CURRICULAR;
  const summary = learningSummary ?? {
    currentFocus: "Word & Language Logic",
    confidence: confidenceLabel,
    engagement: "Building",
  };
  const moodRows = [
    { label: "Positive", count: wellbeing?.positive ?? 0, emoji: "😊" },
    { label: "Neutral", count: wellbeing?.neutral ?? 0, emoji: "😐" },
    { label: "Low Mood", count: wellbeing?.lowMood ?? 0, emoji: "😔" },
  ];
  const learningSummaryCards = [
    { label: "Current Focus", value: summary.currentFocus },
    { label: "Confidence Level", value: summary.confidence },
    { label: "Engagement", value: summary.engagement },
  ];
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);

  return (
    <>
      <div className="rounded-[12px] p-4 md:p-6 mb-6" style={{ backgroundColor: "#313044" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-5">
            <PortalAvatar
              name={displayName}
              avatarUrl={resolvedAvatarUrl}
              size={90}
              useWordInitials
              className="border-2 border-[#525162]"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
                <p style={{ ...inter, fontWeight: 600, fontSize: "20px", lineHeight: "30px", color: "#FFFFFF" }}>
                  {displayName}
                </p>
                <span className="w-2 h-2 rounded-full bg-[#00CED1]" />
                <p style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#00CED1" }}>
                  {gradeLabel}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-center sm:justify-start">
                <span
                  className="rounded-[30px] inline-flex items-center gap-1.5"
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    backgroundColor: "rgba(17,16,35,0.6)",
                    padding: "8px 14px",
                  }}
                >
                  Progress: {progressLabel}
                  <InfoTooltip content={SHARED_PROGRESS_HINTS.progress} align="left" />
                </span>
                <span
                  className="rounded-[30px] inline-flex items-center gap-1.5"
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    backgroundColor: "rgba(17,16,35,0.6)",
                    padding: "8px 14px",
                  }}
                >
                  Confidence: {summary.confidence || confidenceLabel}
                  <InfoTooltip content={SHARED_PROGRESS_HINTS.confidence} align="left" />
                </span>
                <button
                  type="button"
                  onClick={onReportClick}
                  disabled={!onReportClick || reportBusy}
                  data-snapshot-ignore="true"
                  className="rounded-[30px] flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    backgroundColor: "rgba(17,16,35,0.6)",
                    padding: "8px 14px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {reportBusy ? "Downloading…" : "Report"}
                </button>
              </div>
            </div>
          </div>
          {showRiskBadge && (
            <span
              className="rounded-[30px] border flex-shrink-0 self-center md:self-auto inline-flex items-center gap-1.5"
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: riskStyle.color,
                borderColor: riskStyle.border,
                padding: "8px 18px",
              }}
            >
              Risk: {riskLabel}
              <InfoTooltip content={riskTooltip} align="right" />
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="flex flex-col gap-4">
          <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
            <h3
              className="flex items-center gap-2"
              style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "20px" }}
            >
              Curricular Progress
              <InfoTooltip content={SHARED_PROGRESS_HINTS.curricularProgress} align="left" />
            </h3>
            <div className="flex flex-col gap-5">
              {skillRows.map((skill) => {
                const expanded = expandedFamily === skill.label;
                const hasLessons = (skill.lessons?.length ?? 0) > 0;
                const minutes = Math.round(skill.minutes ?? 0);
                const avg =
                  skill.averageScorePercent != null
                    ? `${skill.averageScorePercent}% avg`
                    : "No scores yet";
                return (
                  <div key={skill.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedFamily(expanded ? null : skill.label)
                      }
                      className="w-full text-left cursor-pointer"
                      disabled={!hasLessons}
                    >
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.7)" }}>
                          {skill.label}
                          {hasLessons ? (
                            <span className="ml-2 text-[11px] text-white/35">
                              {expanded ? "▾" : "▸"} standards
                            </span>
                          ) : null}
                        </span>
                        <span
                          style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#00CED1" }}
                          title={
                            skill.total
                              ? `${skill.mastered ?? 0} of ${skill.total} lessons mastered`
                              : undefined
                          }
                        >
                          {skill.value}%
                        </span>
                      </div>
                      <p
                        style={{
                          ...inter,
                          fontWeight: 400,
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.45)",
                          marginBottom: "8px",
                        }}
                      >
                        {minutes}m in lessons · {avg}
                        {skill.total
                          ? ` · ${skill.mastered ?? 0}/${skill.total} mastered`
                          : ""}
                      </p>
                      <div className="w-full h-2 rounded-full bg-[#525162]">
                        <div
                          className="h-full rounded-full bg-[#00CED1] transition-[width]"
                          style={{ width: `${Math.max(0, Math.min(100, skill.value))}%` }}
                        />
                      </div>
                    </button>
                    {expanded && hasLessons ? (
                      <ul className="mt-3 space-y-2 border-l border-white/10 pl-3">
                        {skill.lessons!.map((lesson) => (
                          <li
                            key={lesson.lessonKey}
                            className="flex items-start justify-between gap-2"
                          >
                            <div>
                              <p style={{ ...inter, fontSize: "12px", fontWeight: 600, color: "#FFFFFF" }}>
                                L{lesson.lessonOrder}. {lesson.title}
                              </p>
                              <p style={{ ...inter, fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                                {lesson.status === "mastered"
                                  ? "Mastered"
                                  : lesson.status === "attempted"
                                    ? "In progress"
                                    : "Not started"}
                                {" · "}
                                {Math.round(lesson.minutes)}m
                                {lesson.averageScorePercent != null
                                  ? ` · ${lesson.averageScorePercent}% avg`
                                  : ""}
                              </p>
                            </div>
                            <span
                              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{
                                ...inter,
                                color:
                                  lesson.status === "mastered"
                                    ? "#60D624"
                                    : lesson.status === "attempted"
                                      ? "#F59E0B"
                                      : "rgba(255,255,255,0.4)",
                                backgroundColor: "rgba(255,255,255,0.06)",
                              }}
                            >
                              {lesson.status === "mastered"
                                ? "Done"
                                : lesson.status === "attempted"
                                  ? "Active"
                                  : "Locked"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3
              className="flex items-center gap-2"
              style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "12px" }}
            >
              Learning Summary
              <InfoTooltip content={SHARED_PROGRESS_HINTS.learningSummary} align="left" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {learningSummaryCards.map((item) => (
                <div key={item.label} className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
                  <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>
                    {item.label}
                  </p>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF", marginTop: "4px" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "12px" }}>
              Alerts &amp; Guidance
            </h3>
            {guidanceLoading ? (
              <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                Loading this week’s guidance…
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                {resolvedAlerts.map((alert) => {
                  const accent =
                    alert.tone === "teal"
                      ? "#00CED1"
                      : alert.tone === "amber"
                        ? "#F59E0B"
                        : "#FF6F6F";
                  const bg =
                    alert.tone === "teal"
                      ? "rgba(0,206,209,0.08)"
                      : alert.tone === "amber"
                        ? "rgba(245,158,11,0.10)"
                        : "rgba(255,111,111,0.08)";
                  const clickable = typeof alert.onClick === "function";
                  const icon =
                    alert.tone === "teal" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : alert.tone === "amber" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 12h6" />
                      </svg>
                    );
                  const content = (
                    <>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: accent }}
                      >
                        {icon}
                      </div>
                      <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "18px", color: "#FFFFFF" }}>
                        {alert.text}
                      </p>
                    </>
                  );
                  const style = {
                    backgroundColor: bg,
                    border: `1px solid ${accent}`,
                    borderRadius: "47px",
                    padding: "10px 16px",
                    minHeight: "64px",
                  } as const;

                  if (clickable) {
                    return (
                      <button
                        key={alert.id}
                        type="button"
                        onClick={alert.onClick}
                        className="flex items-center gap-3 flex-1 text-left cursor-pointer hover:opacity-90 transition-opacity"
                        style={style}
                      >
                        {content}
                      </button>
                    );
                  }

                  return (
                    <div key={alert.id} className="flex items-center gap-3 flex-1" style={style}>
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-[12px] p-4 md:p-5" style={{ backgroundColor: "#313044" }}>
            <h3
              className="flex items-center gap-2"
              style={{ ...inter, fontWeight: 600, fontSize: "18px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "12px" }}
            >
              Wellbeing Snapshot
              <InfoTooltip content={SHARED_PROGRESS_HINTS.wellbeingSnapshot} align="left" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {moodRows.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[12px] px-3 py-3 flex items-center gap-3 min-h-[68px] md:min-h-0 md:gap-2 md:p-3"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <span className="text-[28px] md:text-xl leading-none shrink-0">{item.emoji}</span>
                  <div className="min-w-0">
                    <p
                      className="text-[14px] leading-5 md:text-[12px] md:leading-[18px]"
                      style={{ ...inter, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-[18px] leading-6 md:text-[16px] md:leading-[22px]"
                      style={{ ...inter, fontWeight: 600, color: "#FFFFFF" }}
                    >
                      {item.count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[12px] p-5 flex flex-col items-center justify-center" style={{ backgroundColor: "#313044" }}>
            <h3
              className="flex items-center gap-2"
              style={{ ...inter, fontWeight: 600, fontSize: "18px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "12px" }}
            >
              Growth Garden
              <InfoTooltip content={SHARED_PROGRESS_HINTS.growthGarden} align="left" />
            </h3>
            <div className="w-[100px] h-[100px] rounded-full border-4 border-[#525162] flex items-center justify-center mb-3 relative">
              <div
                className="w-[80px] h-[80px] rounded-full border-4 border-[#00CED1] flex items-center justify-center"
                style={{ borderTopColor: "transparent" }}
              >
                <Image src="/assets/s0.png" alt="Plant" width={36} height={36} className="w-9 h-9 object-contain" unoptimized />
              </div>
            </div>
            <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>
              Stage {gardenStage}
            </p>
            <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "#00CED1", marginTop: "4px" }}>
              {gardenText}
            </p>
            <div className="mt-3">
              <BadgePreviewStrip previews={badgePreviews} totalEarned={badgeCount} />
            </div>
          </div>

          <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "28px", color: "#FFFFFF" }}>
                Messages
              </h3>
              <Link
                href={messagesHref}
                className="uppercase cursor-pointer hover:opacity-80 transition-opacity"
                style={{ ...inter, fontWeight: 700, fontSize: "13px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}
              >
                Open Chat
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-[12px] p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-2xl">😊</span>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>Bloom Buddy</p>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>I feel good!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onWayfinderNotesClick}
                disabled={!onWayfinderNotesClick}
                className={`w-full flex items-center gap-3 rounded-[12px] p-3 text-left transition-colors ${
                  onWayfinderNotesClick
                    ? "hover:bg-white/[0.08] cursor-pointer"
                    : "cursor-default opacity-80"
                }`}
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <span className="text-2xl">🔔</span>
                <div className="min-w-0 flex-1">
                  <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>
                    Wayfinder sent note
                  </p>
                  {onWayfinderNotesClick ? (
                    <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
                      {wayfinderNotesSubtitle}
                    </p>
                  ) : null}
                </div>
                {onWayfinderNotesClick ? (
                  <span className="text-[#00CED1] text-xs font-semibold shrink-0">View</span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
