"use client";

import { useCallback, useEffect, useState } from "react";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import PaymentMethodCardSection from "@/components/parent/PaymentMethodCardSection";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import {
  changeParentSubscriptionPlan,
  createParentSubscriptionCheckout,
  fetchParentSubscription,
  type ParentPaymentMethodPreview,
  type ParentSubscriptionStatus,
} from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const BETA_FEATURES = [
  "Full access to lessons and live classes during beta",
  "Parent dashboard and child accounts included",
  "No tuition charged while we are in beta",
  "Your data carries forward when paid plans launch",
];

const BILLING_POLICY_NOTES = [
  "There is no cancelling after the 7-day trial. Once enrolled for an academic year, tuition is owed for that year.",
  "You can switch from monthly to annual at any time; the discount is prorated.",
  "You cannot switch from annual to monthly once you have paid academic-year tuition.",
  "Even on a monthly plan (paid over 12 months), if your student finishes early you are still charged monthly until tuition is paid in full, and you cannot start the next academic year until the current year is paid in full.",
  "If a payment fails after you change payment methods, we retry two days later. If that attempt also fails, we close access and pursue next steps to collect amounts owed.",
];

function formatMoney(amountCents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  } catch {
    return `$${(amountCents / 100).toFixed(2)}`;
  }
}

