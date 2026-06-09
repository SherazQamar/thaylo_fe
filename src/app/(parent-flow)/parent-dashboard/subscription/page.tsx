"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import {
  confirmParentSubscriptionCheckout,
  createParentSubscriptionCheckout,
  fetchParentSubscription,
  type SubscriptionPlan,
} from "@/lib/parent-api";
import { getApiErrorMessage } from "@/lib/auth-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function planIntervalLabel(plan: SubscriptionPlan | null | undefined): string {
  if (!plan) return "month";
  if (plan.interval === "year") return "year";
  if (plan.interval === "month") return "month";
  return plan.interval;
}

function monthlyDisplayAmount(plan: SubscriptionPlan | null | undefined): string {
  if (!plan) return "—";
  if (plan.interval === "year") {
    return formatMoney(Math.round(plan.amount / 12), plan.currency);
  }
  return formatMoney(plan.amount, plan.currency);
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white/60">Loading subscription…</div>}>
      <SubscriptionPageContent />
    </Suspense>
  );
}

function SubscriptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [screen, setScreen] = useState<"plans" | "payment">("plans");
  const [checks, setChecks] = useState([false, false, false, false]);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["parent-subscription"],
    queryFn: fetchParentSubscription,
  });

  const plan = selectedPlan === "annual"
    ? subscription?.annualPlan ?? null
    : subscription?.monthlyPlan ?? null;
  const monthlyPlan = subscription?.monthlyPlan ?? null;
  const annualPlan = subscription?.annualPlan ?? null;
  const hasMonthly = Boolean(monthlyPlan);
  const hasAnnual = Boolean(annualPlan);

  useEffect(() => {
    if (hasAnnual && !hasMonthly) {
      setSelectedPlan("annual");
    } else if (hasMonthly) {
      setSelectedPlan("monthly");
    }
  }, [hasAnnual, hasMonthly]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    let cancelled = false;
    confirmParentSubscriptionCheckout(sessionId)
      .then(() => {
        if (cancelled) return;
        queryClient.invalidateQueries({ queryKey: ["parent-subscription"] });
        setSuccessMessage("Your subscription is now active.");
        router.replace("/parent-dashboard/subscription");
      })
      .catch((error) => {
        if (cancelled) return;
        setCheckoutError(getApiErrorMessage(error));
        router.replace("/parent-dashboard/subscription");
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, queryClient, router]);

  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      setCheckoutError("Checkout was canceled. You can try again when ready.");
      router.replace("/parent-dashboard/subscription");
    }
  }, [searchParams, router]);

  const checkoutMutation = useMutation({
    mutationFn: () =>
      createParentSubscriptionCheckout({
        planType: selectedPlan,
        priceId: plan?.priceId,
      }),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error) => {
      setCheckoutError(getApiErrorMessage(error));
    },
  });

  const allChecked = checks.every(Boolean);
  const isSubscribed = subscription?.isActive === true;
  const monthlyPriceLabel = monthlyDisplayAmount(monthlyPlan);
  const annualPriceLabel = monthlyDisplayAmount(annualPlan);
  const fullPriceLabel = plan ? formatMoney(plan.amount, plan.currency) : "—";
  const billingLabel = planIntervalLabel(plan);

  const orderSummary = useMemo(() => {
    const childrenIncluded = subscription?.childrenCount ?? 0;
    return {
      planName: plan?.productName ?? (selectedPlan === "annual" ? "Annual" : "Monthly"),
      childrenIncluded: Math.max(childrenIncluded, 1),
      subtotal: fullPriceLabel,
      total: fullPriceLabel,
      nextCharge: formatDate(subscription?.currentPeriodEnd),
    };
  }, [plan, selectedPlan, subscription, fullPriceLabel]);

  function toggleCheck(i: number) {
    setChecks((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  function handleSelectPlan(planType: "monthly" | "annual") {
    if (planType === "annual" && !hasAnnual) return;
    if (planType === "monthly" && !hasMonthly) return;
    setSelectedPlan(planType);
    setShowEnrollment(true);
  }

  function handleAgree() {
    setShowEnrollment(false);
    setChecks([false, false, false, false]);
    setCheckoutError(null);
    setScreen("payment");
  }

  function handleStartSubscription() {
    setCheckoutError(null);
    checkoutMutation.mutate();
  }

  if (screen === "payment") {
    return (
      <div className="p-4 md:p-6 lg:p-10">
        <div className="flex items-center justify-between mb-6 md:mb-8">
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

        <div className="mb-8">
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "28px", lineHeight: "36px", color: "#FFFFFF", marginBottom: "8px" }}>
            Secure checkout
          </h2>
          <p style={{ ...inter, fontWeight: 400, fontSize: "15px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>
            Review your order, then continue to Stripe to complete payment securely.
          </p>
        </div>

        <div className="rounded-[12px] p-5 md:p-6 mb-6" style={{ backgroundColor: "#313044" }}>
          <h4 style={{ ...inter, fontWeight: 700, fontSize: "16px", lineHeight: "24px", color: "#FFFFFF", marginBottom: "16px" }}>
            Order summary
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Plan</span>
              <span style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>{orderSummary.planName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Billing</span>
              <span style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>
                {fullPriceLabel} / {billingLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Children included</span>
              <span style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>{orderSummary.childrenIncluded}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span style={{ ...inter, fontWeight: 700, fontSize: "15px", color: "#FFFFFF" }}>Total due today</span>
              <span style={{ ...inter, fontWeight: 700, fontSize: "15px", color: "#00CED1" }}>{orderSummary.total}</span>
            </div>
          </div>
        </div>

        {checkoutError && (
          <p className="mb-4 text-sm text-red-400 text-center" role="alert">
            {checkoutError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setScreen("plans")}
            disabled={checkoutMutation.isPending}
            className="w-full sm:w-auto rounded-[16px] px-6 py-4 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "15px", color: "#FFFFFF" }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleStartSubscription}
            disabled={checkoutMutation.isPending}
            className="flex-1 rounded-[16px] py-4 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-wait"
            style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF", letterSpacing: "1px" }}
          >
            {checkoutMutation.isPending ? "Redirecting to Stripe…" : "CONTINUE TO STRIPE CHECKOUT"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-6 md:mb-8">
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

      <div className="mb-8">
        <h2 style={{ ...inter, fontWeight: 700, fontSize: "28px", lineHeight: "36px", color: "#FFFFFF", marginBottom: "8px" }}>
          Subscription &amp; Billing
        </h2>
        <p style={{ ...inter, fontWeight: 400, fontSize: "15px", lineHeight: "24px", color: "rgba(255,255,255,0.5)" }}>
          Manage your plan for your family. Clear, simple, and secure.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-[12px] px-4 py-3 mb-6" style={{ backgroundColor: "rgba(0,206,209,0.12)", border: "1px solid rgba(0,206,209,0.3)" }}>
          <p style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "#00CED1" }}>{successMessage}</p>
        </div>
      )}

      {checkoutError && (
        <div className="rounded-[12px] px-4 py-3 mb-6" style={{ backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <p style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "#FCA5A5" }}>{checkoutError}</p>
        </div>
      )}

      <div className="rounded-[12px] p-5 md:p-6 mb-8" style={{ backgroundColor: "#313044" }}>
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "4px" }}>Current status</h3>
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
          A quick snapshot of your plan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-[12px] p-4 md:p-5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Plan</p>
            <div className="flex items-center gap-3">
              <p style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>
                {isLoading ? "…" : subscription?.planLabel ?? "Trial"}
              </p>
              {subscription?.isActive && (
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
              {subscription?.isActive ? "Renews on" : "Trial ends"}
            </p>
            <p style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>
              {isLoading ? "…" : formatDate(subscription?.currentPeriodEnd)}
            </p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              {subscription?.isActive ? "Next billing date" : "Subscribe to activate billing"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "4px" }}>Choose a plan</h3>
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
          {plan?.productDescription ?? monthlyPlan?.productDescription ?? "Select a plan to continue to secure Stripe checkout."}
        </p>

        {isSubscribed ? (
          <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044", border: "1px solid #00CED1" }}>
            <p style={{ ...inter, fontWeight: 600, fontSize: "16px", color: "#FFFFFF", marginBottom: "8px" }}>
              You already have an active subscription.
            </p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
              Your plan renews on {formatDate(subscription?.currentPeriodEnd)}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="rounded-[12px] p-5 md:p-6 flex flex-col"
              style={{
                backgroundColor: "#313044",
                border: selectedPlan === "monthly" ? "1px solid #00CED1" : "1px solid #525162",
                opacity: hasMonthly ? 1 : 0.5,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Monthly</p>
                <div className="flex items-baseline gap-1">
                  <span style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>
                    {hasMonthly ? monthlyPriceLabel : "—"}
                  </span>
                  {hasMonthly && (
                    <span style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>/ mo</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-6 flex-1">
                <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.6)" }}>
                  {monthlyPlan?.productName ?? "Best for getting started"}
                </p>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  {["1 child included", "Add siblings anytime"].map((f, i) => (
                    <li key={i} style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.6)" }}>{f}</li>
                  ))}
                </ul>
              </div>
              { !hasMonthly ? (
                <button
                  disabled
                  className="w-full rounded-[16px] py-3 cursor-not-allowed"
                  style={{ backgroundColor: "#525162", ...inter, fontWeight: 600, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}
                >
                  Not available
                </button>
              ) : selectedPlan === "monthly" ? (
                <button
                  type="button"
                  onClick={() => setShowEnrollment(true)}
                  className="w-full rounded-[16px] py-3 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}
                >
                  Selected
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectPlan("monthly")}
                  className="w-full rounded-[16px] py-3 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}
                >
                  Select
                </button>
              )}
            </div>

            <div
              className="rounded-[12px] p-5 md:p-6 flex flex-col"
              style={{
                backgroundColor: "#313044",
                border: selectedPlan === "annual" ? "1px solid #00CED1" : "1px solid #525162",
                opacity: hasAnnual ? 1 : 0.5,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>Annual</p>
                <div className="flex items-baseline gap-1">
                  <span style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}>
                    {hasAnnual ? annualPriceLabel : "—"}
                  </span>
                  {hasAnnual && (
                    <span style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>/ mo</span>
                  )}
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
              {!hasAnnual ? (
                <button
                  disabled
                  className="w-full rounded-[16px] py-3 cursor-not-allowed"
                  style={{ backgroundColor: "#525162", ...inter, fontWeight: 600, fontSize: "15px", color: "rgba(255,255,255,0.4)" }}
                >
                  Not available
                </button>
              ) : selectedPlan === "annual" ? (
                <button
                  type="button"
                  onClick={() => setShowEnrollment(true)}
                  className="w-full rounded-[16px] py-3 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}
                >
                  Selected
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSelectPlan("annual")}
                  className="w-full rounded-[16px] py-3 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "22px", color: "#FFFFFF" }}
                >
                  Select
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-[640px] rounded-[16px] p-5 md:px-7 md:py-6 relative max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#1A1930", border: "1px solid #525162" }}>
            <button
              type="button"
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
              Before you continue, please review and sign the enrollment agreement for your child&apos;s program.
            </p>

            <div className="flex flex-col gap-2 mb-4">
              {[
                `Total tuition is ${fullPriceLabel} per ${billingLabel}.`,
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

            <div className="flex flex-col gap-2.5 mb-5">
              {[
                "I have read and understand the Tuition Commitment Terms.",
                "I understand that completion records/transcripts are withheld until tuition is paid in full.",
                "I understand that if my child takes longer than one year, they may keep access after payment, but cannot advance grades or be marked completed until they finish.",
                "I consent to electronic signature and agree this is legally binding.",
              ].map((label, i) => (
                <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                  <button
                    type="button"
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

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => { setShowEnrollment(false); setChecks([false, false, false, false]); }}
                className="rounded-full px-8 py-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "transparent", border: "1px solid #525162", ...inter, fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}
              >
                Cancel
              </button>
              <button
                type="button"
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
