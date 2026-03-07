"use client";

import Image from "next/image";

const stats = [
  { label: "Mastery Trend", value: "Improving", change: "+11.01%", positive: true },
  { label: "Time this week", value: "42 min", change: "-2%", positive: false },
  { label: "Sel Summary", value: "Amber", change: "+11.01%", positive: true },
];

const students = [
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    focus: "Focus: Inference",
    confidence: "Medium",
    confidenceColor: "bg-[#F59E0B]",
  },
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    focus: "Focus: Inference",
    confidence: "low",
    confidenceColor: "bg-[#EF4444]",
  },
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    focus: "Focus: Inference",
    confidence: "Medium",
    confidenceColor: "bg-[#F59E0B]",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-xl lg:text-2xl font-bold text-white uppercase tracking-wide"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Wayfinder Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center overflow-hidden">
            <Image
              src="/assets/wayfinder Em.png"
              alt="Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p
              className="text-sm font-semibold text-white leading-tight"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Alex Filler
            </p>
            <p
              className="text-xs text-white/50"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Wayfinder
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-[24px] px-6 py-[10px] h-[72px]"
            style={{ backgroundColor: "#525162" }}
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00CED1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] text-white/50 leading-tight"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {stat.label}
              </p>
              <p
                className="text-base font-semibold text-white leading-tight"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {stat.value}
              </p>
            </div>
            {/* Change */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span
                className={`text-xs font-medium ${
                  stat.positive ? "text-[#00CED1]" : "text-[#EF4444]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {stat.change}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={stat.positive ? "#00CED1" : "#EF4444"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {stat.positive ? (
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                ) : (
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                )}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="rounded-[12px] p-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Student List
          </h2>
          <button
            className="text-[13px] font-semibold text-[#00CED1] uppercase tracking-wider cursor-pointer hover:text-[#00B8BB] transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            View All
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {students.map((student, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr_auto] items-center rounded-[12px] px-6 py-[17px] gap-6"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              {/* Student Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src="/assets/wayfinder Em.png"
                    alt={student.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p
                    className="text-[15px] font-semibold text-white leading-tight"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {student.name}
                  </p>
                  <p
                    className="text-xs text-white/40 mt-0.5"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {student.grade}
                  </p>
                </div>
              </div>

              {/* Plant Stage */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#313044] border border-[#00CED1]/30 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00CED1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22V8" />
                    <path d="M5 12H2a10 10 0 0020 0h-3" />
                    <path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-[20px] font-semibold text-white leading-[28px]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {student.plantStage}
                  </p>
                  <p
                    className="text-xs text-[#00CED1] mt-0.5"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {student.mastered}
                  </p>
                </div>
              </div>

              {/* Focus */}
              <div className="rounded-[12px] px-5 py-3 bg-[#525162]">
                <p
                  className="text-[15px] font-semibold text-white leading-tight"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {student.focus}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="text-xs text-white/50"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Confidence
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white ${student.confidenceColor}`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {student.confidence}
                  </span>
                </div>
              </div>

              {/* Open Chat */}
              <button
                className="text-[13px] font-semibold text-[#00CED1] uppercase tracking-wider flex-shrink-0 cursor-pointer hover:text-[#00B8BB] transition-colors whitespace-nowrap"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Open Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
