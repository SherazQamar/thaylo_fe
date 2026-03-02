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
      <section className="relative bg-[#0B1D2E] overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-100px] w-[300px] h-[300px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </div>


        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 text-center">
          <SectionLabel text="LEARNING APPROACH" />
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] xl:text-[72px] font-normal text-white leading-[1.15] tracking-[-0.64px] mt-6 max-w-4xl mx-auto">
            Why and how this approach works for kids
          </h1>
        </div>
      </section>

      {/* Learning is not one size fits all */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left - Image */}
            <div className="relative rounded-2xl overflow-hidden min-h-[250px] sm:min-h-[360px] lg:min-h-[440px] bg-[#F1F5F9]">
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-tight text-[#1A2B3D]">
                Learning is not
                <br />
                one size fits all
              </h2>
              <p
                className="text-[#6B7280] text-sm sm:text-base lg:text-lg leading-[24px] sm:leading-[27px] tracking-[-0.48px] font-normal"
                style={{ fontFamily: "Inter, sans-serif" }}
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
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-10 sm:mb-16 text-[#1A2B3D]">
            What personalized learning
            <br />
            means at THAYLO
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Column */}
            <div className="space-y-8 lg:space-y-12">
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0">
                  <Image src="/assets/adapts-pace-icon.png" alt="" width={28} height={28} className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-lg font-normal text-[#1A2B3D] mb-2">
                  Adapts Pace
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Adapts to their pace and understanding
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 text-center lg:text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0">
                  <Image src="/assets/adjust-lessons-icon.png" alt="" width={28} height={28} className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-lg font-normal text-[#1A2B3D] mb-2">
                  Adjust Lessons
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
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
                className="w-[200px] sm:w-[240px] lg:w-[340px] h-auto object-contain drop-shadow-xl"
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8 lg:space-y-12">
              <div className="text-center lg:text-right">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto lg:ml-auto lg:mr-0">
                  <Image src="/assets/curiosity-icon.png" alt="" width={28} height={28} className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-lg font-normal text-[#1A2B3D] mb-2">
                  Encourages curiosity
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Encourages curiosity without pressure
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 text-center lg:text-right">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto lg:ml-auto lg:mr-0">
                  <Image src="/assets/treats-mistakes-icon.png" alt="" width={28} height={28} className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-lg font-normal text-[#1A2B3D] mb-2">
                  Treats mistakes
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
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
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-4 text-[#1A2B3D]">
            How THAYLO personalizes
            <br />
            learning
          </h2>
          <p
            className="text-center text-[#6B7280] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-10 sm:mb-16 leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            THAYLO adjusts lessons in real time. If a child struggles, concepts
            are explained again in simpler ways. If a child is ready, new
            challenges are introduced naturally.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left - Image */}
            <div className="relative rounded-2xl overflow-hidden min-h-[250px] sm:min-h-[360px] lg:min-h-[480px] bg-white">
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Image src="/assets/skill-progression-icon.png" alt="" width={40} height={40} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-[#1A2B3D] mb-2">
                  Skill based progression
                </h3>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  Children move forward only when they understand a concept. This
                  ensures strong foundations and avoids learning gaps that often
                  appear later.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Image src="/assets/ai-guidance-icon.png" alt="" width={40} height={40} className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-[#1A2B3D] mb-2">
                  Child friendly AI guidance
                </h3>
                <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  THAYLO&apos;s AI tutor is designed for K-5 learners. It
                  communicates in a warm, encouraging, and age-appropriate way
                  that feels supportive rather than instructional.
                </p>
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
