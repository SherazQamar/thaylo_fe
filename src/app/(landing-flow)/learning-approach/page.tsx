import React from "react";
import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";
import SectionLabel from "@/components/ui/SectionLabel";

export default function LearningApproach() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="snap-section relative min-h-screen bg-[#0B1D2E] overflow-hidden flex items-center">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-100px] w-[300px] h-[300px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </div>

        {/* Outer border glow */}
        <div className="absolute inset-3 sm:inset-4 md:inset-6 rounded-[24px] border border-[#14B8A6]/15 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/30 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
          <SectionLabel text="LEARNING APPROACH" className="justify-start" />
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] xl:text-[72px] font-normal text-white leading-[1.15] tracking-[-0.64px] mt-6 max-w-4xl">
            Why and how this approach works for kids
          </h1>
          <p className="text-white/70 text-base lg:text-lg leading-relaxed mt-8 max-w-2xl">
            Thaylo combines proven learning science with thoughtful AI design to
            create an experience where every child can understand, grow, and
            succeed at their own pace.
          </p>
        </div>
      </section>

      {/* Learning is not one size fits all */}
      <section className="snap-section py-16 lg:py-24 px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="THE CHALLENGE" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-16 text-[#1A2B3D]">
            Learning is not one size fits all
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <div className="space-y-6">
              <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed">
                Traditional classrooms move at a single pace, leaving some
                students behind and others unchallenged. Every child learns
                differently -- at their own speed, in their own way, with their
                own strengths and areas for growth.
              </p>
              <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed">
                Research consistently shows that when learning adapts to the
                individual, students build deeper understanding and stronger
                confidence. Yet most systems are still built around rigid
                timelines rather than genuine comprehension.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
                    <span className="text-sm font-medium text-[#1A2B3D]">
                      Adaptive Pacing
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Lessons adjust to how each child learns, not a fixed class
                    schedule.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#60D624]" />
                    <span className="text-sm font-medium text-[#1A2B3D]">
                      Mastery-Based
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Students advance only when they truly understand the
                    material.
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Image Placeholder */}
            <div className="relative rounded-2xl overflow-hidden min-h-[360px] lg:min-h-[440px] bg-gradient-to-br from-[#e0f2fe] via-[#ccfbf1] to-[#d1fae5]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center mx-auto">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <span className="text-[#14B8A6]/60 text-sm font-normal">
                    Every learner is unique
                  </span>
                </div>
              </div>
              {/* Decorative floating elements */}
              <div className="absolute top-8 left-8 w-16 h-16 rounded-xl bg-white/40 backdrop-blur-sm rotate-12" />
              <div className="absolute bottom-12 right-8 w-12 h-12 rounded-full bg-[#14B8A6]/20 backdrop-blur-sm" />
              <div className="absolute top-1/2 right-16 w-8 h-8 rounded-lg bg-[#60D624]/20 backdrop-blur-sm -rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* What personalised learning means at THAYLO */}
      <section className="snap-section py-16 lg:py-24 px-6 lg:px-12 bg-[#F1F5F9] flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="OUR APPROACH" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-16 text-[#1A2B3D]">
            What personalised learning means at THAYLO
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Thaylo Mascot Illustration */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="relative">
                <div className="w-[300px] h-[380px] lg:w-[360px] lg:h-[440px] rounded-3xl bg-gradient-to-br from-[#0B1D2E] to-[#162A3E] flex items-center justify-center overflow-hidden relative">
                  {/* Background glow inside card */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[200px] bg-[#14B8A6]/15 rounded-full blur-[80px]" />
                  <div className="absolute bottom-0 right-0 w-[150px] h-[150px] bg-[#60D624]/10 rounded-full blur-[60px]" />

                  <Image
                    src="/assets/character-jumping.png"
                    alt="Thaylo Character"
                    width={400}
                    height={450}
                    className="w-[240px] lg:w-[280px] h-auto object-contain drop-shadow-xl relative z-10"
                  />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-3 -right-3 px-4 py-2 rounded-full bg-white shadow-lg border border-gray-100">
                  <span className="text-xs font-normal text-[#14B8A6]">
                    Personalised
                  </span>
                </div>
                <div className="absolute -bottom-3 -left-3 px-4 py-2 rounded-full bg-white shadow-lg border border-gray-100">
                  <span className="text-xs font-normal text-[#60D624]">
                    Adaptive
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Text Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed">
                At Thaylo, personalised learning means more than just adjusting
                difficulty. It means understanding how each child thinks, where
                they struggle, and what motivates them -- then shaping the entire
                learning experience around those insights.
              </p>
              <div className="space-y-5">
                <PersonalisedItem
                  number="01"
                  title="Adaptive Lesson Paths"
                  description="The curriculum adjusts in real time based on your child's demonstrated understanding, ensuring they're always working at the right level."
                />
                <PersonalisedItem
                  number="02"
                  title="Mastery Over Speed"
                  description="Students don't move on until they truly understand. Pacing adapts, but expectations remain fixed to ensure deep comprehension."
                />
                <PersonalisedItem
                  number="03"
                  title="Emotional Awareness"
                  description="Calyx, our Bloom Buddy, checks in with students to help them notice how they're feeling, so they can fully engage with learning."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How THAYLO personalizes learning */}
      <section className="snap-section py-16 lg:py-24 px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="THE PROCESS" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-6 text-[#1A2B3D]">
            How THAYLO personalizes learning
          </h2>
          <p className="text-center text-[#6B7280] text-base lg:text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
            A thoughtful system where AI, human oversight, and proven pedagogy
            work together to support every learner.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ApproachCard
              step="01"
              title="Assess & Understand"
              description="We start by understanding where each student is. Diagnostic assessments identify strengths, gaps, and learning preferences to create a baseline."
              gradient="from-[#e0f2fe] to-[#bae6fd]"
              icon={
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0B1D2E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              }
            />
            <ApproachCard
              step="02"
              title="Adapt & Deliver"
              description="AI-powered lessons adjust in real time. Content, pacing, and difficulty shift based on how each student responds, keeping them in the zone of productive challenge."
              gradient="from-[#ccfbf1] to-[#99f6e4]"
              icon={
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0B1D2E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              }
            />
            <ApproachCard
              step="03"
              title="Practice & Reinforce"
              description="Targeted practice reinforces concepts. Spaced repetition and varied problem types ensure understanding sticks, not just for a test but for long-term retention."
              gradient="from-[#d1fae5] to-[#a7f3d0]"
              icon={
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0B1D2E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  <path d="M8 7h8M8 11h6" />
                </svg>
              }
            />
            <ApproachCard
              step="04"
              title="Assess Mastery"
              description="Students demonstrate understanding through meaningful assessments. Only when mastery is shown do they advance, ensuring no one moves on with gaps."
              gradient="from-[#fef3c7] to-[#fde68a]"
              icon={
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0B1D2E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              }
            />
            <ApproachCard
              step="05"
              title="Human Oversight"
              description="Wayfinder educators monitor progress, intervene when learning stalls, and partner with families. The human element ensures no child falls through the cracks."
              gradient="from-[#fce7f3] to-[#fbcfe8]"
              icon={
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0B1D2E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <ApproachCard
              step="06"
              title="Grow & Advance"
              description="With strong foundations built through mastery, students progress confidently to new concepts, building on what they genuinely understand."
              gradient="from-[#ede9fe] to-[#ddd6fe]"
              icon={
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0B1D2E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Building strong learning foundations */}
      <section className="snap-section py-16 lg:py-24 px-6 lg:px-12 bg-[#F1F5F9] flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="FOUNDATIONS" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-16 text-[#1A2B3D]">
            Building strong learning foundations
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <div className="space-y-6">
              <p className="text-[#6B7280] text-base lg:text-lg leading-relaxed">
                Strong learning doesn&apos;t happen by accident. It requires
                the right foundations: clear expectations, responsive
                instruction, meaningful practice, and genuine understanding.
                Thaylo is built on these principles.
              </p>

              <div className="space-y-4">
                <FoundationItem
                  title="Rooted in Learning Science"
                  description="Every element of Thaylo is designed around evidence-based practices, from spaced repetition to mastery-based progression."
                />
                <FoundationItem
                  title="Human Pedagogy at the Core"
                  description="Our AI doesn't replace great teaching -- it delivers instruction that's grounded in what the best human educators know works."
                />
                <FoundationItem
                  title="Confidence Through Understanding"
                  description="When students truly understand what they're learning, confidence follows naturally. No shortcuts, no surface-level answers."
                />
                <FoundationItem
                  title="Prepared for What's Next"
                  description="Students who build strong foundations are better prepared for future challenges, whether in school or in life."
                />
              </div>
            </div>

            {/* Right - Image/Illustration */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden min-h-[360px] lg:min-h-[480px] bg-gradient-to-br from-[#0B1D2E] to-[#162A3E] relative">
                {/* Background effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[#14B8A6]/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#60D624]/8 rounded-full blur-[60px]" />

                {/* Foundation blocks illustration */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="space-y-3 w-full max-w-[300px]">
                    {/* Top block */}
                    <div className="mx-auto w-[60%] h-14 rounded-xl bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center">
                      <span className="text-[#14B8A6] text-xs font-normal">
                        Mastery
                      </span>
                    </div>
                    {/* Middle blocks */}
                    <div className="flex gap-3 justify-center">
                      <div className="flex-1 h-14 rounded-xl bg-[#60D624]/15 border border-[#60D624]/25 flex items-center justify-center">
                        <span className="text-[#60D624] text-xs font-normal">
                          Practice
                        </span>
                      </div>
                      <div className="flex-1 h-14 rounded-xl bg-[#14B8A6]/15 border border-[#14B8A6]/25 flex items-center justify-center">
                        <span className="text-[#14B8A6] text-xs font-normal">
                          Feedback
                        </span>
                      </div>
                    </div>
                    {/* Bottom blocks */}
                    <div className="flex gap-3 justify-center">
                      <div className="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-white/60 text-xs font-normal">
                          Assessment
                        </span>
                      </div>
                      <div className="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-white/60 text-xs font-normal">
                          Instruction
                        </span>
                      </div>
                      <div className="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-white/60 text-xs font-normal">
                          Support
                        </span>
                      </div>
                    </div>
                    {/* Base */}
                    <div className="h-14 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center">
                      <span className="text-white/70 text-xs font-normal tracking-wider">
                        LEARNING SCIENCE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

/* --- Sub-components --- */

function PersonalisedItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full bg-[#0B1D2E] flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-normal">{number}</span>
      </div>
      <div>
        <h3 className="text-base font-medium text-[#1A2B3D] mb-1">{title}</h3>
        <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ApproachCard({
  step,
  title,
  description,
  gradient,
  icon,
}: {
  step: string;
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#F1F5F9] rounded-2xl p-6 lg:p-8 flex flex-col hover:shadow-lg transition-shadow border border-gray-100">
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5`}
      >
        {icon}
      </div>
      {/* Step number */}
      <span className="text-xs font-normal text-[#14B8A6] tracking-widest mb-2">
        STEP {step}
      </span>
      <h3 className="text-lg font-normal text-[#1A2B3D] mb-3">{title}</h3>
      <p className="text-sm text-[#6B7280] leading-relaxed flex-1">
        {description}
      </p>
    </div>
  );
}

function FoundationItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1.5 shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#14B8A6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[#1A2B3D] mb-1">{title}</h3>
        <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
