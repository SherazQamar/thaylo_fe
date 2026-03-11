import React from "react";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export default function OurStory() {
  return (
    <section id="about" className="pt-16 lg:pt-24 pb-6 lg:pb-8 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="OUR STORY" />
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[56px] font-normal text-center mt-4 mb-8 max-w-[1170px] mx-auto leading-[1.2] lg:leading-[67.2px] tracking-[-0.64px] text-[#0C211D]">
          Mastery-based learning powered by AI, guided by human pedagogy--so students move forward only when they truly understand
        </h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[1fr_auto] gap-3 lg:gap-4">
          {/* Card 1 - How Learning Works (top-left) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-5 flex flex-col">
            <h3 className="text-[26px] font-medium text-[#0C211D] mb-1 leading-[31.2px] tracking-[-0.64px]">
              How Learning Works at Thaylo
            </h3>
            <p className="text-[16px] font-normal text-[#606B68] leading-[24px] tracking-[-0.48px] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              AI adapts lessons to your child&apos;s pace, strengths, and needs.
            </p>
            <div className="flex-1 relative rounded-xl overflow-hidden min-h-[180px] md:min-h-[120px]">
              <Image
                src="/assets/o 1.png"
                alt="Learning"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-nowrap gap-1.5">
                <span className="px-[15px] py-[10px] text-white text-[10px] font-normal" style={{ borderRadius: "35px", backgroundColor: "rgba(12, 33, 29, 0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                  TRENDS
                </span>
                <span className="px-[15px] py-[10px] text-white text-[10px] font-normal" style={{ borderRadius: "35px", backgroundColor: "rgba(12, 33, 29, 0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                  TECH EDUCATION
                </span>
                <span className="px-[15px] py-[10px] text-white text-[10px] font-normal" style={{ borderRadius: "35px", backgroundColor: "rgba(12, 33, 29, 0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                  SMART LEARNING
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 - AI Instructor (top-middle) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-5 flex flex-col">
            <h3 className="text-[26px] font-medium text-[#0C211D] mb-1 leading-[31.2px] tracking-[-0.64px]">
              AI Instructor, Guided by Human Pedagogy
            </h3>
            <p className="text-[16px] font-normal text-[#606B68] leading-[24px] tracking-[-0.48px] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
              Thaylo&apos;s AI Instructor delivers lessons using proven
              instructional strategies, adapting in real time while staying
              aligned to human-designed curriculum and learning goals.
            </p>
            <div className="flex-1 relative min-h-[200px] -mt-6">
              <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                <line x1="50" y1="14" x2="5" y2="52" stroke="#CBD5E1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="14" x2="95" y2="52" stroke="#CBD5E1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="14" x2="25" y2="86" stroke="#CBD5E1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="14" x2="75" y2="86" stroke="#CBD5E1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-14 h-14 rounded-full bg-[#0B1D2E] border-[3px] border-white flex items-center justify-center shadow-lg">
                <Image src="/assets/logo.png" alt="Thaylo" width={34} height={34} className="w-[34px] h-[34px] object-contain" />
              </div>
              <div className="absolute top-[45%] left-[0%] w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden z-10">
                <Image src="/assets/ai 1.png" alt="Student" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-[45%] right-[0%] w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden z-10">
                <Image src="/assets/ai 2.png" alt="Student" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-[0%] left-[18%] w-14 h-14 rounded-full border-[3px] border-white shadow-md overflow-hidden z-10">
                <Image src="/assets/ai 3.png" alt="Student" width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-[0%] right-[18%] w-14 h-14 rounded-full border-[3px] border-white shadow-md overflow-hidden z-10">
                <Image src="/assets/ai 4.png" alt="Student" width={56} height={56} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Card 3 - Mastery-Based Progression (right, spans 2 rows) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-5 flex flex-col md:row-span-2">
            <h3 className="text-[26px] font-medium text-[#0C211D] mb-1 leading-[31.2px] tracking-[-0.64px]">
              Mastery-Based Progression:
            </h3>
            <p className="text-[16px] font-normal text-[#606B68] leading-[24px] tracking-[-0.48px] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
              Students advance only after demonstrating understanding.
              <br />
              Concepts are assessed, reinforced, and revisited until mastery is
              shown—before moving forward.
              <br />
              Then toward the bottom: Pacing adapts.
              <br />
              Expectations remain fixed.
            </p>
            <div className="flex-1 flex flex-col mt-6">
              {/* Search bar overlapping image top */}
              <div className="relative z-10 mb-[-22px] mx-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Discover what to learn..."
                    className="w-full px-5 py-3.5 rounded-full bg-white border border-gray-200 text-sm text-gray-400 pr-12 outline-none shadow-lg"
                    readOnly
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0C211D] flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Image - flush to card edges */}
              <div className="relative overflow-hidden flex-1 -mx-4 lg:-mx-5 -mb-4 lg:-mb-5 rounded-b-xl">
                <Image
                  src="/assets/our-story-classroom.png"
                  alt="Grade 4 English Lesson"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1.5px]" />
              </div>
            </div>
          </div>

          {/* Learning That Grows - bottom-left, spans 2 columns */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-6 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <h2 className="text-[26px] font-medium text-[#0C211D] leading-[31.2px] tracking-[-0.64px]">
                Learning That Grows With Your Child
              </h2>
              <p className="text-[16px] font-normal text-[#606B68] leading-[24px] tracking-[-0.48px]" style={{ fontFamily: "Inter, sans-serif" }}>
                Providing easy AI learning that helps to build real skills fast
                and smart.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="px-6 py-3 text-sm font-normal text-white bg-gradient-to-r from-[#60D624] to-[#00696B] hover:opacity-90 transition-all duration-300 cursor-pointer" style={{ borderRadius: "12px" }}>
                  Start Your Trial
                </button>
                <button className="px-6 py-3 text-sm font-normal border border-[#1A2B3D] text-[#1A2B3D] bg-transparent hover:bg-gray-50 transition-all duration-300 cursor-pointer" style={{ borderRadius: "12px" }}>
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-[280px] h-[200px]">
                {/* Right card - back, most rotated */}
                <div className="absolute top-0 right-[5px] w-[130px] h-[165px] overflow-hidden rotate-[12deg] shadow-md z-[1]" style={{ borderRadius: "16px" }}>
                  <Image src="/assets/l 3.jpg" alt="Learning" fill className="object-cover" />
                </div>
                {/* Middle card - middle layer */}
                <div className="absolute top-0 left-[65px] w-[140px] h-[170px] overflow-hidden rotate-[4deg] shadow-lg z-[2]" style={{ borderRadius: "16px" }}>
                  <Image src="/assets/l 2.jpg" alt="Learning" fill className="object-cover" />
                </div>
                {/* Left card - front, largest */}
                <div className="absolute top-[5px] left-0 w-[150px] h-[175px] overflow-hidden rotate-[-8deg] shadow-xl z-[3]" style={{ borderRadius: "16px" }}>
                  <Image src="/assets/l1.jpg" alt="Learning" fill className="object-cover" />
                </div>
                {/* Logo */}
                <div className="absolute bottom-0 left-[55%] -translate-x-1/2 w-11 h-11 rounded-full bg-[#0B1D2E] border-[3px] border-white flex items-center justify-center shadow-lg z-10">
                  <Image src="/assets/logo.png" alt="Thaylo" width={24} height={24} className="w-6 h-6 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
