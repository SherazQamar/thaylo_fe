"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginChild } from "@/lib/child-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { setChildSession } from "@/lib/auth-session";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function ChildSignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const name = username.trim();
      const pinStr = pin.join("");

      if (!name) {
        throw new Error("Username is required");
      }
      if (pinStr.length !== 6) {
        throw new Error("PIN must be 6 digits");
      }

      const { child, accessToken } = await loginChild(name, pinStr);
      setChildSession(accessToken, child);
      return child;
    },
    onSuccess: async () => {
      router.push("/child-dashboard");
    },
    onError: (err) => {
      setError(getApiErrorMessage(err));
    },
  });

  function handleNumberPress(num: number) {
    if (loginMutation.isPending) return;
    if (pin.length < 6) {
      const newPin = [...pin, num];
      setPin(newPin);
    }
  }

  function handleBackspace() {
    if (loginMutation.isPending) return;
    setPin((prev) => prev.slice(0, -1));
  }

  function handleSubmit() {
    if (loginMutation.isPending) return;
    setError(null);
    loginMutation.mutate();
  }

  const NumButton = ({ num, onClick }: { num: number; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="size-[52px] lg:w-[60px] lg:h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0"
      style={{
        backgroundColor: "#313044",
        boxShadow: "0px 5px 0px 0px #424056",
        ...inter,
        fontWeight: 600,
        fontSize: "31px",
        lineHeight: "34px",
        color: "#FFFFFF",
      }}
    >
      {num}
    </button>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#111023] relative">
      {/* Header — Figma mobile: logo left, menu right */}
      <div className="px-6 pt-5 lg:px-10 lg:pt-4 flex-shrink-0 flex items-center justify-between w-full max-w-[375px] lg:max-w-none mx-auto lg:mx-0">
        <ThayloBrandLink size="sm" className="gap-[5px] lg:[&_img]:w-12 lg:[&_img]:h-12" />
        <span className="lg:hidden relative size-6 shrink-0" aria-hidden>
          <Image
            src="/assets/child-sign-in/menu.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
            unoptimized
          />
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-6 pt-8 lg:pt-2 pb-2 w-full max-w-[375px] lg:max-w-none mx-auto lg:mx-0">
        <div className="w-full max-w-[327px] lg:max-w-[320px] flex flex-col items-center gap-[25px] lg:gap-3">
          {/* Welcome Text */}
          <div className="flex flex-col items-center gap-3 lg:gap-1 text-center">
            <p
              className="text-[#A5ABB3] text-[26px] leading-8 lg:text-sm lg:leading-normal lg:text-[#00CED1]"
              style={inter}
            >
              Welcome back
            </p>
            <h1
              className="text-white text-[41px] leading-[48px] font-semibold lg:text-2xl lg:leading-normal lg:font-bold lg:text-[36px]"
              style={inter}
            >
              Ready to learn?
            </h1>
          </div>

          {/* Username Field */}
          <div className="w-full">
            <label
              className="block text-xs font-semibold text-white mb-1 lg:mb-1"
              style={inter}
            >
              Use Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-[27px] py-[18px] lg:px-4 lg:py-2.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30 shadow-[0px_5px_0px_0px_#424056] lg:shadow-none"
              style={inter}
            />
          </div>

          {/* PIN Card */}
          <div
            className="w-full rounded-[13px] lg:rounded-[19px] border border-[#424056] lg:border-[#525162]/50 flex flex-col items-center px-[27px] pt-[37px] pb-[26px] lg:px-8 lg:pt-5 lg:pb-4 gap-[26px] lg:gap-0 shadow-[0px_0px_1.3px_rgba(182,182,182,0.3)] lg:shadow-none"
            style={{ backgroundColor: "#111023" }}
          >
            <p
              className="text-[#A5ABB3] text-[21px] leading-6 text-center lg:text-white lg:text-base lg:font-semibold lg:mb-3 lg:leading-normal"
              style={inter}
            >
              Enter your Pin
            </p>

            {/* Pin Dots — Figma capsule */}
            <div
              className="flex items-center justify-center gap-[10px] h-[21px] px-[18px] rounded-full bg-[#313044] shadow-[0px_5px_0px_0px_#424056] lg:h-auto lg:px-0 lg:bg-transparent lg:shadow-none lg:mb-4 lg:gap-2.5"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`size-[10.5px] lg:w-3 lg:h-3 rounded-full transition-colors ${
                    i < pin.length ? "bg-[#00CED1]" : "bg-[#525162]"
                  }`}
                />
              ))}
            </div>

            {/* Number Pad */}
            <div className="flex flex-col gap-4 lg:gap-2.5">
              <div className="flex gap-[27px] lg:gap-2.5 justify-center">
                {[1, 2, 3].map((n) => (
                  <NumButton key={n} num={n} onClick={() => handleNumberPress(n)} />
                ))}
              </div>
              <div className="flex gap-[27px] lg:gap-2.5 justify-center">
                {[4, 5, 6].map((n) => (
                  <NumButton key={n} num={n} onClick={() => handleNumberPress(n)} />
                ))}
              </div>
              <div className="flex gap-[27px] lg:gap-2.5 justify-center">
                {[7, 8, 9].map((n) => (
                  <NumButton key={n} num={n} onClick={() => handleNumberPress(n)} />
                ))}
              </div>
              <div className="flex gap-[27px] lg:gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="size-[52px] lg:w-[60px] lg:h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                  style={{
                    backgroundColor: "#313044",
                    boxShadow: "0px 5px 0px 0px #424056",
                  }}
                  aria-label="Backspace"
                >
                  <Image
                    src="/assets/child-sign-in/backspace.svg"
                    alt=""
                    width={21}
                    height={21}
                    className="size-[21px]"
                    unoptimized
                  />
                </button>
                <NumButton num={0} onClick={() => handleNumberPress(0)} />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="size-[52px] lg:w-[60px] lg:h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                  style={{
                    backgroundColor: "#00CED1",
                    boxShadow: "0px 5px 0px 0px #01A8AB",
                  }}
                  aria-label="Submit"
                >
                  <Image
                    src="/assets/child-sign-in/submit-arrow.svg"
                    alt=""
                    width={21}
                    height={21}
                    className="size-[21px]"
                    unoptimized
                  />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center" role="alert" style={inter}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowForgotPinModal(true)}
              className="text-[#00CED1] text-[16px] leading-[18px] font-semibold lg:text-sm lg:font-medium lg:mt-4 cursor-pointer hover:underline"
              style={inter}
              disabled={loginMutation.isPending}
            >
              Forget PIN?
            </button>
          </div>
        </div>
      </div>

      {showForgotPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowForgotPinModal(false)}
            aria-hidden
          />
          <div
            className="relative w-full max-w-md rounded-[20px] border border-[#525162]/50 bg-[#313044] p-6 text-center"
            style={inter}
            role="dialog"
            aria-labelledby="forgot-pin-title"
            aria-describedby="forgot-pin-message"
          >
            <h2 id="forgot-pin-title" className="text-white text-lg font-semibold">
              Forgot your PIN?
            </h2>
            <p id="forgot-pin-message" className="text-white/70 text-sm mt-3 leading-relaxed">
              Please ask your parent to reset your PIN from their parent account.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotPinModal(false)}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#00CED1] text-[#111023] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Character Image - right side desktop only */}
      <div className="hidden lg:block absolute right-6 bottom-0 pointer-events-none">
        <Image
          src="/assets/new-hero.png"
          alt="Thaylo character"
          width={280}
          height={400}
          className="w-[220px] h-auto object-contain"
        />
      </div>
    </div>
  );
}
