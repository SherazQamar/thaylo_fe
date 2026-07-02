"use client";

import Link from "next/link";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import StudentProgressOverview from "@/components/shared/StudentProgressOverview";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function StudentDetailsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/students" className="text-white/60 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1
            className="uppercase"
            style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
          >
            Student Details
          </h1>
        </div>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <StudentProgressOverview
        displayName="Fatima"
        gradeLabel="Grade 4"
        messagesHref="/dashboard/message"
        showRiskBadge
      />
    </div>
  );
}
