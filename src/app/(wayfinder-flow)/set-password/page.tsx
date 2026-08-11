"use client";

import React, { FormEvent, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  setWayfinderPassword,
  validateResetToken,
} from "@/lib/auth-api";
import { useNotifyError } from "@/hooks/use-notify-error";
import { notify } from "@/lib/notify";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";
import PasswordInput from "@/components/shared/PasswordInput";

const inter = { fontFamily: "Inter, sans-serif" } as const;
const MIN_PASSWORD_LENGTH = 8;

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const tokenQuery = useQuery({
    queryKey: ["validate-wayfinder-setup-token", token],
    queryFn: () => validateResetToken(token),
    enabled: token.length > 0,
    retry: false,
  });

  const setupMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (newPassword.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      }
      await setWayfinderPassword({
        token,
        newPassword,
        confirmPassword,
      });
    },
    onSuccess: () => {
      router.push("/wayfinder-sign-in?setup=1");
    },
    onError: (err) => {
      notify.error(err);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setupMutation.mutate();
  }

  const isBusy = setupMutation.isPending;
  const tokenMissing = !token;
  const tokenValidating = !tokenMissing && tokenQuery.isLoading;
  const tokenInvalid =
    !tokenMissing && !tokenQuery.isLoading && tokenQuery.isError;
  const tokenWrongRole =
    !tokenMissing &&
    !tokenQuery.isLoading &&
    tokenQuery.isSuccess &&
    tokenQuery.data?.data?.role !== "WAY_FINDER";
  const tokenReady =
    !tokenMissing &&
    !tokenQuery.isLoading &&
    tokenQuery.isSuccess &&
    tokenQuery.data?.data?.role === "WAY_FINDER";

  useNotifyError(tokenQuery.error, tokenInvalid);

  useEffect(() => {
    if (tokenWrongRole) {
      notify.error("This setup link is not valid for a wayfinder account.");
    }
  }, [tokenWrongRole]);

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col pt-16 px-16 pb-0 overflow-hidden">
        <div className="relative z-10">
          <ThayloBrandLink />
          <h1
            className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={inter}
          >
            Welcome to
            <br />
            Thaylo Wayfinders
          </h1>
          <p className="text-white/70 text-lg mt-3 max-w-[350px]" style={inter}>
            Set your password to activate your account and start supporting
            students.
          </p>
        </div>

        <div className="relative z-10 flex justify-start mt-auto">
          <Image
            src="/assets/new-hero.png"
            alt="Wayfinder character"
            width={320}
            height={360}
            className="w-[280px] h-auto object-contain"
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00CED1]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center justify-center px-6 py-8 sm:p-12 lg:px-20">
        <div className="lg:hidden mb-8 self-start">
          <ThayloBrandLink size="sm" />
        </div>

        <div className="w-full max-w-[420px] lg:max-w-[480px]">
          <div className="rounded-[16px] p-6 border border-[#525162]/50 lg:rounded-[19px] lg:px-10 lg:py-10">
            {tokenMissing && (
              <div className="text-center space-y-4">
                <h2
                  className="text-white text-xl sm:text-2xl font-semibold tracking-wide uppercase"
                  style={inter}
                >
                  Invalid Link
                </h2>
                <p className="text-white/50 text-sm" style={inter}>
                  This setup link is missing a token. Check your invitation email
                  or contact your administrator.
                </p>
                <Link
                  href="/wayfinder-sign-in"
                  className="inline-block w-full py-4 rounded-[16px] bg-[#00CED1] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors text-center"
                  style={inter}
                >
                  Wayfinder Sign In
                </Link>
              </div>
            )}

            {tokenValidating && (
              <div className="text-center py-8">
                <p className="text-white/50 text-sm" style={inter}>
                  Verifying invitation link…
                </p>
              </div>
            )}

            {(tokenInvalid || tokenWrongRole) && (
              <div className="text-center space-y-4">
                <h2
                  className="text-white text-xl sm:text-2xl font-semibold tracking-wide uppercase"
                  style={inter}
                >
                  Link Expired
                </h2>
                <p className="text-white/50 text-sm" style={inter}>
                  {tokenWrongRole
                    ? "This setup link is not valid for a wayfinder account."
                    : "This setup link is no longer valid."}
                </p>
                <p className="text-white/40 text-xs" style={inter}>
                  Setup links expire after a limited time. Ask your administrator to
                  resend the invitation from the admin portal.
                </p>
              </div>
            )}

            {tokenReady && (
              <>
                <h2
                  className="text-white text-xl sm:text-2xl font-semibold mb-2 tracking-wide uppercase text-center"
                  style={inter}
                >
                  Set Your Password
                </h2>
                <p
                  className="text-white/50 text-sm text-center mb-8"
                  style={inter}
                >
                  Create a secure password for your wayfinder account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-white/70 mb-2"
                      style={inter}
                    >
                      Password
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      disabled={isBusy}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 sm:py-3.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30 disabled:opacity-60"
                      style={inter}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-white/70 mb-2"
                      style={inter}
                    >
                      Confirm password
                    </label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      disabled={isBusy}
                      autoComplete="new-password"
                      toggleLabel="Toggle confirm password visibility"
                      className="w-full px-4 py-3 sm:py-3.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30 disabled:opacity-60"
                      style={inter}
                    />
                  </div>

                  <p className="text-white/40 text-xs text-center" style={inter}>
                    Password must be at least {MIN_PASSWORD_LENGTH} characters.
                  </p>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full py-4 rounded-[16px] bg-[#00CED1] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    style={inter}
                  >
                    {isBusy ? "Saving…" : "Set Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
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
      <SetPasswordContent />
    </Suspense>
  );
}
