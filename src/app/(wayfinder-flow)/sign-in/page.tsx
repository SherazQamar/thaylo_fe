"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const roles = [
  { label: "Child", value: "child", route: "/child-sign-in" },
  { label: "Parent", value: "parent", route: "/parent-sign-in" },
  { label: "Way finder", value: "wayfinder", route: "/wayfinder-sign-in" },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  function handleContinue() {
    const role = roles.find((r) => r.value === selected);
    if (role) {
      router.push(role.route);
    }
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      {/* Left Half - hidden on mobile */}
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col pt-16 px-16 pb-0 overflow-hidden">
        <div className="relative z-10">
          <ThayloBrandLink />
          <h1
            className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={inter}
          >
            Thaylo Wayfinders Grow Learning
          </h1>
          <p className="text-white/70 text-lg mt-3" style={inter}>
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

      {/* Right Half */}
      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center justify-center px-6 pt-6 pb-8 sm:p-12 lg:px-20 lg:py-16">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10 self-start">
          <ThayloBrandLink size="sm" />
        </div>

        <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto">
          {/* Card */}
          <div className="rounded-[16px] p-6 border border-[#525162]/50 lg:bg-transparent lg:rounded-[19px] lg:border lg:border-[#525162]/50 lg:px-10 lg:py-10">
            <h2
              className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-8 sm:mb-10 tracking-wide uppercase text-center"
              style={inter}
            >
              Welcome to Thaylo
            </h2>

            <div className="space-y-5">
              {/* Who you are? */}
              <p
                className="text-white/70 text-sm font-medium"
                style={inter}
              >
                Who you are?
              </p>

              {/* Role Options */}
              <div className="flex flex-col gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelected(role.value)}
                    className={`flex items-center gap-3 w-full rounded-full px-5 py-3.5 transition-colors cursor-pointer ${
                      selected === role.value
                        ? "bg-[#313044] border border-[#00CED1]"
                        : "bg-[#313044] border border-transparent"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selected === role.value
                          ? "border-[#00CED1]"
                          : "border-white/30"
                      }`}
                    >
                      {selected === role.value && (
                        <span className="w-2 h-2 rounded-full bg-[#00CED1]" />
                      )}
                    </span>
                    <span
                      className="text-white text-sm font-medium"
                      style={inter}
                    >
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!selected}
                className={`w-full py-3.5 sm:py-4 rounded-[16px] text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer mt-4 ${
                  selected
                    ? "bg-[#00CED1] text-white hover:bg-[#00B8BB]"
                    : "bg-[#00CED1]/50 text-white/50 cursor-not-allowed"
                }`}
                style={inter}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
