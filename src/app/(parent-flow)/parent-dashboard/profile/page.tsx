"use client";

import { useState } from "react";
import Image from "next/image";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const children = [
  { name: "Alex Filler", grade: "Grade 4", status: "NEEDS ATTENTION", statusColor: "#F59E0B" },
  { name: "Alex Filler", grade: "Grade 4", status: "ON TRACK", statusColor: "#00CED1" },
  { name: "Alex Filler", grade: "Grade 4", status: "ON TRACK", statusColor: "#00CED1" },
];

export default function ParentProfilePage() {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Title */}
      <div className="mb-8">
        <h1 style={{ ...inter, fontWeight: 700, fontSize: "28px", lineHeight: "36px", color: "#FFFFFF", marginBottom: "8px" }}>
          Parent Profile
        </h1>
        <p style={{ ...inter, fontWeight: 400, fontSize: "15px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>
          Update your account details, preferences, and family settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-[12px] p-5 md:p-6 mb-6" style={{ backgroundColor: "#313044" }}>
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF" }}>Profile</h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>
              Basic info shown across your dashboards and reports.
            </p>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="rounded-[12px] px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}
          >
            Edit
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-[50px] h-[50px] rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0">
            <span style={{ ...inter, fontWeight: 600, fontSize: "22px", color: "#FFFFFF" }}>S</span>
          </div>
          <div>
            <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>Sarah Ahmed</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>sarah@email.com</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>+92 3XX XXX XXXX</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Country", value: "Pakistan" },
            { label: "Timezone", value: "Asia/Karachi" },
            { label: "Preferred language", value: "English" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[12px] px-4 py-3"
              style={{ backgroundColor: "#525162" }}
            >
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
              <span style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Children Card */}
      <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
        <h2 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF", marginBottom: "4px" }}>Children</h2>
        <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>
          At-a-glance list (full details live in dashboards/reports).
        </p>

        <div className="flex flex-col gap-2.5">
          {children.map((child, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[12px] px-4 py-3"
              style={{ backgroundColor: "#525162" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#313044] overflow-hidden flex-shrink-0">
                  <Image src="/assets/wayfinder Em.png" alt={child.name} width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{child.name}</p>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>{child.grade}</p>
                </div>
              </div>
              <span
                className="uppercase"
                style={{ ...inter, fontWeight: 700, fontSize: "12px", lineHeight: "16px", letterSpacing: "0.5px", color: child.statusColor }}
              >
                {child.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-[680px] rounded-[16px] p-5 md:p-7 relative" style={{ backgroundColor: "#313044" }}>
            {/* Close */}
            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80"
              style={{ backgroundColor: "#525162" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF", marginBottom: "4px" }}>
              Account information
            </h3>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
              Keep this accurate for reports, support, and billing.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Full name */}
              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Full name
                </label>
                <input
                  type="text"
                  defaultValue="Sarah Ahmed"
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="sarah@gmail.com"
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Phone
                </label>
                <input
                  type="text"
                  defaultValue="92 3XX XXX XXX"
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              {/* Preferred language */}
              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Preferred language
                </label>
                <input
                  type="text"
                  defaultValue="English"
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              {/* Country */}
              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Country
                </label>
                <input
                  type="text"
                  defaultValue="Pakistan"
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>

              {/* Timezone */}
              <div>
                <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "4px" }}>
                  Timezone
                </label>
                <input
                  type="text"
                  defaultValue="Asia/Karachii"
                  className="w-full rounded-[12px] px-4 py-2.5 outline-none text-white"
                  style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
                />
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={() => setShowEdit(false)}
              className="w-full rounded-[16px] py-3 mt-4 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF", letterSpacing: "1px" }}
            >
              SAVE CHANGES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