export default function BillingPage() {
  const [subscription, setSubscription] =
    useState<ParentSubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await fetchParentSubscription();
      setSubscription(status);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load billing status",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const isBeta =
    subscription?.billingMode === "beta" || subscription?.status === "beta";

  function handleCardSaved(preview: ParentPaymentMethodPreview) {
    setSubscription((prev) =>
      prev ? { ...prev, paymentMethod: preview } : prev,
    );
  }

  async function handleUpgradeToAnnual() {
    setActionError(null);
    setActionPending(true);
    try {
      if (subscription?.canSwitchToAnnual) {
        const next = await changeParentSubscriptionPlan("annual");
        setSubscription(next);
      } else {
        const { url } = await createParentSubscriptionCheckout({
          planType: "annual",
        });
        window.location.href = url;
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Could not change plan",
      );
    } finally {
      setActionPending(false);
    }
  }

  async function handleStartMonthly() {
    setActionError(null);
    setActionPending(true);
    try {
      const { url } = await createParentSubscriptionCheckout({
        planType: "monthly",
      });
      window.location.href = url;
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Could not start checkout",
      );
    } finally {
      setActionPending(false);
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "25px",
            letterSpacing: "0.8px",
            color: "#DCE6EC",
          }}
        >
          Billing
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/parent-dashboard", label: "Parent Dashboard" },
          { href: "/parent-dashboard/subscription", label: "Billing" },
        ]}
      />

      <div className="mb-8">
        <h2
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "28px",
            lineHeight: "36px",
            color: "#FFFFFF",
            marginBottom: "8px",
          }}
        >
          {isBeta ? "Beta enrollment" : "Billing"}
        </h2>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "24px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {isBeta
            ? "Your family is enrolled in the Thaylo beta at no cost. You can still add a card for when paid billing begins."
            : "Manage your plan and payment method. Clear, simple, and secure."}
        </p>
      </div>

      {isLoading && (
        <div
          className="rounded-[12px] p-6"
          style={{ backgroundColor: "#313044" }}
        >
          <p style={{ ...inter, color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
            Loading billing…
          </p>
        </div>
      )}

      {error && (
        <div
          className="rounded-[12px] p-4 mb-6 border border-[#FF7B7B]/30"
          style={{ backgroundColor: "rgba(255,123,123,0.1)" }}
        >
          <p style={{ ...inter, color: "#FF7B7B", fontSize: "14px" }}>{error}</p>
        </div>
      )}

      {!isLoading && subscription && (
        <>
          <div
            className="rounded-[12px] p-5 md:p-6 mb-8"
            style={{ backgroundColor: "#313044" }}
          >
            <h3
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "28px",
                color: "#FFFFFF",
                marginBottom: "4px",
              }}
            >
              Current status
            </h3>
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "22px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "20px",
              }}
            >
              A quick snapshot of your family access.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-[12px] p-4 md:p-5"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <p
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "8px",
                  }}
                >
                  Plan
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <p
                    style={{
                      ...inter,
                      fontWeight: 700,
                      fontSize: "24px",
                      lineHeight: "32px",
                      color: "#FFFFFF",
                    }}
                  >
                    {subscription.planLabel}
                  </p>
                  {subscription.isActive && (
                    <span
                      className="rounded-full px-3 py-1"
                      style={{
                        backgroundColor: "rgba(0,206,209,0.15)",
                        border: "1px solid #00CED1",
                        ...inter,
                        fontWeight: 600,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#00CED1",
                      }}
                    >
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div
                className="rounded-[12px] p-4 md:p-5"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <p
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "20px",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "8px",
                  }}
                >
                  {isBeta ? "Children enrolled" : "Next billing"}
                </p>
                <p
                  style={{
                    ...inter,
                    fontWeight: 700,
                    fontSize: "24px",
                    lineHeight: "32px",
                    color: "#FFFFFF",
                  }}
                >
                  {isBeta
                    ? subscription.childrenCount
                    : subscription.currentPeriodEnd
                      ? new Date(
                          subscription.currentPeriodEnd,
                        ).toLocaleDateString()
                      : "—"}
                </p>
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "4px",
                  }}
                >
                  {isBeta ? "Included in beta access" : "Billing date"}
                </p>
              </div>
            </div>
          </div>

          <PaymentMethodCardSection
            savedCard={subscription.paymentMethod}
            canCollect={Boolean(subscription.canCollectCard)}
            onSaved={handleCardSaved}
          />

          <div
            className="rounded-[12px] p-5 md:p-6 mb-8"
            style={{
              backgroundColor: "#313044",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "18px",
                color: "#FFFFFF",
                marginBottom: "12px",
              }}
            >
              Important billing notes
            </h3>
            <ul className="space-y-3">
              {BILLING_POLICY_NOTES.map((note) => (
                <li key={note} className="flex items-start gap-2.5">
                  <span className="text-[#00CED1] mt-0.5 shrink-0">●</span>
                  <span
                    style={{
                      ...inter,
                      fontSize: "14px",
                      lineHeight: "22px",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {actionError && (
            <div
              className="rounded-[12px] p-4 mb-6 border border-[#FF7B7B]/30"
              style={{ backgroundColor: "rgba(255,123,123,0.1)" }}
            >
              <p style={{ ...inter, color: "#FF7B7B", fontSize: "14px" }}>
                {actionError}
              </p>
            </div>
          )}

          {isBeta ? (
            <div
              className="rounded-[12px] p-5 md:p-6"
              style={{
                backgroundColor: "#313044",
                border: "1px solid rgba(0,206,209,0.2)",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(0,206,209,0.15)" }}
                >
                  <span
                    style={{
                      ...inter,
                      fontWeight: 800,
                      color: "#00CED1",
                      fontSize: "18px",
                    }}
                  >
                    β
                  </span>
                </div>
                <div>
                  <h3
                    style={{
                      ...inter,
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#FFFFFF",
                      marginBottom: "6px",
                    }}
                  >
                    Free beta access
                  </h3>
                  <p
                    style={{
                      ...inter,
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "22px",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {subscription.betaMessage ??
                      "You are enrolled in the Thaylo beta program. Full access is included at no cost while we are in beta."}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 pl-1">
                {BETA_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="text-[#00CED1] mt-0.5">●</span>
                    <span
                      style={{
                        ...inter,
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                style={{
                  ...inter,
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "20px",
                }}
              >
                Paid plans will be available after beta. We will notify you
                before any billing begins. After the 7-day trial on paid plans,
                cancellation is not available for the academic year.
              </p>
            </div>
          ) : (
            <div
              className="rounded-[12px] p-5 md:p-6"
              style={{ backgroundColor: "#313044" }}
            >
              <h3
                style={{
                  ...inter,
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#FFFFFF",
                  marginBottom: "8px",
                }}
              >
                Plans
              </h3>
              <p
                style={{
                  ...inter,
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: "16px",
                }}
              >
                Switch from monthly to annual anytime (prorated). Annual cannot
                be switched back to monthly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscription.monthlyPlan && (
                  <div
                    className="rounded-[12px] p-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#FFFFFF",
                      }}
                    >
                      Monthly
                    </p>
                    <p
                      style={{
                        ...inter,
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#00CED1",
                        marginTop: "6px",
                      }}
                    >
                      {formatMoney(
                        subscription.monthlyPlan.amount,
                        subscription.monthlyPlan.currency,
                      )}
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {" "}
                        / month
                      </span>
                    </p>
                    {subscription.currentInterval === "year" ? (
                      <p
                        style={{
                          ...inter,
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.45)",
                          marginTop: "10px",
                        }}
                      >
                        Locked — annual tuition already paid for this year.
                      </p>
                    ) : subscription.currentInterval === "month" ? (
                      <p
                        style={{
                          ...inter,
                          fontSize: "12px",
                          color: "#00CED1",
                          marginTop: "10px",
                        }}
                      >
                        Current plan
                      </p>
                    ) : (
                      <button
                        type="button"
                        disabled={actionPending}
                        onClick={() => void handleStartMonthly()}
                        className="mt-3 rounded-full px-4 py-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
                        style={{
                          backgroundColor: "#00CED1",
                          ...inter,
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#111023",
                        }}
                      >
                        Choose monthly
                      </button>
                    )}
                  </div>
                )}

                {subscription.annualPlan && (
                  <div
                    className="rounded-[12px] p-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <p
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#FFFFFF",
                      }}
                    >
                      Annual
                    </p>
                    <p
                      style={{
                        ...inter,
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#00CED1",
                        marginTop: "6px",
                      }}
                    >
                      {formatMoney(
                        subscription.annualPlan.amount,
                        subscription.annualPlan.currency,
                      )}
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {" "}
                        / year
                      </span>
                    </p>
                    {subscription.currentInterval === "year" ? (
                      <p
                        style={{
                          ...inter,
                          fontSize: "12px",
                          color: "#00CED1",
                          marginTop: "10px",
                        }}
                      >
                        Current plan
                      </p>
                    ) : (
                      <button
                        type="button"
                        disabled={actionPending}
                        onClick={() => void handleUpgradeToAnnual()}
                        className="mt-3 rounded-full px-4 py-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
                        style={{
                          backgroundColor: "#00CED1",
                          ...inter,
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "#111023",
                        }}
                      >
                        {subscription.canSwitchToAnnual
                          ? "Switch to annual (prorated)"
                          : "Choose annual"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
