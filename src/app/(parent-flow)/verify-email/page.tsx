"use client";

import React, { useEffect, useState, FormEvent, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import OtpCodeInput from "@/components/parent/OtpCodeInput";
import { useResendCooldown } from "@/hooks/use-resend-cooldown";
import {
  getApiErrorMessage,
  resendVerificationEmail,
  verifyParentEmail,
} from "@/lib/auth-api";
import {
  clearPendingVerification,
  formatCooldown,
  getPendingVerification,
  setPendingVerification,
} from "@/lib/pending-verification";
import {
  isInvalidVerificationCodeMessage,
  isVerificationCodeExpiredMessage,
} from "@/lib/verification-errors";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryId = searchParams.get("id");
  const queryEmail = searchParams.get("email");
  const queryCode = searchParams.get("code");

  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [codeExpired, setCodeExpired] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const { remaining: resendCooldown, canResend, restartCooldown } =
    useResendCooldown();

  /** Timer first; resend only after 90s or when the code has expired. */
  const showResendAction = codeExpired ? true : canResend;

  useEffect(() => {
    const pending = getPendingVerification();
    const idFromQuery = queryId ? Number.parseInt(queryId, 10) : NaN;
    const resolvedId = Number.isFinite(idFromQuery)
      ? idFromQuery
      : pending?.userId ?? null;
    const resolvedEmail = queryEmail ?? pending?.email ?? "";

    if (resolvedId != null) setUserId(resolvedId);
    if (resolvedEmail) setEmail(resolvedEmail);

    if (resolvedId != null && resolvedEmail) {
      setPendingVerification({ userId: resolvedId, email: resolvedEmail });
    }

    if (queryCode && /^\d{6}$/.test(queryCode)) {
      setDigits(queryCode.split(""));
    }
  }, [queryId, queryEmail, queryCode]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const code = digits.join("");
      if (code.length !== 6) {
        throw new Error("Please enter the 6-digit verification code");
      }

      const payload: { code: string; id?: number; email?: string } = { code };
      if (userId != null) payload.id = userId;
      else if (email) payload.email = email;
      else throw new Error("Missing account information. Please sign up again.");

      await verifyParentEmail(payload);
    },
    onSuccess: () => {
      clearPendingVerification();
      router.push("/parent-sign-in?verified=1");
    },
    onError: (err) => {
      const message = getApiErrorMessage(err);
      if (isVerificationCodeExpiredMessage(message)) {
        setCodeExpired(true);
        setError(
          "Your verification code has expired. Request a new code below.",
        );
      } else if (isInvalidVerificationCodeMessage(message)) {
        setCodeExpired(false);
        setError("That code is incorrect. Please check your email and try again.");
      } else {
        setCodeExpired(false);
        setError(message);
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const targetEmail = email.trim();
      if (!targetEmail) {
        throw new Error("Email address is required to resend the code");
      }
      await resendVerificationEmail(targetEmail);
    },
    onSuccess: () => {
      setCodeExpired(false);
      setError(null);
      setDigits(["", "", "", "", "", ""]);
      setResendMessage("A new verification code has been sent to your email.");
      restartCooldown();
    },
    onError: (err) => {
      setResendMessage(null);
      setError(getApiErrorMessage(err));
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    verifyMutation.mutate();
  }

  function handleResend() {
    if (!showResendAction || resendMutation.isPending || !email.trim()) return;
    setResendMessage(null);
    setError(null);
    resendMutation.mutate();
  }

  const codeComplete = digits.every((d) => d !== "");
  const isBusy = verifyMutation.isPending || resendMutation.isPending;

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col pt-16 px-16 pb-0 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/logo.png"
              alt="Thaylo"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <div className="leading-none">
              <span
                className="block text-[20px] font-medium tracking-[0.08em]"
                style={{
                  background: "linear-gradient(90deg, #60D624, #00A19A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                THAYLO
              </span>
              <span className="block text-[8px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
                GLOBAL AI SCHOOL
              </span>
            </div>
          </div>
          <h1
            className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={inter}
          >
            Secure Email
            <br />
            Verification
          </h1>
          <p className="text-white/70 text-lg mt-3 max-w-[350px]" style={inter}>
            Enter the 6-digit code we sent to your email to activate your parent account.
          </p>
        </div>

        <div className="relative z-10 flex justify-start mt-auto mb-0">
          <Image
            src="/assets/Parent P1.png"
            alt="Parent character"
            width={320}
            height={360}
            className="w-[280px] max-h-[50vh] object-contain object-bottom"
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00CED1]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center justify-center px-6 py-8 sm:p-12 lg:px-20">
        <div className="lg:hidden mb-8 flex items-center gap-2.5 self-start">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span
            className="text-[18px] font-medium tracking-[0.08em]"
            style={{
              background: "linear-gradient(90deg, #60D624, #00A19A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            THAYLO
          </span>
        </div>

        <div className="w-full max-w-[420px] lg:max-w-[480px]">
          <div className="rounded-[16px] p-6 border border-[#525162]/50 lg:rounded-[19px] lg:px-10 lg:py-10">
            <h2
              className="text-white text-xl sm:text-2xl font-semibold mb-2 tracking-wide uppercase text-center"
              style={inter}
            >
              Verification Code
            </h2>
            <p
              className="text-white/50 text-sm text-center mb-6"
              style={inter}
            >
              {email
                ? `Enter the code sent to ${email}`
                : "Enter the 6-digit code from your email"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p
                  className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2 text-center"
                  style={inter}
                >
                  Verification Code
                </p>
                <p
                  className="text-white/40 text-xs text-center mb-3"
                  style={inter}
                >
                  Enter this code inside the application
                </p>
                <OtpCodeInput
                  digits={digits}
                  onChange={(digits) => {
                    setDigits(digits);
                    if (codeExpired) setCodeExpired(false);
                  }}
                  disabled={isBusy}
                />
              </div>

              {codeExpired && (
                <div
                  className="rounded-[12px] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center"
                  role="alert"
                >
                  <p
                    className="text-amber-200 text-sm font-medium"
                    style={inter}
                  >
                    Code expired
                  </p>
                  <p className="text-amber-200/70 text-xs mt-1" style={inter}>
                    Request a new verification code to continue.
                  </p>
                </div>
              )}

              {resendMessage && (
                <p className="text-sm text-[#00CED1] text-center" role="status">
                  {resendMessage}
                </p>
              )}

              {error && (
                <p className="text-sm text-red-400 text-center" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!codeComplete || isBusy}
                className={`w-full py-4 rounded-[16px] text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer ${
                  codeComplete && !isBusy
                    ? "bg-[#00CED1] text-white hover:bg-[#00B8BB]"
                    : "bg-[#525162]/50 text-white/30 cursor-not-allowed"
                }`}
                style={inter}
              >
                {verifyMutation.isPending ? "Verifying…" : "Verify Email"}
              </button>
            </form>

            <div className="mt-5 text-center space-y-2">
              {showResendAction ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isBusy || !email.trim()}
                  className="w-full py-3 rounded-[12px] border border-[#00CED1]/40 text-[#00CED1] text-sm font-semibold uppercase tracking-wide hover:bg-[#00CED1]/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={inter}
                >
                  {resendMutation.isPending ? "Sending…" : "Resend verification code"}
                </button>
              ) : (
                <div className="space-y-1">
                  <p className="text-white/40 text-sm" style={inter}>
                    Didn&apos;t receive the code? You can resend in{" "}
                    <span className="text-white/70 font-medium tabular-nums">
                      {formatCooldown(resendCooldown)}
                    </span>
                  </p>
                  <p className="text-white/30 text-xs" style={inter}>
                    Check your inbox and spam folder for the 6-digit code.
                  </p>
                </div>
              )}
            </div>

            <p
              className="text-center text-white/50 text-sm mt-4"
              style={inter}
            >
              Already verified?{" "}
              <Link
                href="/parent-sign-in"
                className="text-[#00CED1] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#111023]">
          <p className="text-white/50 text-sm" style={inter}>
            Loading…
          </p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
