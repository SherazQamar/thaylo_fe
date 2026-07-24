"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import InfoTooltip from "@/components/shared/InfoTooltip";
import {
  fetchParentDashboardStats,
  type ParentDashboardMasteryBar,
  type ParentDashboardChildMastery,
  type ParentDashboardChildSel,
  type ParentDashboardWeeklyTime,
} from "@/lib/parent-api";
import { PARENT_DASHBOARD_HINTS } from "@/lib/portal-help-text";
import { withAddChildWizardMode } from "@/lib/parent-registration";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const BAR_COLORS = ["#00CED1", "#EC4899", "#22C55E", "#F59E0B", "#8B5CF6"];
const ZERO_BAR_COLOR = "#858C94";

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function childInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function confidenceBadgeColor(confidence: string): string {
  const normalized = confidence.toLowerCase();
  if (normalized === "high") return "bg-[#22C55E]";
  if (normalized === "medium") return "bg-[#F59E0B]";
  if (normalized === "building" || normalized === "low") return "bg-[#EF4444]";
  return "bg-[#858C94]";
}

function barColor(index: number, percent: number): string {
  if (percent <= 0) return ZERO_BAR_COLOR;
  return BAR_COLORS[index % BAR_COLORS.length];
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: dashboardStats } = useQuery({
    queryKey: ["parent-dashboard-stats"],
    queryFn: fetchParentDashboardStats,
  });

  const greetingName = user?.name?.trim() || "Parent";
  const progressBars = dashboardStats?.masteryProgressBars ?? [];
  const childrenSel = dashboardStats?.childrenSel ?? [];
  const masteryStudents = dashboardStats?.childrenMastery ?? [];
  const childCount = masteryStudents.length;
  const activeTodayNames = dashboardStats?.activeTodayNames ?? [];
  const weeklyTimeByChild = dashboardStats?.weeklyTimeByChild ?? [];
  const masteredSkills = dashboardStats?.masteredSkills ?? 0;

  function handleAddChild() {
    router.push(withAddChildWizardMode("/parent-register/step-2"));
  }

  const subtitle =
    childCount === 0
      ? "Add a child to see their learning overview."
      : childCount === 1
        ? `Here is how ${masteryStudents[0]?.userName ?? "your child"} is doing today.`
        : "Here is how your children are doing today.";

  return (
    <div className="px-6 py-4 md:p-6 lg:p-10">
      <div className="hidden md:flex items-center justify-between mb-3">
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
          Parent Dashboard
        </h1>
        <ParentUserDropdown />
      </div>

      <Breadcrumbs
        showHome={false}
        items={[{ href: "/parent-dashboard", label: "Parent Dashboard" }]}
      />

      {/* Figma mobile: Hello + subtitle + full-width Add Child */}
      <div className="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2
            className="text-[32px] leading-10 md:text-[22px] md:leading-[30px]"
            style={{
              ...inter,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Hello, {greetingName}
          </h2>
          <p
            className="mt-1.5 md:mt-1 text-[14px] leading-6 md:leading-[22px]"
            style={{
              ...inter,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddChild}
          className="w-full md:w-auto shrink-0 rounded-full h-12 md:h-auto px-5 py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#111023",
          }}
        >
          Add Child
        </button>
      </div>

      {/* Figma mobile: stacked 327×88 summary rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-10">
        <SummaryCard
          label="Active Today"
          value={
            activeTodayNames.length > 0 ? activeTodayNames.join(", ") : "—"
          }
          compact={activeTodayNames.length > 1}
          hint={PARENT_DASHBOARD_HINTS.activeToday}
        />
        <WeeklyTimeCard rows={weeklyTimeByChild} />
        <SummaryCard
          label="Mastered Skills"
          value={dashboardStats != null ? String(masteredSkills) : "—"}
          hint={PARENT_DASHBOARD_HINTS.masteredSkills}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 md:mb-8">
        <MasteryOfAttemptedCard bars={progressBars} />
        <SelOverviewCard rows={childrenSel} />
      </div>

      <MasteryListSection students={masteryStudents} />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  compact,
  hint,
}: {
  label: string;
  value: string;
  compact?: boolean;
  hint?: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-[24px] px-5 md:px-6 py-4 md:py-[10px] min-h-[88px] md:min-h-[72px]"
      style={{ backgroundColor: "#525162" }}
    >
      <PaperPlaneIcon />
      <div className="flex-1 min-w-0">
        <p
          className="flex items-center gap-1.5"
          style={{
            ...inter,
            fontWeight: 500,
            fontSize: "11px",
            lineHeight: "16px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {label}
          {hint ? <InfoTooltip content={hint} align="left" /> : null}
        </p>
        <p
          className="truncate"
          style={{
            ...inter,
            fontWeight: 600,
            fontSize: compact ? "16px" : "20px",
            lineHeight: compact ? "22px" : "28px",
            color: "#00CED1",
          }}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function WeeklyTimeCard({ rows }: { rows: ParentDashboardWeeklyTime[] }) {
  return (
    <div
      className="flex items-start gap-4 rounded-[24px] px-5 md:px-6 py-4 md:py-3 min-h-[88px] md:min-h-[72px]"
      style={{ backgroundColor: "#525162" }}
    >
      <PaperPlaneIcon />
      <div className="flex-1 min-w-0">
        <p
          className="flex items-center gap-1.5"
          style={{
            ...inter,
            fontWeight: 500,
            fontSize: "11px",
            lineHeight: "16px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Avg Weekly Time
          <InfoTooltip content={PARENT_DASHBOARD_HINTS.avgWeeklyTime} align="left" />
        </p>
        {rows.length === 0 ? (
          <p
            style={{
              ...inter,
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "28px",
              color: "#FFFFFF",
            }}
          >
            —
          </p>
        ) : (
          <div className="mt-0.5 flex flex-col gap-0.5">
            {rows.map((row) => (
              <p
                key={row.childId}
                style={{
                  ...inter,
                  fontWeight: 600,
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "#FFFFFF",
                }}
              >
                {row.userName}:{" "}
                <span style={{ color: "#00CED1" }}>{row.label}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaperPlaneIcon() {
  return (
    <div className="w-14 h-14 md:w-10 md:h-10 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00CED1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="md:w-[18px] md:h-[18px] w-5 h-5"
      >
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    </div>
  );
}

function ChildAvatar({ name }: { name: string }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background:
          "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)",
        ...inter,
        fontWeight: 700,
        fontSize: "14px",
        color: "#FFFFFF",
      }}
    >
      {childInitial(name)}
    </div>
  );
}

function MasteryOfAttemptedCard({
  bars,
}: {
  bars: ParentDashboardMasteryBar[];
}) {
  return (
    <div
      className="rounded-[12px] p-5 md:p-6"
      style={{ backgroundColor: "#313044" }}
    >
      <h3
        className="flex items-center gap-2 text-[18px] leading-[22px] md:text-[20px] md:leading-7"
        style={{
          ...inter,
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: "20px",
        }}
      >
        Mastery of Attempted
        <InfoTooltip content={PARENT_DASHBOARD_HINTS.masteryOfAttempted} align="left" />
      </h3>
      <div className="flex flex-col gap-5">
        {bars.length === 0 ? (
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "22px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No children yet. Add a child to see mastery progress.
          </p>
        ) : (
          bars.map((bar, index) => {
            const color = barColor(index, bar.progressPercent);
            return (
              <div key={bar.childId}>
                <div className="flex items-center gap-3 mb-2">
                  <ChildAvatar name={bar.label} />
                  <div className="min-w-0 flex-1">
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "18px",
                        color: "#FFFFFF",
                      }}
                    >
                      {bar.label}
                    </p>
                    <p
                      style={{
                        ...inter,
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#858C94",
                      }}
                    >
                      {formatChildGrade(bar.grade)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "13px",
                        lineHeight: "18px",
                        color: "#FFFFFF",
                      }}
                    >
                      {bar.masteredCount} / {bar.attemptedCount}
                    </p>
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color,
                      }}
                    >
                      {bar.progressPercent}%
                    </p>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#525162]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, bar.progressPercent)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SelMoodPill({
  emoji,
  label,
  count,
  color,
  bg,
}: {
  emoji: string;
  label: string;
  count: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-full px-2 py-2 min-w-[64px]"
      style={{ backgroundColor: bg }}
    >
      <span className="text-base leading-none mb-0.5">{emoji}</span>
      <span
        style={{
          ...inter,
          fontWeight: 600,
          fontSize: "10px",
          lineHeight: "12px",
          color,
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...inter,
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: "18px",
          color: "#FFFFFF",
        }}
      >
        {count}
      </span>
    </div>
  );
}

function SelOverviewCard({ rows }: { rows: ParentDashboardChildSel[] }) {
  return (
    <div
      className="rounded-[12px] p-5 md:p-6"
      style={{ backgroundColor: "#313044" }}
    >
      <h3
        className="flex items-center gap-2 text-[18px] leading-[22px] md:text-[20px] md:leading-7"
        style={{
          ...inter,
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: "20px",
        }}
      >
        SEL Overview
        <InfoTooltip content={PARENT_DASHBOARD_HINTS.selOverview} align="left" />
      </h3>
      <div className="flex flex-col gap-4">
        {rows.length === 0 ? (
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "22px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No children yet. SEL check-ins will appear here.
          </p>
        ) : (
          rows.map((row) => (
            <div
              key={row.childId}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 sm:w-[140px]">
                <ChildAvatar name={row.userName} />
                <div className="min-w-0">
                  <p
                    style={{
                      ...inter,
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    {row.userName}
                  </p>
                  <p
                    style={{
                      ...inter,
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#858C94",
                    }}
                  >
                    {formatChildGrade(row.grade)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <SelMoodPill
                  emoji="😊"
                  label="Happy"
                  count={row.happyCount}
                  color="#22C55E"
                  bg="rgba(34,197,94,0.2)"
                />
                <SelMoodPill
                  emoji="😕"
                  label="Confuse"
                  count={row.confusedCount}
                  color="#F59E0B"
                  bg="rgba(245,158,11,0.2)"
                />
                <SelMoodPill
                  emoji="😢"
                  label="Sad"
                  count={row.sadCount}
                  color="#00CED1"
                  bg="rgba(0,206,209,0.2)"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MasteryListSection({
  students,
}: {
  students: ParentDashboardChildMastery[];
}) {
  return (
    <div
      className="rounded-[12px] p-4 md:p-6"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
    >
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h2
          className="flex items-center gap-2 text-[18px] leading-[22px] md:text-[22px] md:leading-[22px]"
          style={{
            ...inter,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          Mastery of Attempted
          <InfoTooltip content={PARENT_DASHBOARD_HINTS.masteryOfAttempted} align="left" />
        </h2>
        <Link
          href="/parent-dashboard/children"
          className="uppercase cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "13.5px",
            lineHeight: "18px",
            letterSpacing: "0.8px",
            color: "#00CED1",
          }}
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:gap-2">
        {students.length === 0 ? (
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
          students.map((student) => (
            <div
              key={student.id}
              className="md:grid md:grid-cols-[minmax(140px,1fr)_minmax(200px,1.4fr)_minmax(160px,1fr)_auto] items-center rounded-[12px] px-4 md:px-5 py-4 md:py-3 gap-3 md:gap-4 hover:bg-white/10 transition-colors flex flex-col"
              style={{ backgroundColor: "#313044" }}
            >
              <div className="flex items-center gap-2.5 w-full">
                <ChildAvatar name={student.userName} />
                <div>
                  <p
                    className="text-[16px] leading-7 md:text-[15px] md:leading-5"
                    style={{
                      ...inter,
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    {student.userName}
                  </p>
                  <p
                    style={{
                      ...inter,
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#858C94",
                    }}
                  >
                    {formatChildGrade(student.grade)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 w-full">
                <div className="w-9 h-9 md:w-9 md:h-9 rounded-full bg-[#313044] border border-[#00CED1]/30 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00CED1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-[16px] leading-7 md:text-[15px] md:leading-5"
                    style={{
                      ...inter,
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    {student.contentArea}
                  </p>
                  <p
                    style={{
                      ...inter,
                      fontWeight: 500,
                      fontSize: "11px",
                      lineHeight: "14px",
                      color: "#00CED1",
                    }}
                  >
                    {student.masteredLabel}
                  </p>
                  <p
                    style={{
                      ...inter,
                      fontWeight: 400,
                      fontSize: "11px",
                      lineHeight: "14px",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {student.attemptedLabel} · {student.remainingLabel}
                  </p>
                </div>
              </div>

              <div
                className="rounded-[20px] w-full"
                style={{ backgroundColor: "#525162", padding: "8px 16px" }}
              >
                <p
                  className="flex items-center gap-1.5"
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Focus
                  <InfoTooltip content={PARENT_DASHBOARD_HINTS.focus} align="left" />
                </p>
                <p
                  className="text-[16px] leading-7 md:text-[15px] md:leading-5"
                  style={{
                    ...inter,
                    fontWeight: 600,
                    color: "#FFFFFF",
                    marginTop: "2px",
                  }}
                >
                  {student.focusArea}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="flex items-center gap-1.5"
                    style={{
                      ...inter,
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#FFFFFF",
                    }}
                  >
                    Confidence
                    <InfoTooltip content={PARENT_DASHBOARD_HINTS.confidence} align="left" />
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${confidenceBadgeColor(student.confidence)}`}
                    style={{
                      ...inter,
                      fontWeight: 500,
                      fontSize: "10px",
                      lineHeight: "10px",
                      color: "#111023",
                    }}
                  >
                    {student.confidence}
                  </span>
                </div>
              </div>

              <Link
                href={`/parent-dashboard/message?childId=${student.id}`}
                className="uppercase flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap self-center md:self-center w-full md:w-auto text-center pt-1 md:pt-0"
                style={{
                  ...inter,
                  fontWeight: 700,
                  fontSize: "13.5px",
                  lineHeight: "18px",
                  letterSpacing: "0.8px",
                  color: "#00CED1",
                }}
              >
                Open Chat
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
