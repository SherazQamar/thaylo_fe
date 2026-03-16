"use client";

import ParentUserDropdown from "@/components/parent/ParentUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function SubscriptionPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Message
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h2 style={{ ...inter, fontWeight: 700, fontSize: "28px", lineHeight: "36px", color: "#FFFFFF", marginBottom: "8px" }}>
          Subscription &amp; Billing
        </h2>
        <p style={{ ...inter, fontWeight: 400, fontSize: "15px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>
          Manage your plan for your family. Clear, simple, and secure.
        </p>
      </div>

      {/* Current Status */}
      <div className="rounded-[12px] p-5 md:p-6 mb-8" style={{ backgroundColor: "#313044" }}>
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "4px" }}>Current status</h3>
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
          A quick snapshot of your plan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Plan card */}
          <div className="rounded-[12px] p-4 md:p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Plan</p>
            <div className="flex items-center gap-3">
              <p style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>Trial</p>
              <span
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: "rgba(0,206,209,0.15)", border: "1px solid #00CED1", ...inter, fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: "#00CED1" }}
              >
                Active
              </span>
            </div>
          </div>
          {/* Trial ends card */}
          <div className="rounded-[12px] p-4 md:p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Trial ends</p>
            <p style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>Jan 18, 2026</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Next billing date</p>
          </div>
        </div>
      </div>

      {/* Choose a Plan */}
      <div>
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "4px" }}>Choose a plan</h3>
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
          For demo: pricing is placeholder
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Monthly Plan */}
          <div
            className="rounded-[12px] p-5 md:p-6 flex flex-col"
            style={{ backgroundColor: "#313044", border: "1px solid #00CED1" }}
          >
            <div className="mb-4">
              <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Monthly</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span style={{ ...inter, fontWeight: 700, fontSize: "36px", lineHeight: "44px", color: "#FFFFFF" }}>$XX</span>
                <span style={{ ...inter, fontWeight: 400, fontSize: "16px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>/mo</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-6 flex-1">
              {["Best for getting started", "1 child included", "Add siblings anytime"].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.7)" }}>{feature}</p>
                </div>
              ))}
            </div>
            <button
              className="w-full rounded-[16px] py-3 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#111023" }}
            >
              Selected
            </button>
          </div>

          {/* Annual Plan */}
          <div
            className="rounded-[12px] p-5 md:p-6 flex flex-col"
            style={{ backgroundColor: "#313044", border: "1px solid #525162" }}
          >
            <div className="mb-4">
              <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Annual</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span style={{ ...inter, fontWeight: 700, fontSize: "36px", lineHeight: "44px", color: "#FFFFFF" }}>$XX</span>
                <span style={{ ...inter, fontWeight: 400, fontSize: "16px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>/mo</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-6 flex-1">
              {["Save vs monthly", "1 child included", "Annual savings applied", "Renews yearly"].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.7)" }}>{feature}</p>
                </div>
              ))}
            </div>
            <button
              className="w-full rounded-[16px] py-3 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
