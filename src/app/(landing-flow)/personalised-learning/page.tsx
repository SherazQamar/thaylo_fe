import React from "react";
import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

const personalizationSteps = [
  {
    number: "01",
    title: "Diagnostic Assessment",
    description:
      "Every learner begins with a short diagnostic that maps their current understanding, identifying strengths and areas that need reinforcement before moving forward.",
    gradient: "from-teal-200 to-emerald-300",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B1D2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Adaptive Lesson Paths",
    description:
      "Based on diagnostic results, THAYLO builds a unique lesson sequence for each student--adjusting pacing, examples, and practice to match how they learn best.",
    gradient: "from-amber-200 to-orange-300",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B1D2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Real-Time Feedback",
    description:
      "Students receive immediate, constructive feedback as they work through lessons. Misconceptions are addressed in the moment, not days later on a graded worksheet.",
    gradient: "from-violet-200 to-purple-300",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B1D2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Mastery Checkpoints",
    description:
      "Students advance only when they demonstrate true understanding. Concepts are revisited and reinforced until mastery is confirmed--no rushing ahead with gaps.",
    gradient: "from-sky-200 to-blue-300",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B1D2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const instructors = [
  {
    name: "AI Math Instructor",
    role: "Grades 3-5 Mathematics",
    description:
      "Adapts problem sets and explanations to each student's working level, building numerical fluency step by step.",
    gradient: "from-emerald-300 to-teal-400",
  },
  {
    name: "AI ELA Instructor",
    role: "Grades 3-5 English Language Arts",
    description:
      "Guides reading comprehension and writing skills through personalized passages and scaffolded prompts.",
    gradient: "from-amber-300 to-orange-400",
  },
  {
    name: "AI Science Instructor",
    role: "Grades 3-5 Science",
    description:
      "Brings scientific concepts to life with adaptive experiments, visual models, and inquiry-based questioning.",
    gradient: "from-violet-300 to-purple-400",
  },
];

export default function PersonalisedLearning() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#0B1D2E] overflow-hidden flex items-center">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] left-[-100px] w-[400px] h-[400px] bg-[#14B8A6]/6 rounded-full blur-[100px]" />
        </div>

        {/* Outer border glow */}
        <div className="absolute inset-3 sm:inset-4 md:inset-6 rounded-[24px] border border-[#14B8A6]/15 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/30 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 w-full pt-28 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
                  Personalised Learning
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-normal text-white leading-[1.15] tracking-[-0.5px]">
                Why and How This
                <br />
                Approach Works
                <br />
                for Kids
              </h1>

              <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-lg">
                Every child learns differently. THAYLO uses AI to understand each
                student&apos;s unique strengths and challenges, delivering lessons
                that adapt in real time to how they think, learn, and grow.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" className="px-8 py-4 text-[15px] font-normal shadow-lg shadow-green-500/25">
                  Start Free Trial
                </Button>
                <Button variant="outline" className="px-8 py-4 text-[15px] font-normal">
                  See How It Works
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8 pt-2">
                <div>
                  <p className="text-3xl font-medium text-white">98%</p>
                  <p className="text-xs text-white/50 mt-1">Student Engagement</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div>
                  <p className="text-3xl font-medium text-white">2.5x</p>
                  <p className="text-xs text-white/50 mt-1">Faster Mastery</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div>
                  <p className="text-3xl font-medium text-white">K-5</p>
                  <p className="text-xs text-white/50 mt-1">Grade Coverage</p>
                </div>
              </div>
            </div>

            {/* Right - Student image collage placeholder */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[480px] h-[420px] lg:h-[480px]">
                {/* Main image placeholder */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#14B8A6]/20 to-[#00696B]/20 border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 via-emerald-700/20 to-[#0B1D2E]/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/assets/character-jumping.png"
                      alt="Students learning with THAYLO"
                      width={400}
                      height={450}
                      className="w-[280px] lg:w-[320px] h-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 px-4 py-3 rounded-2xl bg-white/[0.07] border border-white/[0.12] backdrop-blur-xl shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <span className="text-white/90 text-xs font-normal">Adaptive AI Lessons</span>
                  </div>
                </div>

                <div className="absolute -bottom-3 -right-3 px-4 py-3 rounded-2xl bg-white/[0.07] border border-white/[0.12] backdrop-blur-xl shadow-lg animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
                        <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                      </svg>
                    </div>
                    <span className="text-white/90 text-xs font-normal">Mastery-Based Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature / Approach Section */}
      <section className="py-12 px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="OUR APPROACH" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-6 text-[#1A2B3D]">
            Learning That Adapts to Every Child
          </h2>
          <p className="text-center text-[#6B7280] text-base lg:text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
            No two students learn the same way. THAYLO&apos;s personalised approach
            ensures every child receives instruction tailored to their pace,
            strengths, and individual learning needs.
          </p>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Feature Card 1 */}
            <div className="bg-[#F1F5F9] rounded-2xl p-6 lg:p-8 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-[#1A2B3D] mb-2">
                Curriculum-Aligned, Not Random
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
                Every lesson follows structured learning standards. THAYLO
                personalizes the path, not the destination--ensuring students meet
                grade-level expectations through a route that works for them.
              </p>
              <div className="flex-1 relative rounded-xl overflow-hidden min-h-[180px] bg-gradient-to-br from-teal-100 to-emerald-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-3">
                    <div className="w-16 h-20 rounded-lg bg-white/80 shadow-sm flex items-center justify-center">
                      <span className="text-[10px] text-[#6B7280]">Lesson 1</span>
                    </div>
                    <div className="w-16 h-20 rounded-lg bg-white/80 shadow-sm flex items-center justify-center mt-6">
                      <span className="text-[10px] text-[#6B7280]">Lesson 2</span>
                    </div>
                    <div className="w-16 h-20 rounded-lg bg-white/80 shadow-sm flex items-center justify-center">
                      <span className="text-[10px] text-[#6B7280]">Lesson 3</span>
                    </div>
                    <div className="w-16 h-20 rounded-lg bg-white/80 shadow-sm flex items-center justify-center mt-6">
                      <span className="text-[10px] text-[#6B7280]">Lesson 4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-[#F1F5F9] rounded-2xl p-6 lg:p-8 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-[#1A2B3D] mb-2">
                Pacing That Respects the Learner
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
                Some students need more time. Others move quickly. THAYLO adjusts
                pacing dynamically, providing extra practice where it&apos;s needed and
                acceleration where a student is ready.
              </p>
              <div className="flex-1 relative rounded-xl overflow-hidden min-h-[180px] bg-gradient-to-br from-amber-100 to-orange-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-48 h-3 rounded-full bg-white/70 overflow-hidden">
                      <div className="w-[75%] h-full rounded-full bg-[#14B8A6]" />
                    </div>
                    <div className="w-48 h-3 rounded-full bg-white/70 overflow-hidden">
                      <div className="w-[45%] h-full rounded-full bg-amber-400" />
                    </div>
                    <div className="w-48 h-3 rounded-full bg-white/70 overflow-hidden">
                      <div className="w-[90%] h-full rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[10px] text-[#6B7280] mt-2">Each learner&apos;s unique pace</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-[#F1F5F9] rounded-2xl p-6 lg:p-8 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-[#1A2B3D] mb-2">
                Human Oversight, Always
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
                AI delivers lessons, but real educators monitor progress.
                Wayfinders intervene when learning stalls, partner with families,
                and ensure no child falls through the cracks.
              </p>
              <div className="flex-1 relative rounded-xl overflow-hidden min-h-[180px] bg-gradient-to-br from-violet-100 to-purple-200">
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B7280">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <svg width="40" height="2" viewBox="0 0 40 2" fill="none">
                    <path d="M0 1h40" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="4 3" />
                  </svg>
                  <div className="w-14 h-14 rounded-full bg-[#0B1D2E] shadow-sm flex items-center justify-center">
                    <Image src="/assets/logo.png" alt="THAYLO" width={28} height={28} className="w-7 h-7 object-contain" />
                  </div>
                  <svg width="40" height="2" viewBox="0 0 40 2" fill="none">
                    <path d="M0 1h40" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="4 3" />
                  </svg>
                  <div className="w-14 h-14 rounded-full bg-white/80 shadow-sm flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#14B8A6">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-[#F1F5F9] rounded-2xl p-6 lg:p-8 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xl font-normal text-[#1A2B3D] mb-2">
                Emotional Awareness Built In
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-5">
                Calyx, your Bloom Buddy, supports focus and reflection through
                simple check-ins--helping students notice how they&apos;re feeling so
                they can fully engage with learning.
              </p>
              <div className="flex-1 relative rounded-xl overflow-hidden min-h-[180px] bg-gradient-to-br from-rose-100 to-pink-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-3 items-end">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">&#128522;</span>
                      <div className="w-10 h-14 rounded-lg bg-emerald-300/60" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">&#128528;</span>
                      <div className="w-10 h-20 rounded-lg bg-amber-300/60" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">&#128516;</span>
                      <div className="w-10 h-24 rounded-lg bg-teal-300/60" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">&#129303;</span>
                      <div className="w-10 h-18 rounded-lg bg-violet-300/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How THAYLO Personalizes Learning - Steps */}
      <section className="py-12 px-6 lg:px-12 bg-[#F1F5F9] flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="HOW IT WORKS" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-6 text-[#1A2B3D]">
            How THAYLO Personalizes Learning
          </h2>
          <p className="text-center text-[#6B7280] text-base max-w-2xl mx-auto mb-16 leading-relaxed">
            A structured, four-step process ensures every student receives
            instruction that meets them where they are and moves them forward
            with confidence.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalizationSteps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              >
                {/* Step number */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-medium text-[#14B8A6]/30">
                    {step.number}
                  </span>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center`}>
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-normal text-[#1A2B3D] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${step.gradient}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Visual connection between steps */}
          <div className="hidden lg:flex justify-center mt-12">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#14B8A6]" />
              <div className="w-32 h-[2px] bg-gradient-to-r from-[#14B8A6] to-[#14B8A6]/30" />
              <div className="w-3 h-3 rounded-full bg-[#14B8A6]/70" />
              <div className="w-32 h-[2px] bg-gradient-to-r from-[#14B8A6]/30 to-[#14B8A6]/60" />
              <div className="w-3 h-3 rounded-full bg-[#14B8A6]/50" />
              <div className="w-32 h-[2px] bg-gradient-to-r from-[#14B8A6]/60 to-[#14B8A6]" />
              <div className="w-3 h-3 rounded-full bg-[#14B8A6]" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Instructors Section */}
      <section className="py-12 px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="AI INSTRUCTORS" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-6 text-[#1A2B3D]">
            Meet Your Child&apos;s AI Instructors
          </h2>
          <p className="text-center text-[#6B7280] text-base max-w-2xl mx-auto mb-16 leading-relaxed">
            Each AI Instructor is designed with subject-specific pedagogy,
            delivering personalised lessons that feel natural, supportive, and
            grounded in how real teachers teach.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <div
                key={instructor.name}
                className="bg-[#F1F5F9] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Avatar placeholder */}
                <div className={`h-52 bg-gradient-to-br ${instructor.gradient} relative flex items-center justify-center`}>
                  <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white/80" stroke="white" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  {/* AI badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#0B1D2E]/80 backdrop-blur-sm">
                    <span className="text-white text-[10px] font-normal tracking-wider">
                      AI POWERED
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-normal text-[#1A2B3D] mb-1">
                    {instructor.name}
                  </h3>
                  <p className="text-sm text-[#14B8A6] mb-3">{instructor.role}</p>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {instructor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Wayfinder callout */}
          <div className="mt-12 bg-[#0B1D2E] rounded-2xl p-8 lg:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/20 flex items-center justify-center">
                  <Image src="/assets/wayfinder-symbol.png" alt="Wayfinder" width={24} height={24} className="w-6 h-6 object-contain" />
                </div>
                <h3 className="text-xl font-normal text-white">
                  Backed by Real Educators
                </h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                Behind every AI Instructor is a Wayfinder--a real human educator who
                oversees progress, intervenes when learning stalls, and partners
                with families. Your child is never just learning from a machine.
              </p>
            </div>
            <Button variant="primary" className="px-8 py-3.5 text-sm font-normal shadow-lg shadow-green-500/25 whitespace-nowrap">
              Learn About Wayfinders
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer */}
      <Footer />
    </main>
  );
}
