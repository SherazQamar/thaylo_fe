import React from "react";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

export default function SupportSystem() {
  return (
    <section id="learning-model" className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-[1320px] mx-auto">
        <SectionLabel text="WHY US" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-4 mb-16 text-[#1A2B3D]">
          The Thaylo Learning Support System
        </h2>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left Column */}
          <div className="space-y-12">
            {/* AI Instructor */}
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1A2B3D] mb-2">
                AI Instructor
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                A personalized, human-appearing AI Instructor delivers
                structured lessons aligned to mastery-based expectations.
                Students have some choice in selecting the Instructor&apos;s
                appearance while instruction remains grounded in human pedagogy
                and curriculum.
              </p>
            </div>

            {/* Calyx */}
            <div className="pt-4 border-t border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1A2B3D] mb-2">
                Calyx, Your Bloom Buddy
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Calyx supports focus and reflection through simple check-ins
                that help students notice how they&apos;re feeling so they can
                fully engage with learning.
              </p>
            </div>
          </div>

          {/* Center - Character */}
          <div className="flex justify-center items-center">
            <Image
              src="/assets/character-jumping.png"
              alt="Thaylo Character"
              width={400}
              height={450}
              className="w-[280px] lg:w-[340px] h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-end text-right">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] flex items-center justify-center mb-4 ml-auto">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1A2B3D] mb-2">
                Wayfinder Support
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                A real educator oversees progress, intervenes when learning
                stalls, and partners with families when human attention is
                needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
