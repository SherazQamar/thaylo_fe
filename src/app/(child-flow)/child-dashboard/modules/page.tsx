"use client";

import { useMemo, useState } from "react";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ContentAreaId = "ela" | "math" | "science" | "social-studies";

type ModuleCard = {
  num: number;
  title: string;
  desc: string;
  time: string;
};

type LevelItem = {
  num: number;
  title: string;
  desc: string;
  status: "completed" | "not-mastered";
};

type SubjectProgress = {
  id: ContentAreaId;
  tabLabel: string;
  gradeLabel: string;
  title: string;
  subtitle: string;
  overallProgress: number;
  continueLabel: string;
  completedModules: ModuleCard[];
  currentModule: {
    num: number;
    title: string;
    desc: string;
    progress: number;
    levels: LevelItem[];
  };
  lockedModule: {
    num: number;
    title: string;
    desc: string;
  };
};

const CONTENT_AREAS: SubjectProgress[] = [
  {
    id: "ela",
    tabLabel: "ELA",
    gradeLabel: "GRADE 04",
    title: "English Language Arts",
    subtitle: "Reading, Grammar & Writing",
    overallProgress: 42,
    continueLabel: "Continue Module 3",
    completedModules: [
      {
        num: 1,
        title: "Foundations of Reading",
        desc: "Review short stories, main ideas, and key details.",
        time: "~15 minutes",
      },
      {
        num: 2,
        title: "Grammar Basics",
        desc: "Learn nouns, verbs, adjectives, and sentence structure.",
        time: "~15 minutes",
      },
    ],
    currentModule: {
      num: 3,
      title: "Vocabulary & Word Meaning",
      desc: "Understand word meanings, synonyms, antonyms, and context clues.",
      progress: 60,
      levels: [
        {
          num: 1,
          title: "Word Meanings",
          desc: "Learn new words",
          status: "completed",
        },
        {
          num: 2,
          title: "Assignment",
          desc: "Write your own sentences using new words.",
          status: "not-mastered",
        },
      ],
    },
    lockedModule: {
      num: 4,
      title: "Writing Skills",
      desc: "Practice paragraph writing, creative writing, and opinion sentences.",
    },
  },
  {
    id: "math",
    tabLabel: "Math",
    gradeLabel: "GRADE 04",
    title: "Mathematics",
    subtitle: "Numbers, Operations & Problem Solving",
    overallProgress: 28,
    continueLabel: "Continue Module 2",
    completedModules: [
      {
        num: 1,
        title: "Place Value & Number Sense",
        desc: "Read, write, and compare multi-digit numbers.",
        time: "~15 minutes",
      },
    ],
    currentModule: {
      num: 2,
      title: "Multi-Digit Multiplication",
      desc: "Multiply larger numbers using strategies and standard algorithms.",
      progress: 35,
      levels: [
        {
          num: 1,
          title: "Area Models",
          desc: "Break apart factors to multiply",
          status: "completed",
        },
        {
          num: 2,
          title: "Practice Set",
          desc: "Solve multi-digit multiplication problems.",
          status: "not-mastered",
        },
      ],
    },
    lockedModule: {
      num: 3,
      title: "Division Strategies",
      desc: "Explore equal groups, remainders, and long division steps.",
    },
  },
  {
    id: "science",
    tabLabel: "Science",
    gradeLabel: "GRADE 04",
    title: "Science",
    subtitle: "Earth, Life & Physical Science",
    overallProgress: 18,
    continueLabel: "Continue Module 1",
    completedModules: [],
    currentModule: {
      num: 1,
      title: "Energy & Motion",
      desc: "Explore how energy moves objects and changes forms.",
      progress: 40,
      levels: [
        {
          num: 1,
          title: "Forms of Energy",
          desc: "Identify light, heat, and motion energy",
          status: "completed",
        },
        {
          num: 2,
          title: "Investigation",
          desc: "Observe how force changes motion.",
          status: "not-mastered",
        },
      ],
    },
    lockedModule: {
      num: 2,
      title: "Weather & Climate",
      desc: "Track patterns in weather and how climate affects communities.",
    },
  },
  {
    id: "social-studies",
    tabLabel: "Social Studies",
    gradeLabel: "GRADE 04",
    title: "Social Studies",
    subtitle: "Communities, Geography & Civics",
    overallProgress: 12,
    continueLabel: "Continue Module 1",
    completedModules: [],
    currentModule: {
      num: 1,
      title: "Maps & Regions",
      desc: "Use maps to understand places, regions, and resources.",
      progress: 25,
      levels: [
        {
          num: 1,
          title: "Map Skills",
          desc: "Read legends, scales, and directions",
          status: "completed",
        },
        {
          num: 2,
          title: "Region Study",
          desc: "Compare features of different regions.",
          status: "not-mastered",
        },
      ],
    },
    lockedModule: {
      num: 2,
      title: "Communities & Government",
      desc: "Learn how local communities make decisions and help people.",
    },
  },
];

