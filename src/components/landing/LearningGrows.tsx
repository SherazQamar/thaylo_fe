import React from "react";
import Button from "@/components/ui/Button";

export default function LearningGrows() {
  return (
    <section className="py-16 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#F1F5F9] rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A2B3D] leading-tight">
              Learning That Grows With Your Child
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Providing easy AI learning that helps to build real skills fast and
              smart.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="teal" className="text-sm px-5 py-2.5">
                Start Your Trial
              </Button>
              <Button variant="outline-dark" className="text-sm px-5 py-2.5">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right - Image collage placeholder */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-[360px] h-[240px]">
              {/* Stacked image placeholders */}
              <div className="absolute top-0 left-4 w-[140px] h-[180px] rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 rotate-[-6deg] shadow-lg" />
              <div className="absolute top-2 left-[100px] w-[140px] h-[180px] rounded-2xl bg-gradient-to-br from-blue-200 to-blue-300 rotate-[3deg] shadow-lg" />
              <div className="absolute top-4 left-[190px] w-[140px] h-[180px] rounded-2xl bg-gradient-to-br from-rose-200 to-rose-300 rotate-[8deg] shadow-lg" />
              {/* Thaylo avatar */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#60D624] to-[#00696B] border-2 border-white flex items-center justify-center shadow-lg z-10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
