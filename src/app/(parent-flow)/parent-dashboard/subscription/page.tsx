"use client";

import { useEffect, useState } from "react";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { fetchParentSubscription, type ParentSubscriptionStatus } from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const BETA_FEATURES = [
  "Full access to lessons and live classes during beta",
  "Parent dashboard and child accounts included",
  "No payment or card required while we are in beta",
  "Your data carries forward when paid plans launch",
];

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<ParentSubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const status = await fetchParentSubscription();
        if (!cancelled) setSubscription(status);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load subscription status");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isBeta = subscription?.billingMode === "beta" || subscription?.status === "beta";

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Subscription
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/parent-dashboard", label: "Parent Dashboard" },
          { href: "/parent-dashboard/subscription", label: "Subscription" },
        ]}
      />

      <div className="mb-8">
        <h2 style={{ ...inter, fontWeight: 700, fontSize: "28px", lineHeight: "36px", color: "#FFFFFF", marginBottom: "8px" }}>
          {isBeta ? "Beta enrollment" : "Subscription & Billing"}
        </h2>
        <p style={{ ...inter, fontWeight: 400, fontSize: "15px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>
          {isBeta
            ? "Your family is enrolled in the Thaylo beta at no cost."
            : "Manage your plan for your family. Clear, simple, and secure."}
        </p>
      </div>

      {isLoading && (
        <div className="rounded-[12px] p-6" style={{ backgroundColor: "#313044" }}>
          <p style={{ ...inter, color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Loading subscription…</p>
        </div>
      )}

      {error && (
        <div className="rounded-[12px] p-4 mb-6 border border-[#FF7B7B]/30" style={{ backgroundColor: "rgba(255,123,123,0.1)" }}>
          <p style={{ ...inter, color: "#FF7B7B", fontSize: "14px" }}>{error}</p>
        </div>
      )}

      {!isLoading && subscription && (
        <>
          <div className="rounded-[12px] p-5 md:p-6 mb-8" style={{ backgroundColor: "#313044" }}>
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "4px" }}>
              Current status
            </h3>
            <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
              A quick snapshot of your family access.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[12px] p-4 md:p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Plan</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <p style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>
                    {subscription.planLabel}
                  </p>
                  {subscription.isActive && (
                    <span
                      className="rounded-full px-3 py-1"
                      style={{ backgroundColor: "rgba(0,206,209,0.15)", border: "1px solid #00CED1", ...inter, fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: "#00CED1" }}
                    >
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-[12px] p-4 md:p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                  {isBeta ? "Children enrolled" : "Next billing"}
                </p>
                <p style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>
                  {isBeta
                    ? subscription.childrenCount
                    : subscription.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                      : "—"}
                </p>
                <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                  {isBeta ? "Included in beta access" : "Billing date"}
                </p>
              </div>
            </div>
          </div>

          {isBeta ? (
            <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044", border: "1px solid rgba(0,206,209,0.2)" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(0,206,209,0.15)" }}>
                  <span style={{ ...inter, fontWeight: 800, color: "#00CED1", fontSize: "18px" }}>β</span>
                </div>
                <div>
                  <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF", marginBottom: "6px" }}>
                    Free beta access
                  </h3>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.65)" }}>
                    {subscription.betaMessage ??
                      "You are enrolled in the Thaylo beta program. Full access is included at no cost while we are in beta."}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 pl-1">
                {BETA_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="text-[#00CED1] mt-0.5">●</span>
                    <span style={{ ...inter, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.75)" }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <p style={{ ...inter, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.4)", marginTop: "20px" }}>
                Paid plans will be available after beta. We will notify you before any billing begins.
              </p>
            </div>
          ) : (
            <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
              <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF", marginBottom: "8px" }}>Plans</h3>
              <p style={{ ...inter, fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
                Plan selection and Stripe checkout will appear here when billing is enabled.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
