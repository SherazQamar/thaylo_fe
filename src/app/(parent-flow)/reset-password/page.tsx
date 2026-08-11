"use client";

import React, { FormEvent, Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  resetPassword,
  validateResetToken,
} from "@/lib/auth-api";
import { useNotifyError } from "@/hooks/use-notify-error";
import { notify } from "@/lib/notify";
import { getSignInPathForRole } from "@/lib/portal-auth";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";
import PasswordInput from "@/components/shared/PasswordInput";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const tokenQuery = useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: () => validateResetToken(token),
    enabled: token.length > 0,
    retry: false,
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
    },
    onSuccess: () => {
      const role = tokenQuery.data?.data?.role;
      router.push(`${getSignInPathForRole(role)}?reset=1`);
    },
    onError: (err) => {
      notify.error(err);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    resetMutation.mutate();
  }

  const isBusy = resetMutation.isPending;
  const tokenMissing = !token;
  const tokenValidating = !tokenMissing && tokenQuery.isLoading;
  const tokenInvalid =
    !tokenMissing && !tokenQuery.isLoading && tokenQuery.isError;
  const tokenReady =
    !tokenMissing && !tokenQuery.isLoading && tokenQuery.isSuccess;

  useNotifyError(tokenQuery.error, tokenInvalid);

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col pt-16 px-16 pb-0 overflow-hidden">
        <div className="relative z-10">
          <ThayloBrandLink />
          <h1
            className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={inter}
          >
            Reset Your
            <br />
            Password
          </h1>
          <p className="text-white/70 text-lg mt-3 max-w-[350px]" style={inter}>
            Choose a new password to secure your parent account.
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
                  This reset link is missing a token. Request a new password
                  reset email from sign in.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/wayfinder-sign-in"
                    className="inline-block w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors text-center"
                    style={inter}
                  >
                    Wayfinder Sign In
                  </Link>
                  <Link
                    href="/parent-sign-in"
                    className="inline-block w-full py-3 rounded-[12px] border border-[#00CED1]/40 text-[#00CED1] text-sm font-semibold uppercase tracking-wide hover:bg-[#00CED1]/10 transition-colors text-center"
                    style={inter}
                  >
                    Parent Sign In
                  </Link>
                </div>
              </div>
            )}

            {tokenValidating && (
              <div className="text-center py-8">
                <p className="text-white/50 text-sm" style={inter}>
                  Verifying reset link…
                </p>
              </div>
            )}

            {tokenInvalid && (
              <div className="text-center space-y-4">
                <h2
                  className="text-white text-xl sm:text-2xl font-semibold tracking-wide uppercase"
                  style={inter}
                >
                  Link Expired
                </h2>
                <p className="text-white/50 text-sm" style={inter}>
                  This reset link is no longer valid.
                </p>
                <p className="text-white/40 text-xs" style={inter}>
                  Reset links expire after 15 minutes. Request a new one from
                  sign in.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/wayfinder-sign-in"
                    className="inline-block w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors text-center"
                    style={inter}
                  >
                    Wayfinder Sign In
                  </Link>
                  <Link
                    href="/parent-sign-in"
                    className="inline-block w-full py-3 rounded-[12px] border border-[#00CED1]/40 text-[#00CED1] text-sm font-semibold uppercase tracking-wide hover:bg-[#00CED1]/10 transition-colors text-center"
                    style={inter}
                  >
                    Parent Sign In
                  </Link>
                </div>
              </div>
            )}

            {tokenReady && (
              <>
                <h2
                  className="text-white text-xl sm:text-2xl font-semibold mb-8 tracking-wide uppercase text-center"
                  style={inter}
                >
                  Enter New Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-white/70 mb-2"
                      style={inter}
                    >
                      New password
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      required
                      minLength={6}
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
                      Confirm new password
                    </label>
                    <PasswordInput
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      required
                      minLength={6}
                      disabled={isBusy}
                      autoComplete="new-password"
                      toggleLabel="Toggle confirm password visibility"
                      className="w-full px-4 py-3 sm:py-3.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30 disabled:opacity-60"
                      style={inter}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy}
                    className="w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    style={inter}
                  >
                    {isBusy ? "Resetting…" : "Reset Password"}
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

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}
