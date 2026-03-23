"use client";

import Link from "next/link";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const allBadges = [
  { name: "Wildfire", desc: "Reading Consistency", progress: 2, total: 5 },
  { name: "Sage", desc: "Vocabulary Mastery", progress: 2, total: 5 },
  { name: "Champion", desc: "Writing practice", progress: 2, total: 3 },
  { name: "Champion", desc: "Writing practice", progress: 2, total: 5 },
  { name: "Wildfire", desc: "Reading Consistency", progress: 2, total: 3 },
  { name: "Sage", desc: "Vocabulary Mastery", progress: 2, total: 5 },
  { name: "Champion", desc: "Writing practice", progress: 2, total: 3 },
  { name: "Champion", desc: "Writing practice", progress: 2, total: 5 },
];

export default function BadgesPage() {
  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/child-dashboard/profile" className="text-white/60 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
            Badges
          </h1>
        </div>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allBadges.map((badge, i) => (
          <div key={i} className="rounded-[12px] px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#313044" }}>
            <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5-3-1 1.5-4M12 15l2 5 3-1-1.5-4M6 9a6 6 0 1012 0 6 6 0 00-12 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>{badge.name}</span>
                <span style={{ ...inter, fontWeight: 700, fontSize: "13px", color: "#00CED1" }}>{badge.progress}/{badge.total}</span>
              </div>
              <div className="w-full h-[4px] bg-[#525162] rounded-full overflow-hidden mb-1">
                <div className="h-full bg-[#00CED1] rounded-full" style={{ width: `${(badge.progress / badge.total) * 100}%` }} />
              </div>
              <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
