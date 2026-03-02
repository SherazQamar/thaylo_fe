import React from "react";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export default function OurStory() {
  return (
    <section id="about" className="pt-8 lg:pt-10 pb-6 lg:pb-8 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="OUR STORY" />
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] font-normal text-center mt-2 mb-6 max-w-3xl mx-auto leading-tight text-[#1A2B3D]">
          Global AI School for Real World Brilliance
        </h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[1fr_auto] gap-3 lg:gap-4">
          {/* Card 1 - How Learning Works (top-left) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-5 flex flex-col">
            <h3 className="text-sm lg:text-base font-normal text-[#1A2B3D] mb-1">
              How Learning Works at Thaylo
            </h3>
            <p className="text-xs lg:text-sm text-[#6B7280] leading-relaxed mb-2">
              AI adapts lessons to your child&apos;s pace, strengths, and needs.
            </p>
            <div className="flex-1 relative rounded-xl overflow-hidden min-h-[120px] bg-gradient-to-br from-[#e8d5b7] to-[#c4a882]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4b896]/80 via-[#c9a97e]/60 to-[#b89b6a]/80" />
              <div className="absolute inset-0 flex items-center justify-center opacity-25">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="#8B7355">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#0B1D2E]/80 text-white text-[10px] font-normal backdrop-blur-sm">
                  TRENDS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#0B1D2E]/80 text-white text-[10px] font-normal backdrop-blur-sm">
                  TECH EDUCATION
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#0B1D2E]/80 text-white text-[10px] font-normal backdrop-blur-sm">
                  SMART LEARNING
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 - AI Instructor (top-middle) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-5 flex flex-col">
            <h3 className="text-sm lg:text-base font-normal text-[#1A2B3D] mb-1">
              AI Instructor, Guided by Human Pedagogy
            </h3>
            <p className="text-xs lg:text-sm text-[#6B7280] leading-relaxed mb-2">
              Thaylo&apos;s AI Instructor delivers lessons using proven
              instructional strategies, adapting in real time while staying tied
              to human-designed curriculum and learning goals.
            </p>
            <div className="flex-1 relative flex items-center justify-center min-h-[120px]">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160" fill="none">
                <line x1="150" y1="80" x2="70" y2="20" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="150" y1="80" x2="230" y2="20" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="150" y1="80" x2="35" y2="100" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="150" y1="80" x2="265" y2="100" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="150" y1="80" x2="90" y2="145" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="150" y1="80" x2="210" y2="145" stroke="#CBD5E1" strokeWidth="1.5" />
              </svg>
              <div className="relative z-10 w-11 h-11 rounded-full bg-[#0B1D2E] flex items-center justify-center shadow-lg">
                <Image src="/assets/logo.png" alt="Thaylo" width={28} height={28} className="w-7 h-7 object-contain" />
              </div>
              <div className="absolute top-[3%] left-[16%] w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-white shadow-md" />
              <div className="absolute top-[3%] right-[16%] w-8 h-8 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 border-2 border-white shadow-md" />
              <div className="absolute top-[50%] left-[3%] w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 border-2 border-white shadow-md" />
              <div className="absolute top-[50%] right-[3%] w-8 h-8 rounded-full bg-gradient-to-br from-violet-300 to-violet-500 border-2 border-white shadow-md" />
              <div className="absolute bottom-[2%] left-[22%] w-8 h-8 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 border-2 border-white shadow-md" />
              <div className="absolute bottom-[2%] right-[22%] w-8 h-8 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 border-2 border-white shadow-md" />
            </div>
          </div>

          {/* Card 3 - Mastery-Based Progression (right, spans 2 rows) */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-5 flex flex-col md:row-span-2">
            <h3 className="text-sm lg:text-base font-normal text-[#1A2B3D] mb-1">
              Mastery-Based Progression:
            </h3>
            <p className="text-xs lg:text-sm text-[#6B7280] leading-relaxed mb-2">
              Students advance only after demonstrating understanding.
              <br />
              Concepts are assessed, reinforced, and revisited until mastery is
              shown—before moving forward.
              <br />
              Then toward the bottom: Pacing adapts.
              <br />
              Expectations remain fixed.
            </p>
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Discover what to learn..."
                className="w-full px-3 py-2 rounded-full bg-white border border-gray-200 text-xs text-gray-600 pr-9 outline-none focus:border-[#14B8A6]"
                readOnly
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </div>
            <div className="flex-1 relative rounded-xl overflow-hidden min-h-[160px]">
              <Image
                src="/assets/our-story-classroom.png"
                alt="Grade 4 English Lesson"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Learning That Grows - bottom-left, spans 2 columns */}
          <div className="bg-[#F1F5F9] rounded-2xl p-4 lg:p-6 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-normal text-[#1A2B3D] leading-tight">
                Learning That Grows With Your Child
              </h2>
              <p className="text-[#6B7280] text-xs lg:text-sm leading-relaxed">
                Providing easy AI learning that helps to build real skills fast
                and smart.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="teal" className="text-xs px-4 py-2">
                  Start Your Trial
                </Button>
                <Button variant="outline-dark" className="text-xs px-4 py-2">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-[240px] h-[130px]">
                <div className="absolute top-0 left-2 w-[85px] h-[110px] rounded-xl bg-gradient-to-br from-amber-200 to-amber-300 rotate-[-6deg] shadow-lg" />
                <div className="absolute top-1 left-[55px] w-[85px] h-[110px] rounded-xl bg-gradient-to-br from-blue-200 to-blue-300 rotate-[3deg] shadow-lg" />
                <div className="absolute top-3 left-[105px] w-[85px] h-[110px] rounded-xl bg-gradient-to-br from-rose-200 to-rose-300 rotate-[8deg] shadow-lg" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0B1D2E] border-2 border-white flex items-center justify-center shadow-lg z-10">
                  <Image src="/assets/logo.png" alt="Thaylo" width={20} height={20} className="w-5 h-5 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
