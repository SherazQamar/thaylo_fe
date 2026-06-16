"use client";

import { useState } from "react";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [screen, setScreen] = useState<"plans" | "payment">("plans");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [checks, setChecks] = useState([false, false, false, false]);

  const allChecked = checks.every(Boolean);

  function toggleCheck(i: number) {
    setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  function handleSelectPlan(plan: "monthly" | "annual") {
    setSelectedPlan(plan);
    setShowEnrollment(true);
  }

  function handleAgree() {
    setShowEnrollment(false);
    setChecks([false, false, false, false]);
    setScreen("payment");
  }

  function handleStartSubscription() {
    setShowOrderSummary(true);
  }

  // ===== PAYMENT METHOD SCREEN =====
  if (screen === "payment") {
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
            Payment method
          </h2>
          <p style={{ ...inter, fontWeight: 400, fontSize: "15px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>
            Card fields are placeholders (Stripe Elements in production).
          </p>
        </div>

        {/* Payment Form Card */}
        <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
          <h4 style={{ ...inter, fontWeight: 700, fontSize: "16px", lineHeight: "24px", color: "#FFFFFF", marginBottom: "4px" }}>Payment method</h4>
          <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
            Card fields are placeholders (Stripe Elements in production).
          </p>

          {/* Cardholder name */}
          <div className="mb-4">
            <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "6px" }}>
              Cardholder name
            </label>
            <input
              type="text"
              placeholder="e.g., Sarah Ahmad"
              className="w-full rounded-[12px] px-4 py-3 outline-none text-white placeholder-white/30"
              style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
            />
          </div>

          {/* Card number */}
          <div className="mb-4">
            <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "6px" }}>
              Card number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-[12px] px-4 py-3 outline-none text-white placeholder-white/30"
              style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
            />
          </div>

          {/* Expiry */}
          <div className="mb-4">
            <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "6px" }}>
              Expiry
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full rounded-[12px] px-4 py-3 outline-none text-white placeholder-white/30"
              style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
            />
          </div>

          {/* CVC + Billing email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "6px" }}>
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full rounded-[12px] px-4 py-3 outline-none text-white placeholder-white/30"
                style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
              />
            </div>
            <div>
              <label style={{ ...inter, fontWeight: 600, fontSize: "13px", lineHeight: "20px", color: "#FFFFFF", display: "block", marginBottom: "6px" }}>
                Billing email
              </label>
              <input
                type="email"
                placeholder="parent@email.com"
                className="w-full rounded-[12px] px-4 py-3 outline-none text-white placeholder-white/30"
                style={{ backgroundColor: "#525162", ...inter, fontSize: "14px" }}
              />
            </div>
          </div>
        </div>

        {/* Start Subscription Button */}
        <button
          onClick={handleStartSubscription}
          className="w-full rounded-[16px] py-4 mt-6 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF", letterSpacing: "1px" }}
        >
          START SUBSCRIPTION
        </button>

        {/* ===== ORDER SUMMARY MODAL ===== */}
        {showOrderSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
            <div className="w-full max-w-[440px] rounded-[16px] p-6 md:p-8 relative" style={{ backgroundColor: "#1A1930", border: "1px solid #525162" }}>
              <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "4px" }}>
                Order summary
              </h3>
              <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
                Shows what will be charged and when.
              </p>

              <div className="flex flex-col">
                <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>Selected plan</span>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>
                    {selectedPlan === "monthly" ? "Monthly" : "Annual"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>Children included</span>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>1</span>
                </div>
                <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px dashed rgba(255,255,255,0.15)" }}>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>Subtotal</span>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>$XX</span>
                </div>
                <div className="flex items-center justify-between py-3 mb-4">
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>Discounts</span>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>-$X</span>
                </div>

                <div className="rounded-[12px] px-5 py-4" style={{ backgroundColor: "rgba(0,206,209,0.1)", border: "1px solid rgba(0,206,209,0.2)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ ...inter, fontWeight: 700, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>Total today</span>
                    <span style={{ ...inter, fontWeight: 700, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}>$XX</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "22px", color: "#00CED1" }}>Next charge</span>
                    <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "22px", color: "#00CED1" }}>Feb 09, 2026</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setShowOrderSummary(false); setScreen("plans"); }}
                className="w-full rounded-[16px] py-3 mt-6 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}
              >
                DONE
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== PLANS SCREEN (default) =====
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
          <button
            type="button"
            onClick={() => handleSelectPlan("monthly")}
            aria-pressed={selectedPlan === "monthly"}
            className="rounded-[12px] p-5 md:p-6 flex flex-col text-left cursor-pointer hover:opacity-95 transition-opacity w-full"
            style={{ backgroundColor: "#313044", border: selectedPlan === "monthly" ? "1px solid #00CED1" : "1px solid #525162" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Monthly</p>
              <div className="flex items-baseline gap-1">
                <span style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>$XX</span>
                <span style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>/ mo</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-6 flex-1">
              <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.6)" }}>Best for getting started</p>
              <ul className="list-disc list-inside flex flex-col gap-1">
                {["1 child included", "Add siblings anytime"].map((f, i) => (
                  <li key={i} style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.6)" }}>{f}</li>
                ))}
              </ul>
            </div>
            <div
              className="w-full rounded-[16px] py-3 pointer-events-none"
              style={
                selectedPlan === "monthly"
                  ? { backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF", textAlign: "center" }
                  : { backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF", textAlign: "center" }
              }
            >
              {selectedPlan === "monthly" ? "Selected" : "Select"}
            </div>
          </button>

          {/* Annual Plan */}
          <button
            type="button"
            onClick={() => handleSelectPlan("annual")}
            aria-pressed={selectedPlan === "annual"}
            className="rounded-[12px] p-5 md:p-6 flex flex-col text-left cursor-pointer hover:opacity-95 transition-opacity w-full"
            style={{ backgroundColor: "#313044", border: selectedPlan === "annual" ? "1px solid #00CED1" : "1px solid #525162" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Annual</p>
              <div className="flex items-baseline gap-1">
                <span style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>$XX</span>
                <span style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>/ mo</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-6 flex-1">
              <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.6)" }}>Save vs monthly</p>
              <ul className="list-disc list-inside flex flex-col gap-1">
                {["1 child included", "Annual savings applied", "Renews yearly"].map((f, i) => (
                  <li key={i} style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.6)" }}>{f}</li>
                ))}
              </ul>
            </div>
            <div
              className="w-full rounded-[16px] py-3 pointer-events-none"
              style={
                selectedPlan === "annual"
                  ? { backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF", textAlign: "center" }
                  : { backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF", textAlign: "center" }
              }
            >
              {selectedPlan === "annual" ? "Selected" : "Select"}
            </div>
          </button>
        </div>
      </div>

      {/* ===== ENROLLMENT AGREEMENT MODAL ===== */}
      {showEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-[640px] rounded-[16px] p-5 md:px-7 md:py-6 relative max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#1A1930", border: "1px solid #525162" }}>
            {/* Close */}
            <button
              onClick={() => { setShowEnrollment(false); setChecks([false, false, false, false]); }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80"
              style={{ backgroundColor: "#525162" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "26px", color: "#FFFFFF", marginBottom: "6px" }}>
              Enrollment Agreement &amp; Tuition Terms
            </h3>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "14px" }}>
              Before you continue, please review and sign the enrollment agreement for your child&apos;s program. By enrolling, you agree that:
            </p>

            {/* Terms with teal check icons */}
            <div className="flex flex-col gap-2 mb-4">
              {[
                "Total tuition is $X for the full academic year program.",
                "Tuition is owed in full even if your child completes early.",
                "Completion records/transcripts will not be released until tuition is fully paid.",
                'If your child takes longer than one year, they may continue accessing content after tuition is paid, but they cannot advance to the next grade or show "completed" on the transcript until coursework is finished.',
              ].map((term, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0 mt-[1px]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.8)" }}>{term}</p>
                </div>
              ))}
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-2.5 mb-5">
              {[
                "I have read and understand the Tuition Commitment Terms.",
                "I understand that completion records/transcripts are withheld until tuition is paid in full.",
                "I understand that if my child takes longer than one year, they may keep access after payment, but cannot advance grades or be marked completed until they finish.",
                "I consent to electronic signature and agree this is legally binding.",
              ].map((label, i) => (
                <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                  <button
                    onClick={() => toggleCheck(i)}
                    className="w-[18px] h-[18px] rounded-[3px] flex items-center justify-center flex-shrink-0 mt-[1px] cursor-pointer"
                    style={{ backgroundColor: checks[i] ? "#00CED1" : "transparent", border: checks[i] ? "none" : "1.5px solid rgba(255,255,255,0.3)" }}
                  >
                    {checks[i] && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <span style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.8)" }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setShowEnrollment(false); setChecks([false, false, false, false]); }}
                className="rounded-full px-8 py-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAgree}
                disabled={!allChecked}
                className="rounded-full px-8 py-2.5 cursor-pointer transition-opacity"
                style={{
                  backgroundColor: allChecked ? "#00CED1" : "rgba(0,206,209,0.3)",
                  ...inter,
                  fontWeight: 600,
                  fontSize: "13px",
                  color: allChecked ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                  opacity: allChecked ? 1 : 0.7,
                }}
              >
                AGREE &amp; CONTINUE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
