"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginChild } from "@/lib/child-api";
import { getApiErrorMessage } from "@/lib/auth-api";
import { setChildSession } from "@/lib/auth-session";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function ChildSignIn() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    onSuccess: () => {
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
      className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
      style={{
        backgroundColor: "#313044",
        boxShadow: "0px 5px 0px 0px #424056",
        ...inter,
        fontWeight: 600,
        fontSize: "28px",
        lineHeight: "32px",
        color: "#FFFFFF",
      }}
    >
      {num}
    </button>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#111023] relative">
      {/* Logo */}
      <div className="px-6 pt-3 lg:px-10 lg:pt-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={48}
            height={48}
            className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
          />
          <div className="leading-none">
            <span
              className="block text-[18px] lg:text-[20px] font-medium tracking-[0.08em]"
              style={{
                background: "linear-gradient(90deg, #60D624, #00A19A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              THAYLO
            </span>
            <span className="block text-[7px] lg:text-[8px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
              GLOBAL AI SCHOOL
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-2">
        {/* Welcome Text */}
        <p className="text-[#00CED1] text-sm mb-1" style={inter}>
          Welcome back
        </p>
        <h1
          className="text-white text-2xl lg:text-[36px] font-bold mb-3"
          style={inter}
        >
          Ready to learn?
        </h1>

        {/* Username Field */}
        <div className="w-full max-w-[320px] mb-3">
          <label className="block text-xs font-semibold text-white mb-1" style={inter}>
            Use Name
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
            style={inter}
          />
        </div>

        {/* PIN Card */}
        <div
          className="w-full max-w-[320px] rounded-[19px] border border-[#525162]/50 flex flex-col items-center px-8 pt-5 pb-4"
          style={{ backgroundColor: "#111023" }}
        >
          <p className="text-white text-base font-semibold mb-3" style={inter}>
            Enter your Pin
          </p>

          {/* Pin Dots */}
          <div className="flex items-center gap-2.5 mb-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < pin.length ? "bg-[#00CED1]" : "bg-[#525162]"
                }`}
              />
            ))}
          </div>

          {/* Number Pad */}
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5 justify-center">
              {[1, 2, 3].map((n) => <NumButton key={n} num={n} onClick={() => handleNumberPress(n)} />)}
            </div>
            <div className="flex gap-2.5 justify-center">
              {[4, 5, 6].map((n) => <NumButton key={n} num={n} onClick={() => handleNumberPress(n)} />)}
            </div>
            <div className="flex gap-2.5 justify-center">
              {[7, 8, 9].map((n) => <NumButton key={n} num={n} onClick={() => handleNumberPress(n)} />)}
            </div>
            <div className="flex gap-2.5 justify-center">
              {/* Backspace */}
              <button
                type="button"
                onClick={handleBackspace}
                className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#313044", boxShadow: "0px 5px 0px 0px #424056" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>
              {/* 0 */}
              <NumButton num={0} onClick={() => handleNumberPress(0)} />
              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#00CED1" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center mt-3" role="alert" style={inter}>
              {error}
            </p>
          )}

          {/* Forget PIN */}
          <button
            type="button"
            className="text-[#00CED1] text-sm font-medium mt-4 cursor-pointer hover:underline"
            style={inter}
            disabled={loginMutation.isPending}
          >
            Forget PIN?
          </button>
        </div>
      </div>

      {/* Character Image - right side desktop only */}
      <div className="hidden lg:block absolute right-6 bottom-0 pointer-events-none">
        <Image
          src="/assets/child login.png"
          alt="Child character"
          width={280}
          height={400}
          className="w-[220px] h-auto object-contain"
        />
      </div>
    </div>
  );
}
