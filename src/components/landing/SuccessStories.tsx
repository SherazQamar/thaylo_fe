import React from "react";
import SectionLabel from "@/components/ui/SectionLabel";

export default function SuccessStories() {
  return (
    <section className="snap-section py-12 px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="SUCCESS STORIES" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-16 text-[#1A2B3D]">
          What We&apos;re Measuring
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Metrics Image Card */}
          <div className="relative rounded-2xl overflow-hidden min-h-[260px] bg-gradient-to-br from-blue-200 to-blue-300">
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D2E]/80 to-transparent" />
            <div className="relative z-10 p-8 flex flex-col justify-start h-full">
              <div className="bg-[#14B8A6] text-white text-sm font-normal px-4 py-2 rounded-lg inline-block max-w-fit">
                Pilot metrics will be shared
                <br />
                as data becomes available
              </div>
            </div>
          </div>

          {/* Design Principles Card */}
          <div className="bg-[#F1F5F9] rounded-2xl p-8 flex flex-col justify-center">
            <h3 className="text-xl font-normal text-[#1A2B3D] mb-4">
              From Our Design Principles
            </h3>
            <p className="text-[#6B7280] leading-relaxed">
              Thaylo is designed to balance rigor with flexibility—so students
              can engage deeply with learning at times and in places that work
              for their families, without lowering expectations.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
