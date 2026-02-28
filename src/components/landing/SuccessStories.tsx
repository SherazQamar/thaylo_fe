import React from "react";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

export default function SuccessStories() {
  return (
    <section className="snap-section py-12 px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="SUCCESS STORIES" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-16 text-[#1A2B3D]">
          Real Growth. Real Confidence.
        </h2>

        <div className="grid md:grid-cols-[25%_1fr] gap-6 items-stretch">
          {/* Metrics Image Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0B1D2E] h-[320px] flex flex-col">
            {/* Background pattern */}
            <Image
              src="/assets/testimonial-bg-pattern.png"
              alt=""
              fill
              className="object-cover opacity-70"
            />
            {/* Text */}
            <div className="relative z-10 px-5 pt-6 pb-4 text-center">
              <p className="text-white text-xl font-medium leading-tight">
                90% of Students Succeed
                <br />
                Thanks to AI Learning
              </p>
            </div>
            {/* Photo */}
            <div className="relative z-10 flex-1 mx-4 mb-4 rounded-xl overflow-hidden">
              <Image
                src="/assets/four-diverse-young-adults.png"
                alt="Diverse young adults celebrating"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Design Principles Card */}
          <div className="bg-[#F1F5F9] rounded-2xl p-10 lg:p-12 flex flex-col justify-center h-[320px]">
            <p className="text-[#1A2B3D] text-lg md:text-xl leading-relaxed font-normal font-[family-name:var(--font-inter)] mb-6">
              My child feels more confident and actually enjoys learning now. The AI tutor
              feels supportive, not stressful.
            </p>
            <div className="flex items-center gap-3 mt-auto">
              <p className="text-sm text-[#6B7280] font-[family-name:var(--font-inter)]">
                Parent of a Grade 4 Learner
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
