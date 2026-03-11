"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WayfinderSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("sheraz@gmail.com");
  const [password, setPassword] = useState("123456");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      {/* Left Half - hidden on mobile */}
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col p-16 overflow-hidden">
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
              <span className="block text-[20px] font-medium tracking-[0.08em]" style={{ background: "linear-gradient(90deg, #60D624, #00A19A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                THAYLO
              </span>
              <span className="block text-[8px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
                GLOBAL AI SCHOOL
              </span>
            </div>
          </div>
          <h1
            className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Thaylo Wayfinders
            <br />
            Grow Learning
          </h1>
          <p
            className="text-white/70 text-lg mt-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            You help students find their way.
          </p>
        </div>

        <div className="relative z-10 flex justify-start mt-auto">
          <Image
            src="/assets/wayfinder Em.png"
            alt="Wayfinder character"
            width={320}
            height={360}
            className="w-[280px] h-auto object-contain"
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00CED1]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Right Half - full screen on mobile */}
      <div className="w-full lg:w-1/2 flex-1 flex flex-col px-6 pt-6 pb-8 sm:p-12 lg:p-16 lg:items-center lg:justify-center">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10 flex items-center gap-2.5">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="leading-none">
            <span className="block text-[18px] font-medium tracking-[0.08em]" style={{ background: "linear-gradient(90deg, #60D624, #00A19A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              THAYLO
            </span>
            <span className="block text-[7px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
              GLOBAL AI SCHOOL
            </span>
          </div>
        </div>

        <div className="w-full max-w-[420px] lg:max-w-[669px]">
          {/* Form Card */}
          <div className="rounded-[16px] lg:rounded-[19px] p-6 lg:p-[45px] lg:border lg:border-[#313044] bg-[rgba(49,48,68,0.4)] lg:!bg-[#111023]">
            <h2
              className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 tracking-wide uppercase"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Welcome to Thaylo
            </h2>
            <p
              className="text-white/50 text-sm mb-8 sm:mb-10"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Sign in to your Wayfinder account
            </p>

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
                <Link
                  href="#"
                  className="text-[13px] text-[#00CED1] underline font-normal"
                  style={{ fontFamily: "Inter, sans-serif", lineHeight: "20px" }}
                >
                  Forget Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#00CED1] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Sign In
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
              href="#"
              className="text-[#00CED1] font-medium hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
