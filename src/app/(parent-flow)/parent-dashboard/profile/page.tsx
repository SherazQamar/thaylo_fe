"use client";

import Link from "next/link";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function ParentProfilePage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <Link href="/parent-dashboard" className="text-white/60 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Edit Profile
        </h1>
      </div>

      {/* Profile Card */}
      <div className="rounded-[12px] p-6 md:p-8 mb-6" style={{ backgroundColor: "#313044" }}>
        <div className="flex flex-col items-center mb-6">
          {/* Avatar with dashed border */}
          <div
            className="w-[100px] h-[100px] rounded-full flex items-center justify-center mb-4"
            style={{ border: "2px dashed rgba(255,255,255,0.3)" }}
          >
            <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </div>
          <p style={{ ...inter, fontWeight: 600, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Allex Filler</p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>alex.filler@email.com</p>
          <button
            className="rounded-full px-6 py-2.5 mt-4 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#111023" }}
          >
            Upload Photo
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-[12px] p-6 md:p-8" style={{ backgroundColor: "#313044" }}>
        <div className="flex items-center justify-between mb-2">
          <h2 style={{ ...inter, fontWeight: 600, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Personal Information</h2>
        </div>
        <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
          Managed by parent
        </p>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px" }}>
                First Name
              </label>
              <input
                type="text"
                defaultValue="Allex"
                className="w-full rounded-full px-5 py-3 outline-none text-white placeholder-white/40"
                style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontWeight: 400, fontSize: "14px" }}
              />
            </div>
            <div>
              <label style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px" }}>
                Last Name
              </label>
              <input
                type="text"
                defaultValue="Filler"
                className="w-full rounded-full px-5 py-3 outline-none text-white placeholder-white/40"
                style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontWeight: 400, fontSize: "14px" }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px" }}>
              Email Address
            </label>
            <input
              type="email"
              defaultValue="alex.filler@email.com"
              className="w-full rounded-full px-5 py-3 outline-none text-white placeholder-white/40"
              style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontWeight: 400, fontSize: "14px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
