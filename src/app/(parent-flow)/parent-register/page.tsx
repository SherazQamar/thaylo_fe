"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { US_TIMEZONES } from "@/constants/us-timezones";
import { getApiErrorMessage, isEmailAlreadyRegisteredMessage, registerParent } from "@/lib/auth-api";
import {
  setPendingVerification,
  startResendCooldown,
} from "@/lib/pending-verification";
import {
  PARENT_PASSWORD_REQUIREMENTS,
  validateParentPassword,
  validatePasswordConfirm,
} from "@/lib/validation/password";
import {
  formatPhoneInput,
  PHONE_INPUT_PLACEHOLDER,
} from "@/lib/validation/phone";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";

const inter = { fontFamily: "Inter, sans-serif" } as const;
const COUNTRY = "USA";

const fieldInputClass =
  "w-full rounded-[40px] bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30";
const fieldInputStyle = {
  fontFamily: "Inter, sans-serif",
  padding: "12px 20px",
  height: "44px",
} as const;

function PasswordVisibilityToggle({
  visible,
  onToggle,
  label,
}: {
  visible: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
    >
      {visible ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

export default function ParentRegister() {
  const router = useRouter();
  const [guardian1Name, setGuardian1Name] = useState("");
  const [guardian1Type, setGuardian1Type] = useState<"parent" | "guardian">("parent");
  const [guardian2Name, setGuardian2Name] = useState("");
  const [guardian2Type, setGuardian2Type] = useState<"parent" | "guardian">("parent");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const showLoginLink = error != null && isEmailAlreadyRegisteredMessage(error);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const name = guardian1Name.trim();
      const emailTrimmed = email.trim();

      if (!name) {
        throw new Error("Parent/Guardian name is required");
      }
      const passwordValidationError = validateParentPassword(password);
      if (passwordValidationError) {
        throw new Error(passwordValidationError);
      }
      const confirmValidationError = validatePasswordConfirm(password, confirmPassword);
      if (confirmValidationError) {
        throw new Error(confirmValidationError);
      }
      if (!timezone) {
        throw new Error("Please select a timezone");
      }

      return registerParent({
        email: emailTrimmed,
        name,
        password,
        country: COUNTRY,
        timeZone: timezone,
        guardianType: guardian1Type,
        ...(guardian2Name.trim()
          ? {
              secondaryGuardianName: guardian2Name.trim(),
              secondaryGuardianType: guardian2Type,
            }
          : {}),
      });
    },
    onSuccess: (user) => {
      setPendingVerification({ userId: user.id, email: user.email });
      startResendCooldown();
      const params = new URLSearchParams({
        id: String(user.id),
        email: user.email,
      });
      router.push(`/verify-email?${params.toString()}`);
    },
    onError: (err) => {
      setError(getApiErrorMessage(err));
    },
  });

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (passwordError) {
      setPasswordError(validateParentPassword(value));
    }
    if (confirmPasswordError && confirmPassword) {
      setConfirmPasswordError(validatePasswordConfirm(value, confirmPassword));
    }
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value);
    if (confirmPasswordError) {
      setConfirmPasswordError(validatePasswordConfirm(password, value));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const passwordValidationError = validateParentPassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    setPasswordError(null);

    const confirmValidationError = validatePasswordConfirm(password, confirmPassword);
    if (confirmValidationError) {
      setConfirmPasswordError(confirmValidationError);
      return;
    }
    setConfirmPasswordError(null);

    if (!timezone) {
      setError("Please select a timezone");
      return;
    }

    registerMutation.mutate();
  }

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
            Courses Created for
            <br />
            Your Child&apos;s Path
          </h1>
          <p
            className="text-white/70 text-lg mt-3 max-w-[350px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Thoughtfully designed lessons that adapt to your Child&apos;s needs and interests to grow skills, understanding and independence.
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

      {/* Right Half - full screen on mobile */}
      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[480px] lg:max-w-none px-6 pt-4 pb-6 sm:p-8 lg:px-20 lg:py-6">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-3">
            <ThayloBrandLink size="sm" />
          </div>

          {/* Step Progress Bar */}
          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto mb-4">
            {/* Progress bar first */}
            <div className="w-full h-[6px] bg-[#313044] rounded-full overflow-hidden mb-3">
              <div className="h-full w-1/4 bg-[#00CED1] rounded-full" />
            </div>
            {/* Back arrow + step info */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="text-white/70 hover:text-white text-2xl cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                &#8249;
              </button>
              <div className="text-right">
                <span
                  className="block text-white/70 text-sm font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  STEP 01/04
                </span>
                <span
                  className="block text-[#00CED1] text-sm font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Family register
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto">
            {/* Form Card */}
            <div className="rounded-[16px] p-5 border border-[#525162]/50 lg:bg-transparent lg:rounded-[19px] lg:border lg:border-[#525162]/50 lg:px-8 lg:py-6">
              <h2
                className="text-white text-lg sm:text-xl font-semibold mb-4 tracking-wide uppercase text-center"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Family Register
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Parent/Guardian #1 */}
                <div>
                  <label
                    className="block text-[14px] font-semibold text-white mb-1.5"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Parent/Guardian #1
                  </label>
                  <input
                    type="text"
                    value={guardian1Name}
                    onChange={(e) => setGuardian1Name(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full rounded-[40px] bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                    style={{ fontFamily: "Inter, sans-serif", padding: "12px 20px", height: "44px" }}
                  />
                  {/* Parent / Guardian Toggle */}
                  <div className="flex gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={() => setGuardian1Type("parent")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-[40px] py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        guardian1Type === "parent"
                          ? "bg-[#313044] text-white border border-[#00CED1]"
                          : "bg-[#313044] text-white/50 border border-transparent"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border-2 ${guardian1Type === "parent" ? "border-[#00CED1] bg-[#00CED1]" : "border-white/30"}`} />
                      Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuardian1Type("guardian")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-[40px] py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        guardian1Type === "guardian"
                          ? "bg-[#313044] text-white border border-[#00CED1]"
                          : "bg-[#313044] text-white/50 border border-transparent"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border-2 ${guardian1Type === "guardian" ? "border-[#00CED1] bg-[#00CED1]" : "border-white/30"}`} />
                      Guardian
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="py-3"><div className="border-t border-[#525162]/50" /></div>

                {/* Parent/Guardian #2 (Optional) */}
                <div>
                  <label
                    className="block text-[14px] font-semibold text-white mb-1.5"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Parent/Guardian #2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={guardian2Name}
                    onChange={(e) => setGuardian2Name(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-[40px] bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                    style={{ fontFamily: "Inter, sans-serif", padding: "12px 20px", height: "44px" }}
                  />
                  {/* Parent / Guardian Toggle */}
                  <div className="flex gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={() => setGuardian2Type("parent")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-[40px] py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        guardian2Type === "parent"
                          ? "bg-[#313044] text-white border border-[#00CED1]"
                          : "bg-[#313044] text-white/50 border border-transparent"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border-2 ${guardian2Type === "parent" ? "border-[#00CED1] bg-[#00CED1]" : "border-white/30"}`} />
                      Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuardian2Type("guardian")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-[40px] py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                        guardian2Type === "guardian"
                          ? "bg-[#313044] text-white border border-[#00CED1]"
                          : "bg-[#313044] text-white/50 border border-transparent"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border-2 ${guardian2Type === "guardian" ? "border-[#00CED1] bg-[#00CED1]" : "border-white/30"}`} />
                      Guardian
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="py-3"><div className="border-t border-[#525162]/50" /></div>

                {/* Email address */}
                <div>
                  <label
                    className="block text-[14px] font-semibold text-white mb-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="JaneDoe@gmail.com"
                    required
                    className="w-full rounded-[40px] bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                    style={{ fontFamily: "Inter, sans-serif", padding: "12px 20px", height: "44px" }}
                  />
                </div>

                {/* Phone number */}
                <div>
                  <label
                    className="block text-[14px] font-semibold text-white mb-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder={PHONE_INPUT_PLACEHOLDER}
                    maxLength={12}
                    className="w-full rounded-[40px] bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                    style={{ fontFamily: "Inter, sans-serif", padding: "12px 20px", height: "44px" }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/70 mb-2"
                    style={inter}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onBlur={() => setPasswordError(validateParentPassword(password))}
                      placeholder="••••••••"
                      required
                      aria-invalid={passwordError ? true : undefined}
                      aria-describedby="password-requirements"
                      className={`w-full px-4 py-3 sm:py-3.5 pr-12 rounded-full bg-[#313044] text-white text-sm outline-none border transition-colors placeholder:text-white/30 ${
                        passwordError
                          ? "border-red-400/70 focus:border-red-400/70"
                          : "border-transparent focus:border-[#00CED1]/40"
                      }`}
                      style={inter}
                    />
                    <PasswordVisibilityToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                      label={showPassword ? "Hide password" : "Show password"}
                    />
                  </div>
                  <p
                    id="password-requirements"
                    className={`mt-1.5 text-xs ${passwordError ? "text-red-400" : "text-white/40"}`}
                    style={inter}
                  >
                    {passwordError ?? PARENT_PASSWORD_REQUIREMENTS}
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white/70 mb-2"
                    style={inter}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      onBlur={() => setConfirmPasswordError(validatePasswordConfirm(password, confirmPassword))}
                      placeholder="••••••••"
                      required
                      aria-invalid={confirmPasswordError ? true : undefined}
                      className={`w-full px-4 py-3 sm:py-3.5 pr-12 rounded-full bg-[#313044] text-white text-sm outline-none border transition-colors placeholder:text-white/30 ${
                        confirmPasswordError
                          ? "border-red-400/70 focus:border-red-400/70"
                          : "border-transparent focus:border-[#00CED1]/40"
                      }`}
                      style={inter}
                    />
                    <PasswordVisibilityToggle
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((prev) => !prev)}
                      label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    />
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-1.5 text-xs text-red-400" style={inter}>
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                {/* Country & Timezone */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label
                      className="block text-[14px] font-semibold text-white mb-1"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      value={COUNTRY}
                      readOnly
                      tabIndex={-1}
                      className={`${fieldInputClass} text-white/60 cursor-not-allowed`}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="timezone"
                      className="block text-[14px] font-semibold text-white mb-1"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      value={timezone}
                      onChange={(e) => {
                        setTimezone(e.target.value);
                        if (error) setError(null);
                      }}
                      required
                      className={`${fieldInputClass} cursor-pointer appearance-none`}
                      style={fieldInputStyle}
                    >
                      <option value="" disabled className="bg-[#313044] text-white/50">
                        Select timezone
                      </option>
                      {US_TIMEZONES.map((tz) => (
                        <option
                          key={tz.value}
                          value={tz.value}
                          className="bg-[#313044] text-white"
                        >
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <div
                    className="text-sm text-red-400 text-center"
                    style={inter}
                    role="alert"
                  >
                    <p>{error}</p>
                    {showLoginLink && (
                      <p className="mt-2 text-white/60">
                        Already started signing up?{" "}
                        <Link
                          href="/parent-sign-in"
                          className="text-[#00CED1] font-medium hover:underline"
                        >
                          Sign in
                        </Link>{" "}
                        to verify your email or continue.
                      </p>
                    )}
                  </div>
                )}

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {registerMutation.isPending ? "Creating account…" : "Continue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
