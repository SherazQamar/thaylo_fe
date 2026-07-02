"use client";

import Image from "next/image";
import Link from "next/link";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const curricularProgress = [
  { label: "Reading", value: 65 },
  { label: "Writing", value: 40 },
  { label: "Vocabulary", value: 80 },
];

const learningSummary = [
  { label: "Current Focus", value: "Reading – Inference" },
  { label: "Confidence Level", value: "Medium" },
  { label: "Engagement", value: "High" },
];

const alerts = [
  {
    tone: "teal" as const,
    text: "Needed reteach twice in inference this week",
  },
  {
    tone: "coral" as const,
    text: "Recommended next step: 10-min evidence practice",
  },
];

const wellbeing = [
  { label: "Positive", count: 3, emoji: "😊" },
  { label: "Neutral", count: 1, emoji: "😐" },
  { label: "Low Mood", count: 0, emoji: "😔" },
];

const badgeAssets = ["/assets/s1.png", "/assets/s2.png", "/assets/s3.png"];

export interface StudentProgressOverviewProps {
  displayName: string;
  gradeLabel: string;
  avatarSrc?: string;
  messagesHref: string;
  showRiskBadge?: boolean;
  progressLabel?: string;
  confidenceLabel?: string;
  gardenStage?: number;
  gardenMessage?: string;
  badgeCount?: number;
}

export default function StudentProgressOverview({
  displayName,
  gradeLabel,
  avatarSrc = "/assets/wayfinder Em.png",
  messagesHref,
  showRiskBadge = false,
  progressLabel = "Growing well",
  confidenceLabel = "Medium",
  gardenStage = 3,
  gardenMessage,
  badgeCount = 4,
}: StudentProgressOverviewProps) {
  const gardenText = gardenMessage ?? `${displayName}'s plant is thriving`;

  return (
    <>
      <div className="rounded-[12px] p-4 md:p-6 mb-6" style={{ backgroundColor: "#313044" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-5">
            <div className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border-2 border-[#525162] flex-shrink-0">
              <Image
                src={avatarSrc}
                alt={displayName}
                width={90}
                height={90}
                className="w-full h-full object-cover"
              />
            </div>
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
                  className="rounded-[30px]"
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
                </span>
                <span
                  className="rounded-[30px]"
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
                  Confidence: {confidenceLabel}
                </span>
                <button
                  type="button"
                  className="rounded-[30px] flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
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
                  Report
                </button>
              </div>
            </div>
          </div>
          {showRiskBadge && (
            <span
              className="rounded-[30px] border border-[#F59E0B] flex-shrink-0 self-center md:self-auto"
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#F59E0B",
                padding: "8px 18px",
              }}
            >
              Risk: Amber
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="flex flex-col gap-4">
          <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "20px" }}>
              Curricular Progress
            </h3>
            <div className="flex flex-col gap-5">
              {curricularProgress.map((skill) => (
                <div key={skill.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.7)" }}>
                      {skill.label}
                    </span>
                    <span style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#00CED1" }}>
                      {skill.value}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#525162]">
                    <div className="h-full rounded-full bg-[#00CED1]" style={{ width: `${skill.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "12px" }}>
              Learning Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {learningSummary.map((item) => (
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
            <div className="flex flex-col sm:flex-row gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert.text}
                  className="flex items-center gap-3 flex-1"
                  style={{
                    backgroundColor: alert.tone === "teal" ? "rgba(0,206,209,0.08)" : "rgba(255,111,111,0.08)",
                    border: `1px solid ${alert.tone === "teal" ? "#00CED1" : "#FF6F6F"}`,
                    borderRadius: "47px",
                    padding: "10px 16px",
                    minHeight: "64px",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: alert.tone === "teal" ? "#00CED1" : "#FF6F6F" }}
                  >
                    {alert.tone === "teal" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 12h6" />
                      </svg>
                    )}
                  </div>
                  <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "18px", color: "#FFFFFF" }}>
                    {alert.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] p-4 md:p-5" style={{ backgroundColor: "#313044" }}>
            <h3 style={{ ...inter, fontWeight: 600, fontSize: "18px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "12px" }}>
              Wellbeing Snapshot
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {wellbeing.map((item) => (
                <div key={item.label} className="rounded-[12px] p-3 flex items-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.7)" }}>
                      {item.label}
                    </p>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>
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
            <h3 style={{ ...inter, fontWeight: 600, fontSize: "18px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "12px" }}>
              Growth Garden
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
            <div className="flex items-center gap-2 mt-3">
              {badgeAssets.map((src) => (
                <div key={src} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#525162" }}>
                  <Image src={src} alt="badge" width={19} height={19} className="w-[19px] h-[19px] object-contain" unoptimized />
                </div>
              ))}
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#525162" }}>
                <span style={{ ...inter, fontWeight: 500, fontSize: "16px", lineHeight: "100%", color: "#00CED1" }}>+1</span>
              </div>
            </div>
            <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "16px", color: "rgba(255,255,255,0.5)", marginTop: "6px" }}>
              {badgeCount} Badges Earned
            </p>
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
              <div className="flex items-center gap-3 rounded-[12px] p-3" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-2xl">🔔</span>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>Wayfinder sent note</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
