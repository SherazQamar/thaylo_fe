import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";
import SectionLabel from "@/components/ui/SectionLabel";

export default function LearningApproach() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-[#0B1D2E] overflow-hidden">
        <Image
          src="/assets/aboutbg.png"
          alt=""
          fill
          className="object-cover mix-blend-screen"
          priority
        />
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-40px] right-[-80px] w-[400px] h-[400px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-80px] w-[250px] h-[250px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </div>

        <Navbar />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
            <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
              Learning Approach
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-normal text-white leading-[1.2] tracking-[-0.64px] max-w-4xl mx-auto">
            Why and how this approach works for kids
          </h1>
        </div>
      </section>

      {/* Learning is not one size fits all */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
            {/* Left - Image */}
            <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[300px] lg:min-h-[380px] bg-[#F1F5F9]">
              <Image
                src="/assets/learning approach.png"
                alt="Learning approach"
                fill
                className="object-cover"
              />
            </div>

            {/* Right - Text */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                <span
                  className="text-[14px] md:text-[18px] font-normal uppercase tracking-[-0.48px] text-[#606B68] leading-[27px]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  WHO WE ARE
                </span>
              </div>
              <h2 className="text-[28px] lg:text-[56px] text-[#111023]" style={{ lineHeight: "67.2px", letterSpacing: "-0.64px", fontWeight: 400 }}>
                Learning is not one size fits all
              </h2>
              <p
                className="text-[#606B68] font-normal"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}
              >
                Every child learns in a different way. Some children need more
                time. Some learn faster with visuals. Others understand better
                through practice and repetition. Traditional learning methods
                often move at a fixed pace, which can make children feel
                pressured, bored, or left behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What personalized learning means at THAYLO */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="WHY US" />
          <h2 className="text-[24px] lg:text-[56px] text-center mt-4 mb-10 sm:mb-16 text-[#111023]" style={{ lineHeight: "67.2px", letterSpacing: "-0.64px", fontWeight: 400 }}>
            What personalized learning
            <br />
            means at THAYLO
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center">
            {/* Left Column */}
            <div className="space-y-6 lg:space-y-8">
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                  <Image src="/assets/certificate-symbol.png" alt="" width={28} height={28} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="font-medium text-[#111023] mb-2" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.64px" }}>
                  Adapts Pace
                </h3>
                <p className="text-[#606B68] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
                  Adapts to their pace and understanding
                </p>
              </div>

              <div className="pt-6 border-t border-[#9CA3AF] text-center lg:text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:mx-0">
                  <Image src="/assets/handshake-symbol.png" alt="" width={28} height={28} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="font-medium text-[#111023] mb-2" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.64px" }}>
                  Adjust Lessons
                </h3>
                <p className="text-[#606B68] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
                  Adjusts lessons based on progress
                </p>
              </div>
            </div>

            {/* Center - Character */}
            <div className="flex justify-center items-center order-first lg:order-none">
              <Image
                src="/assets/character-jumping.png"
                alt="Thaylo Character"
                width={400}
                height={450}
                className="w-[200px] sm:w-[240px] lg:w-[400px] h-auto object-contain drop-shadow-xl"
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6 lg:space-y-8">
              <div className="text-center lg:text-right">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:ml-auto lg:mr-0">
                  <Image src="/assets/wayfinder-symbol.png" alt="" width={28} height={28} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="font-medium text-[#111023] mb-2" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.64px" }}>
                  Encourages curiosity
                </h3>
                <p className="text-[#606B68] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
                  Encourages curiosity without pressure
                </p>
              </div>

              <div className="pt-6 border-t border-[#9CA3AF] text-center lg:text-right">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto lg:ml-auto lg:mr-0">
                  <Image src="/assets/treat.png" alt="" width={28} height={28} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="font-medium text-[#111023] mb-2" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.64px" }}>
                  Treats mistakes
                </h3>
                <p className="text-[#606B68] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
                  Treats mistakes as part of learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How THAYLO personalizes learning */}
      <section className="py-12 lg:py-24 px-4 sm:px-6 lg:px-12 bg-[#EBEEF2] flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <SectionLabel text="PERSONALIZED LEARNING" />
          <h2 className="text-[24px] lg:text-[56px] text-center text-[#111023] mt-4 mb-4" style={{ lineHeight: "67.2px", letterSpacing: "-0.64px", fontWeight: 400 }}>
            How THAYLO personalizes
            <br />
            learning
          </h2>
          <p
            className="text-center text-[#606B68] max-w-2xl mx-auto mb-10 sm:mb-16 font-normal"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "27px", letterSpacing: "-0.48px" }}
          >
            THAYLO adjusts lessons in real time. If a child struggles, concepts
            are explained again in simpler ways. If a child is ready, new
            challenges are introduced naturally.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left - Image */}
            <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[300px] lg:min-h-[380px] bg-white">
              <Image
                src="/assets/personalize learning.png"
                alt="Personalized learning"
                fill
                className="object-cover"
              />
            </div>

            {/* Right - Feature items */}
            <div className="space-y-8">
              <div>
                <div className="mb-4">
                  <Image src="/assets/skill base.png" alt="" width={48} height={48} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="font-medium text-[#0C211D] mb-2" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.64px" }}>
                  Skill based progression
                </h3>
                <p className="text-[#606B68] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
                  Children move forward only when they understand a concept. This
                  ensures strong foundations and avoids learning gaps that often
                  appear later.
                </p>
              </div>

              <div className="pt-8 border-t border-[#9CA3AF]">
                <div className="mb-4">
                  <Image src="/assets/child.png" alt="" width={48} height={48} className="w-12 h-12 object-contain" />
                </div>
                <h3 className="font-medium text-[#0C211D] mb-2" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.64px" }}>
                  Child friendly AI guidance
                </h3>
                <p className="text-[#606B68] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
                  THAYLO&apos;s AI tutor is designed for K-5 learners. It
                  communicates in a warm, encouraging, and age-appropriate way
                  that feels supportive rather than instructional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building strong learning foundations */}
      <section className="py-12 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Text */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                <span className="text-sm font-normal tracking-widest text-[#6B7280] uppercase">
                  Personalized Learning
                </span>
              </div>
              <h2 className="text-[28px] lg:text-[56px] text-[#111023] mb-4" style={{ lineHeight: "67.2px", letterSpacing: "-0.64px", fontWeight: 400 }}>
                Building strong learning
                <br />
                foundations
              </h2>
              <p className="text-[#606B68] font-normal mb-6" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "0px" }}>
                Early learning shapes how children think, solve problems, and build confidence
                in the future. By personalizing learning early, THAYLO helps children develop:
              </p>
              <ul className="space-y-4">
                {[
                  "Strong fundamentals",
                  "Positive learning habits",
                  "Confidence to explore new ideas",
                  "A healthy relationship with learning",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Image src="/assets/mdi_tick-circle-outline.png" alt="" width={24} height={24} className="w-6 h-6 flex-shrink-0" />
                    <span className="text-[#606B68] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "0px" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Image */}
            <div className="relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[380px] lg:min-h-[480px]">
              <Image
                src="/assets/building.jpg"
                alt="Building strong learning foundations"
                fill
                className="object-cover object-center"
              />
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
