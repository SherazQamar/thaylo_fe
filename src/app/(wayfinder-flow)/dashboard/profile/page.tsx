"use client";

import Image from "next/image";
import UserDropdown from "@/components/wayfinder/UserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const badges = [
  { icon: "📋", label: "Certified: Teacher", color: "#00CED1" },
  { icon: "⭐", label: "7 Years Experience", color: "#00CED1" },
  { icon: "🎓", label: "Master Of Edu - M.Ed", color: "#00CED1" },
];

const details = [
  { label: "Country", value: "Pakistan" },
  { label: "Timezone", value: "Asia/Karachi" },
  { label: "Preferred language", value: "English" },
];

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Wayfinder Profile
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
        Update your account details, preferences, and family settings.
      </p>

      {/* Profile Card */}
      <div className="rounded-[12px] p-4 md:p-6" style={{ backgroundColor: "#313044" }}>
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 style={{ ...inter, fontWeight: 600, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Profile</h2>
          <button className="hidden md:block rounded-[8px] px-8 py-2.5 cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#111023" }}>
            Edit
          </button>
        </div>
        <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
          Basic info shown across your dashboards and reports.
        </p>

        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#525162" }}>
            <span style={{ ...inter, fontWeight: 700, fontSize: "24px", color: "#00CED1" }}>S</span>
          </div>
          <div className="text-center sm:text-left">
            <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>Sarah Ahmed</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>sarah@email.com</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>+92 3XX XXX XXXX</p>
          </div>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {badges.map((badge, i) => (
            <div key={i} className="rounded-[12px] px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "rgba(0,206,209,0.1)" }}>
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#00CED1" }}>
                <span className="text-lg">{badge.icon}</span>
              </div>
              <p style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{badge.label}</p>
            </div>
          ))}
        </div>

        {/* Details Rows */}
        <div className="flex flex-col gap-3">
          {details.map((item, i) => (
            <div key={i} className="rounded-[12px] px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-between" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
              <p style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.6)" }}>{item.label}</p>
              <p style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Mobile Edit Button */}
        <button className="md:hidden w-full rounded-[8px] py-3 mt-6 cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#111023" }}>
          Edit
        </button>
      </div>
    </div>
  );
}
