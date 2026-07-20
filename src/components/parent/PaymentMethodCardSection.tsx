"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe, type StripeCardElementOptions } from "@stripe/stripe-js";
import {
  confirmParentPaymentMethod,
  createParentPaymentMethodSetup,
  type ParentPaymentMethodPreview,
} from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: "#FFFFFF",
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      "::placeholder": { color: "rgba(255,255,255,0.35)" },
      iconColor: "#00CED1",
    },
    invalid: {
      color: "#FF7B7B",
      iconColor: "#FF7B7B",
    },
  },
  hidePostalCode: true,
};

type Props = {
  savedCard: ParentPaymentMethodPreview | null | undefined;
  canCollect: boolean;
  onSaved: (preview: ParentPaymentMethodPreview) => void;
};

function maskPreview(card: ParentPaymentMethodPreview) {
  return `•••• •••• •••• ${card.last4}`;
}

function SaveCardForm({
  clientSecret,
  onSaved,
  onCancel,
}: {
  clientSecret: string;
  onSaved: (preview: ParentPaymentMethodPreview) => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card form is not ready. Please try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // CardElement only — no Direct Debit / bank methods.
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        setError(result.error.message ?? "Could not save card");
        return;
      }

      const paymentMethodId =
        typeof result.setupIntent?.payment_method === "string"
          ? result.setupIntent.payment_method
          : result.setupIntent?.payment_method?.id;

      if (!paymentMethodId) {
        setError("Card was not attached. Please try again.");
        return;
      }

      const preview = await confirmParentPaymentMethod(paymentMethodId);
      onSaved(preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save card");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="rounded-[12px] px-4 py-3"
        style={{ backgroundColor: "#525162" }}
      >
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {error && (
        <p style={{ ...inter, color: "#FF7B7B", fontSize: "13px" }} role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="rounded-full px-5 py-2.5 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            color: "#111023",
          }}
        >
          {submitting ? "Saving…" : "Save card"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-full px-5 py-2.5 cursor-pointer hover:bg-white/10 transition-colors disabled:opacity-50"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            color: "#FFFFFF",
          }}
        >
          Cancel
        </button>
      </div>
      <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
        Card numbers are processed by Stripe and never stored in full on Thaylo.
        We keep an encrypted preview and only show the last 4 digits.
      </p>
    </form>
  );
}

export default function PaymentMethodCardSection({
  savedCard,
  canCollect,
  onSaved,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const elementsOptions = useMemo(
    () => ({
      appearance: {
        theme: "night" as const,
        variables: {
          colorPrimary: "#00CED1",
          colorBackground: "#525162",
          colorText: "#FFFFFF",
          borderRadius: "12px",
        },
      },
    }),
    [],
  );

  async function startAddCard() {
    setSetupError(null);
    setLoadingSetup(true);
    try {
      const setup = await createParentPaymentMethodSetup();
      if (!setup.publishableKey) {
        setSetupError(
          "Stripe publishable key is not configured. Add STRIPE_PUBLISHABLE_KEY on the API.",
        );
        return;
      }
      setPublishableKey(setup.publishableKey);
      setClientSecret(setup.clientSecret);
      setStripePromise(loadStripe(setup.publishableKey));
      setEditing(true);
    } catch (err) {
      setSetupError(
        err instanceof Error ? err.message : "Could not start card setup",
      );
    } finally {
      setLoadingSetup(false);
    }
  }

  useEffect(() => {
    if (!publishableKey) return;
    setStripePromise(loadStripe(publishableKey));
  }, [publishableKey]);

  return (
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
        Payment method
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
        Add a card on file for tuition after your trial. Only the last 4 digits
        are shown here.
      </p>

      {savedCard && !editing && (
        <div
          className="rounded-[12px] p-4 mb-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <div>
            <p
              style={{
                ...inter,
                fontWeight: 600,
                fontSize: "16px",
                color: "#FFFFFF",
              }}
            >
              {maskPreview(savedCard)}
            </p>
            <p
              style={{
                ...inter,
                fontSize: "12px",
                color: "rgba(255,255,255,0.45)",
                marginTop: "4px",
                textTransform: "capitalize",
              }}
            >
              {savedCard.brand}
              {savedCard.expMonth && savedCard.expYear
                ? ` · Exp ${String(savedCard.expMonth).padStart(2, "0")}/${savedCard.expYear}`
                : ""}
            </p>
          </div>
          {canCollect && (
            <button
              type="button"
              onClick={() => void startAddCard()}
              className="rounded-full px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "#00CED1",
                ...inter,
                fontWeight: 600,
                fontSize: "13px",
                color: "#111023",
              }}
            >
              Update card
            </button>
          )}
        </div>
      )}

      {!savedCard && !editing && (
        <div className="mb-4">
          <p
            style={{
              ...inter,
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              marginBottom: "12px",
            }}
          >
            No card on file yet.
          </p>
          {canCollect ? (
            <button
              type="button"
              onClick={() => void startAddCard()}
              disabled={loadingSetup}
              className="rounded-full px-5 py-2.5 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: "#00CED1",
                ...inter,
                fontWeight: 600,
                fontSize: "14px",
                color: "#111023",
              }}
            >
              {loadingSetup ? "Loading…" : "Add card"}
            </button>
          ) : (
            <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              Card collection will be available once Stripe is configured.
            </p>
          )}
        </div>
      )}

      {setupError && (
        <p
          className="mb-3"
          style={{ ...inter, color: "#FF7B7B", fontSize: "13px" }}
          role="alert"
        >
          {setupError}
        </p>
      )}

      {editing && clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={elementsOptions}>
          <SaveCardForm
            clientSecret={clientSecret}
            onSaved={(preview) => {
              onSaved(preview);
              setEditing(false);
              setClientSecret(null);
            }}
            onCancel={() => {
              setEditing(false);
              setClientSecret(null);
            }}
          />
        </Elements>
      )}
    </div>
  );
}