const STATUS_FILTERS = ["All Modules", "In Progress", "Completed"] as const;

export default function ChildProgressPage() {
  const [activeSubject, setActiveSubject] = useState<ContentAreaId>("ela");
  const [activeFilter, setActiveFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("All Modules");

  const subject = useMemo(
    () =>
      CONTENT_AREAS.find((area) => area.id === activeSubject) ??
      CONTENT_AREAS[0],
    [activeSubject],
  );

  const showCompleted =
    activeFilter === "All Modules" || activeFilter === "Completed";
  const showInProgress =
    activeFilter === "All Modules" || activeFilter === "In Progress";
  const showLocked = activeFilter === "All Modules";

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      <div className="flex flex-col gap-1 mb-5">
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
            Progress
          </h1>
          <div className="hidden md:block">
            <ChildUserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/child-dashboard", label: "Pathway" },
            { href: "/child-dashboard/modules", label: "Progress" },
          ]}
        />
      </div>

      {/* Content area tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CONTENT_AREAS.map((area) => {
          const active = area.id === activeSubject;
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => {
                setActiveSubject(area.id);
                setActiveFilter("All Modules");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                active
                  ? "bg-[#00CED1] text-[#111023]"
                  : "bg-[#313044] text-white/60 hover:text-white"
              }`}
              style={inter}
            >
              {area.tabLabel}
            </button>
          );
        })}
        <button
          type="button"
          disabled
          className="rounded-full px-4 py-2 text-sm font-medium cursor-not-allowed opacity-40"
          style={{
            ...inter,
            backgroundColor: "#313044",
            color: "rgba(255,255,255,0.5)",
          }}
          title="Electives coming soon"
        >
          Electives
        </button>
      </div>

      {/* Hero Card */}
      <div
        className="rounded-[16px] p-6 md:p-8 mb-6"
        style={{ backgroundColor: "#313044" }}
      >
        <span
          className="inline-block rounded-full px-4 py-1 mb-4"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 700,
            fontSize: "12px",
            color: "#111023",
            letterSpacing: "1px",
          }}
        >
          {subject.gradeLabel}
        </span>
        <h2
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: "40px",
            color: "#FFFFFF",
            marginBottom: "6px",
          }}
        >
          {subject.title}
        </h2>
        <p
          style={{
            ...inter,
            fontWeight: 600,
            fontSize: "16px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "20px",
          }}
        >
          {subject.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1 max-w-[300px]">
            <div className="flex items-center justify-between mb-1.5">
              <span
                style={{
                  ...inter,
                  fontWeight: 500,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Overall Progress
              </span>
              <span
                style={{
                  ...inter,
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#00CED1",
                }}
              >
                {subject.overallProgress}%
              </span>
            </div>
            <div className="w-full h-[6px] bg-[#525162] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-[#00CED1] rounded-full"
                style={{ width: `${subject.overallProgress}%` }}
              />
            </div>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              You are doing great. Keep practicing every day.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full px-6 py-3 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            style={{
              backgroundColor: "#00CED1",
              ...inter,
              fontWeight: 700,
              fontSize: "15px",
              color: "#FFFFFF",
            }}
          >
            {subject.continueLabel}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-5 py-2 text-sm font-medium cursor-pointer transition-colors ${
              activeFilter === f
                ? "bg-[#00CED1] text-[#111023]"
                : "bg-[#313044] text-white/60 hover:text-white"
            }`}
            style={inter}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Completed Modules Grid */}
      {showCompleted && subject.completedModules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {subject.completedModules.map((mod) => (
            <div
              key={`${subject.id}-${mod.num}`}
              className="rounded-[16px] p-5"
              style={{ backgroundColor: "#313044" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Module {mod.num}
                </span>
              </div>
              <h3
                style={{
                  ...inter,
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#FFFFFF",
                  marginBottom: "6px",
                }}
              >
                {mod.title}
              </h3>
              <p
                style={{
                  ...inter,
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "16px",
                }}
              >
                {mod.desc}
              </p>
              <div className="flex items-center gap-1.5 mb-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {mod.time}
                </span>
              </div>
              <div className="w-full h-[4px] bg-[#525162] rounded-full overflow-hidden mb-4">
                <div className="h-full w-full bg-[#00CED1] rounded-full" />
              </div>
              <button
                type="button"
                className="w-full rounded-full py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #00CED1",
                  ...inter,
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#FFFFFF",
                }}
              >
                Review Module
              </button>
            </div>
          ))}
        </div>
      )}

      {showCompleted &&
        subject.completedModules.length === 0 &&
        activeFilter === "Completed" && (
          <p
            className="mb-6"
            style={{
              ...inter,
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No completed modules in {subject.tabLabel} yet.
          </p>
        )}

      {/* Current Module */}
      {showInProgress && (
        <div
          className="rounded-[16px] p-5 md:p-6 mb-6"
          style={{ backgroundColor: "#313044" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                style={{
                  ...inter,
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Current Module
              </span>
              <span
                className="rounded-full px-2.5 py-0.5"
                style={{
                  backgroundColor: "#F59E0B",
                  ...inter,
                  fontWeight: 600,
                  fontSize: "10px",
                  color: "#111023",
                }}
              >
                IN PROGRESS
              </span>
            </div>
            <div className="text-right">
              <p
                style={{
                  ...inter,
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#00CED1",
                }}
              >
                {subject.currentModule.progress}%
              </p>
              <p
                style={{
                  ...inter,
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Completed
              </p>
            </div>
          </div>

          <h3
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "20px",
              color: "#FFFFFF",
              marginBottom: "6px",
            }}
          >
            Module {subject.currentModule.num}: {subject.currentModule.title}
          </h3>
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "16px",
            }}
          >
            {subject.currentModule.desc}
          </p>

          <div className="flex flex-col gap-3">
            {subject.currentModule.levels.map((lvl) => (
              <div
                key={lvl.num}
                className="rounded-[12px] px-4 py-3 flex items-center justify-between"
                style={{
                  backgroundColor:
                    lvl.status === "completed"
                      ? "rgba(0,206,209,0.08)"
                      : "rgba(239,68,68,0.06)",
                  border:
                    lvl.status === "completed"
                      ? "1px solid rgba(0,206,209,0.3)"
                      : "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor:
                        lvl.status === "completed"
                          ? "#00CED1"
                          : "rgba(239,68,68,0.15)",
                    }}
                  >
                    {lvl.status === "completed" ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          ...inter,
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "#FFFFFF",
                        }}
                      >
                        Lvl {lvl.num}: {lvl.title}
                      </span>
                      {lvl.status === "not-mastered" && (
                        <span
                          className="rounded-full px-2 py-0.5"
                          style={{
                            backgroundColor: "#EF4444",
                            ...inter,
                            fontWeight: 600,
                            fontSize: "9px",
                            color: "#FFFFFF",
                          }}
                        >
                          Not yet mastered
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        ...inter,
                        fontWeight: 400,
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {lvl.desc}
                    </p>
                  </div>
                </div>
                {lvl.status === "not-mastered" && (
                  <button
                    type="button"
                    className="rounded-[10px] px-5 py-2 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0 ml-3"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      ...inter,
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "#EF4444",
                    }}
                  >
                    Start Again
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Module */}
      {showLocked && (
        <div
          className="rounded-[16px] p-5"
          style={{ backgroundColor: "#313044", opacity: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <span
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Module {subject.lockedModule.num}
            </span>
          </div>
          <h3
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "6px",
            }}
          >
            {subject.lockedModule.title}
          </h3>
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: "18px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {subject.lockedModule.desc}
          </p>
        </div>
      )}
    </div>
  );
}
