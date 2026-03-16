"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const consents = [
  "Learning data usage",
  "SEL check ins (Bloom Buddy)",
  "PDF progress reports",
  "Communication with Wayfinder",
];

export default function ParentRegisterStep4() {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean[]>(new Array(consents.length).fill(false));
  const [submitted, setSubmitted] = useState(false);

  function toggleConsent(index: number) {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  }

  function handleContinue() {
    // TODO: integrate with backend
    setSubmitted(true);
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      {/* Left Half */}
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
            {submitted ? "Play at the High School Grades" : "Support your child\u2019s learning anytime, anywhere."}
          </h1>
          <p
            className="text-white/70 text-lg mt-3 max-w-[380px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {submitted
              ? "Join fellow learners, share ideas, ask questions, and grow together on your journey."
              : "Stay connected with your child\u2019s learning at any time and from any place, highlighting flexibility, accessibility, and ongoing support."}
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
      <div className="w-full lg:w-1/2 flex-1 flex flex-col overflow-y-auto">
        <div className="px-6 pt-4 pb-6 sm:p-8 lg:px-20 lg:py-6 lg:flex-1 lg:flex lg:flex-col">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-3 flex items-center gap-2.5">
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

          {/* Step Progress Bar */}
          <div className={`w-full max-w-[420px] lg:max-w-[560px] mx-auto mb-4 ${submitted ? "hidden" : ""}`}>
            <div className="w-full h-[6px] bg-[#313044] rounded-full overflow-hidden mb-3">
              <div className="h-full w-full bg-[#00CED1] rounded-full" />
            </div>
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
                  STEP 04/04
                </span>
                <span
                  className="block text-[#00CED1] text-sm font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Consents
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto lg:flex-1 lg:flex lg:items-center">
            {submitted ? (
              /* Submitted Card */
              <div className="w-full rounded-[16px] p-8 border border-[#525162]/50 lg:rounded-[19px] lg:px-10 lg:py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-[10px] bg-[#FFF8E1] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="#F59E0B" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <h2
                  className="text-white text-lg font-bold uppercase tracking-wide mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Submitted!
                </h2>
                <p
                  className="text-white/50 text-sm max-w-[300px]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Thank you for your interest. Your application is under review. We will reach out with next steps.
                </p>
              </div>
            ) : (
              /* Form Card */
              <div className="w-full rounded-[16px] p-6 border border-[#525162]/50 lg:bg-transparent lg:rounded-[19px] lg:border lg:border-[#525162]/50 lg:px-8 lg:py-8">
                <h2
                  className="text-white text-base sm:text-lg font-semibold mb-8 tracking-wide uppercase text-center"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Permission & Consents
                </h2>

                <div className="space-y-4 mb-8">
                  {consents.map((label, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleConsent(i)}
                    >
                      <div
                        className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors shrink-0 ${
                          checked[i]
                            ? "bg-[#00CED1] border-[#00CED1]"
                            : "border-[#525162] bg-transparent"
                        }`}
                      >
                        {checked[i] && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-white/80 text-sm"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
