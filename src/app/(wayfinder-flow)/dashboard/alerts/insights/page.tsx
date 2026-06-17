"use client";

import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const FILTERS = [
  "Date Range: Last 7 Days",
  "Alert Type: All",
  "Grade: All",
  "Status: Active",
];

const STATS = [
  { label: "Active Alerts", value: "42", delta: "+8%", bar: "#FFC542", width: "65%" },
  { label: "Resolved", value: "128", delta: "+12%", bar: "#00CED1", width: "85%" },
  { label: "Avg Response Time", value: "6 hrs", delta: "+18%", bar: "#FF7B7B", width: "55%" },
  { label: "Escalations", value: "8", delta: "+8%", bar: "#60D624", width: "40%" },
];

const INSIGHTS = [
  {
    name: "Fatima (G4)",
    badge: "Engagement Drop Observed",
    badgeColor: "#FFC542",
    accent: "#FFC542",
    desc: "Fatima's interaction with digital math modules has decreased by 40% over the last 3 days. Usually highly active in morning sessions.",
    actions: ["Acknowledge", "Add Note"],
    avatarBg: "linear-gradient(135deg,#8B5CF6,#EC4899)",
    time: "2h ago",
  },
  {
    name: "Ali (G2)",
    badge: "Potential Learning Struggle",
    badgeColor: "#FF6F6F",
    accent: "#FF6F6F",
    desc: "Multiple attempts detected on 'Reading Comprehension: Unit 4'. Consistent difficulty with inferential questions noted.",
    actions: ["Assign Support", "Flag for Counselor"],
    avatarBg: "linear-gradient(135deg,#F59E0B,#EC4899)",
    time: "5h ago",
  },
];

const RECOMMENDED = [
  { title: "Review G4 Math Pace", sub: "3 students flagging for drop in activity" },
  { title: "Peer Support Group", sub: "Identify students for Reading buddies" },
];

function StatCard({
  label,
  value,
  delta,
  bar,
  width,
}: {
  label: string;
  value: string;
  delta: string;
  bar: string;
  width: string;
}) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
      <p className="text-white/60 text-xs">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-white text-3xl font-bold leading-none">{value}</span>
        <span className="text-[#60D624] text-xs font-semibold">{delta}</span>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width, backgroundColor: bar }} />
      </div>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/5 pl-4 pr-3 py-2 text-white/80 text-sm hover:bg-white/[0.1] cursor-pointer"
    >
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

function InsightCard({
  insight,
}: {
  insight: (typeof INSIGHTS)[number];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ backgroundColor: "#313044" }}>
      <span className="absolute left-0 top-0 bottom-0" style={{ width: "4px", backgroundColor: insight.accent }} />
      <div className="p-5 pl-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full shrink-0" style={{ background: insight.avatarBg }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white text-base font-semibold leading-tight">{insight.name}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: insight.badgeColor }}>
                  {insight.badge}
                </p>
              </div>
              <span className="text-white/50 text-xs rounded-full bg-white/[0.06] px-2.5 py-1 shrink-0">
                {insight.time}
              </span>
            </div>
            <p className="text-white/60 text-sm mt-2 leading-relaxed">{insight.desc}</p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button
                type="button"
                className="rounded-full bg-[#00CED1] hover:bg-[#00B8BB] text-[#111023] text-xs font-semibold px-4 py-1.5 transition-colors cursor-pointer"
              >
                {insight.actions[0]}
              </button>
              <button
                type="button"
                className="rounded-full border border-[#00CED1] text-[#00CED1] hover:bg-[#00CED1]/10 text-xs font-semibold px-4 py-1.5 transition-colors cursor-pointer"
              >
                {insight.actions[1]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertDistribution() {
  const segments = [
    { v: 40, color: "#FFC542" },
    { v: 35, color: "#FF7B7B" },
    { v: 25, color: "#00CED1" },
  ];
  const R = 50;
  const C = 2 * Math.PI * R;
  const GAP = 6;
  let offset = 0;

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
      <p className="text-white text-sm font-semibold">Alert Distribution</p>
      <div className="flex items-center justify-center mt-2">
        <div className="relative w-[200px] h-[200px]">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            {segments.map((segment, index) => {
              const dash = (segment.v / 100) * C - GAP;
              const circle = (
                <circle
                  key={index}
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="14"
                  strokeDasharray={`${dash} ${C - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
              offset += dash + GAP;
              return circle;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-2xl font-bold leading-none">178</span>
            <span className="text-white/50 text-[10px] uppercase tracking-wider mt-1">Total</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-xs">
        <span className="flex items-center gap-2 text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC542]" />
          Engagement <span className="text-white/50 ml-auto">40%</span>
        </span>
        <span className="flex items-center gap-2 text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7B7B]" />
          Learning <span className="text-white/50 ml-auto">35%</span>
        </span>
        <span className="flex items-center gap-2 text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00CED1]" />
          SEL <span className="text-white/50 ml-auto">25%</span>
        </span>
      </div>
    </div>
  );
}

export default function AlertInsightsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Alert Insights
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Wayfinder Dashboard" },
          { href: "/dashboard/alerts", label: "Alerts Center" },
          { href: "/dashboard/alerts/insights", label: "Insights" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6">
        <div className="space-y-2">
          <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Alerts Center</h2>
          <p className="text-white/50 text-sm">Supporting students through timely insights</p>
        </div>
        <button
          type="button"
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-[#00CED1] hover:bg-[#00B8BB] text-[#111023] text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer"
        >
          Resolve all
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {FILTERS.map((filter) => (
          <FilterPill key={filter} label={filter} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mt-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Urgent Insights</h3>
            <button type="button" className="text-[#00CED1] text-sm font-medium hover:underline cursor-pointer">
              View History
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {INSIGHTS.map((insight) => (
              <InsightCard key={insight.name} insight={insight} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <AlertDistribution />
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
            <p className="text-white text-sm font-semibold">Recommended Actions</p>
            <div className="mt-4 flex flex-col gap-3">
              {RECOMMENDED.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#00CED1]/15 border border-[#00CED1]/30 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2">
                      <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium leading-tight">{item.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
            <p className="text-white text-sm font-semibold">Student Load</p>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/70 text-xs">Assigned Students</span>
                <span className="text-white text-xs font-semibold">18 / 25</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-[#00CED1]" style={{ width: "72%" }} />
              </div>
              <p className="text-white/50 text-xs mt-3">Next peak expected in 4 days (Mid-term review)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
