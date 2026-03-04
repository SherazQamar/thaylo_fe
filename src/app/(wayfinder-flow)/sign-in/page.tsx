"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

export default function WayfinderSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: integrate with auth backend
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Half */}
      <div className="relative w-full lg:w-1/2 bg-[#313044] flex flex-col p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Logo + Text grouped together */}
        <div className="relative z-10">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={140}
            height={140}
            className="h-[70px] w-auto object-contain"
          />
          <h1
            className="text-white text-[28px] sm:text-[32px] lg:text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Thaylo Wayfinders
            <br />
            Grow Learning
          </h1>
          <p
            className="text-white/70 text-base sm:text-lg mt-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            You help students find their way.
          </p>
        </div>

        {/* Character Image - pushed to bottom */}
        <div className="relative z-10 flex justify-center lg:justify-start mt-auto">
          <Image
            src="/assets/wayfinder Em.png"
            alt="Wayfinder character"
            width={320}
            height={360}
            className="w-[200px] sm:w-[260px] lg:w-[280px] h-auto object-contain"
          />
        </div>

        {/* Subtle glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00CED1]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Right Half */}
      <div className="w-full lg:w-1/2 bg-[#111023] flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px]">
          <h2
            className="text-white text-2xl sm:text-3xl font-semibold mb-2 tracking-wide uppercase"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Welcome to Thaylo
          </h2>
          <p
            className="text-white/50 text-sm mb-10"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Sign in to your Wayfinder account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Aliea@gmail.com"
                required
                className="w-full px-4 py-3.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
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
                className="w-full px-4 py-3.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
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
              className="w-full py-4 rounded-lg bg-[#00CED1] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Sign In
            </button>
          </form>

          {/* Create Account */}
          <p
            className="text-center text-white/50 text-sm mt-8"
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
