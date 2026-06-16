"use client";

import React, { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";
import { forgotPassword, getApiErrorMessage, loginParent } from "@/lib/auth-api";
import { startResendCooldown } from "@/lib/pending-verification";
import { logoutParent, setParentSession } from "@/lib/auth-session";
import { hasCompletedFamilyRegistration } from "@/lib/parent-registration";

type ModalState = "none" | "reset" | "verification";

export default function ParentSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState<ModalState>("none");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") {
      setSuccessMessage("Email verified. You can sign in now.");
    }
    if (params.get("reset") === "1") {
      setSuccessMessage(
        "Password reset successfully. Sign in with your new password.",
      );
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { user, accessToken } = await loginParent(email.trim(), password);
      setParentSession(accessToken, user);
      return user;
    },
    onSuccess: (user) => {
      if (user.role !== "PARENT") {
        logoutParent();
        setError(
          "This account cannot sign in here. Please use the Wayfinder sign-in page.",
        );
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get("returnUrl");

      if (
        returnUrl?.startsWith("/parent-dashboard") &&
        hasCompletedFamilyRegistration(user)
      ) {
        router.push(returnUrl);
        return;
      }

      if (!hasCompletedFamilyRegistration(user)) {
        router.push("/parent-register/step-2");
        return;
      }
      router.push("/parent-dashboard");
    },
    onError: (err) => {
      if (
        isAxiosError(err) &&
        err.response?.status === 403 &&
        email.trim()
      ) {
        const emailTrimmed = email.trim();
        startResendCooldown();
        router.push(
          `/verify-email?${new URLSearchParams({ email: emailTrimmed }).toString()}`,
        );
        return;
      }
      setError(getApiErrorMessage(err));
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async () => {
      const emailTrimmed = resetEmail.trim();
      if (!emailTrimmed) {
        throw new Error("Email address is required");
      }
      return forgotPassword(emailTrimmed);
    },
    onSuccess: (response) => {
      setResetError(null);
      setResetSuccessMessage(response.message);
      setModal("verification");
    },
    onError: (err) => {
      setResetError(getApiErrorMessage(err));
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    loginMutation.mutate();
  }

  function handleSendReset(e: FormEvent) {
    e.preventDefault();
    setResetError(null);
    forgotPasswordMutation.mutate();
  }

  // Mask email for display
  const maskedEmail = resetEmail
    ? resetEmail.replace(/(.{3})(.*)(@.*)/, "$1xxxxx$3")
    : "allexxxxx@gmail.com";

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      {/* Left Half - hidden on mobile */}
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col pt-16 px-16 pb-0 overflow-hidden">
        <div className="relative z-10">
          <ThayloBrandLink />
          <h1
            className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Learn Anytime,
            <br />
            Anywhere
          </h1>
          <p
            className="text-white/70 text-lg mt-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Access high-quality courses on your schedule—at home,
            <br />
            on campus, or on the go.
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

      {/* Right Half */}
      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center justify-center px-6 pt-6 pb-8 sm:p-12 lg:px-20 lg:py-16">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 self-start">
            <ThayloBrandLink size="sm" />
          </div>

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto">
            {/* Form Card */}
            <div className="rounded-[16px] p-6 border border-[#525162]/50 lg:bg-transparent lg:rounded-[19px] lg:border lg:border-[#525162]/50 lg:px-10 lg:py-10">
              <h2
                className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-8 sm:mb-10 tracking-wide uppercase text-center"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Welcome to Thaylo
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/70 mb-2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Aliex@gmail.com"
                    required
                    className="w-full px-4 py-3 sm:py-3.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/70 mb-2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 sm:py-3.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Forget Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail("");
                      setResetError(null);
                      setResetSuccessMessage(null);
                      setModal("reset");
                    }}
                    className="text-[13px] text-[#00CED1] underline font-normal cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif", lineHeight: "20px" }}
                  >
                    Forget Password?
                  </button>
                </div>

                {successMessage && (
                  <p
                    className="text-sm text-[#00CED1] text-center"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    role="status"
                  >
                    {successMessage}
                  </p>
                )}

                {error && (
                  <p
                    className="text-sm text-red-400 text-center"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full py-3.5 sm:py-4 rounded-full bg-[#00CED1] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {loginMutation.isPending ? "Signing in…" : "Sign In"}
                </button>
              </form>
            </div>

            {/* Create Account */}
            <p
              className="text-center text-white/50 text-sm mt-6 sm:mt-8"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Not registered yet?{" "}
              <Link
                href="/parent-register"
                className="text-[#00CED1] font-medium hover:underline"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>

      {/* Reset Password Modal */}
      {modal === "reset" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal("none")} />
          <div
            className="relative w-full max-w-[380px] lg:max-w-[440px] rounded-[19px] p-6 lg:p-8 border border-[#525162]/50"
            style={{ backgroundColor: "#313044", fontFamily: "Inter, sans-serif" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setModal("none")}
              className="absolute top-4 right-4 w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <h3 className="text-white text-xl font-bold text-center mb-1">
              Reset Password
            </h3>
            <p className="text-[#00CED1] text-sm text-center mb-6">
              Enter your email address to reset your password.
            </p>

            <form onSubmit={handleSendReset} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Allex@gmail.com"
                  required
                  className="w-full px-4 py-3 rounded-full bg-[#111023] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                />
              </div>

              <p className="text-white/50 text-xs leading-relaxed">
                Enter your email address and we&apos;ll send you instructions to reset your password. For security reasons, we do NOT store your password. So rest assured that we will never send your password via email.
              </p>

              {resetError && (
                <p className="text-sm text-red-400 text-center" role="alert">
                  {resetError}
                </p>
              )}

              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {forgotPasswordMutation.isPending ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {modal === "verification" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal("none")} />
          <div
            className="relative w-full max-w-[380px] lg:max-w-[440px] rounded-[19px] p-6 lg:p-8 border border-[#525162]/50"
            style={{ backgroundColor: "#313044", fontFamily: "Inter, sans-serif" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setModal("none")}
              className="absolute top-4 right-4 w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <h3 className="text-white text-xl font-bold text-center mb-1">
              Check your email
            </h3>
            <p className="text-[#00CED1] text-sm text-center mb-6">
              {resetSuccessMessage ??
                "If the email exists, a reset link has been sent."}
            </p>

            {/* Email Illustration */}
            <div className="flex justify-center mb-6">
              <div className="relative w-[200px] h-[140px]">
                {/* Background blob */}
                <div className="absolute inset-0 bg-[#1a3a4a] rounded-full opacity-60" />
                {/* Envelope */}
                <svg viewBox="0 0 200 140" className="relative z-10 w-full h-full">
                  {/* Envelope body */}
                  <rect x="50" y="50" width="100" height="70" rx="6" fill="#00CED1" stroke="#111023" strokeWidth="2" />
                  {/* Envelope flap */}
                  <path d="M50 50 L100 90 L150 50" fill="#0097A7" stroke="#111023" strokeWidth="2" />
                  {/* Letter */}
                  <rect x="60" y="35" width="80" height="50" rx="4" fill="#F5F5F5" stroke="#111023" strokeWidth="1.5" />
                  <path d="M70 50h60M70 60h40" stroke="#CCC" strokeWidth="2" />
                  {/* Paper plane */}
                  <path d="M145 55 L175 45 L160 70 L155 58Z" fill="white" stroke="#111023" strokeWidth="1" />
                  {/* Dashed trail */}
                  <path d="M40 80 Q60 40 100 50 Q130 58 145 55" fill="none" stroke="#00CED1" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>

            <p className="text-white/60 text-sm text-center mb-1">
              Request sent for{" "}
              <span className="font-semibold text-white">{maskedEmail}</span>
            </p>
            <p className="text-white/40 text-xs text-center mb-6 leading-relaxed">
              Please check your inbox and spam folder. If an account exists with
              this email, you will receive reset instructions shortly.
            </p>

            <button
              type="button"
              onClick={() => setModal("none")}
              className="w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
