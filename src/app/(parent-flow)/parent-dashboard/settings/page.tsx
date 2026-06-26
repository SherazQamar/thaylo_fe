"use client";

import { useState } from "react";
import Link from "next/link";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import OnboardingResultsPanel from "@/components/onboarding/OnboardingResultsPanel";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function ParentSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"general" | "preferences">("general");

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <h1
            className="uppercase"
            style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}
          >
            Settings
          </h1>
          <div className="hidden md:block">
            <ParentUserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/parent-dashboard", label: "Parent Dashboard" },
            { href: "/parent-dashboard/settings", label: "Settings" },
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
        <div className="rounded-[16px] p-5" style={{ backgroundColor: "#313044" }}>
          <p style={{ ...inter, fontWeight: 600, fontSize: "16px", color: "#FFFFFF" }}>
            {user?.name?.trim() || "Parent"}
          </p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            {user?.email || "—"}
          </p>
          <Link
            href="/parent-dashboard/profile"
            className="inline-block mt-4 rounded-full px-5 py-2 text-sm font-semibold bg-[#00CED1] text-[#111023] hover:bg-[#00B8BB] transition-colors"
          >
            Edit profile
          </Link>
        </div>
      ) : (
        <div className="rounded-[16px] p-5" style={{ backgroundColor: "#313044" }}>
          <OnboardingResultsPanel
            mode={{ portal: "parent" }}
            emptyMessage="Complete your parent onboarding assessment to see results here."
          />
        </div>
      )}
    </div>
  );
}
