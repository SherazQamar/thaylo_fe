import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

export default function SupportSystem() {
  return (
    <section
      id="learning-model"
      className="pt-16 lg:pt-28 pb-12 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center"
    >
      <div className="max-w-[1320px] mx-auto w-full">
        <SectionLabel text="Why Us" uppercase={false} />
        <h2
          className="text-[24px] leading-[32px] sm:text-2xl md:text-4xl lg:text-[48px] lg:leading-[58px] font-normal text-center mt-3 mb-10 sm:mb-16 tracking-[-0.64px] text-[#0C211D] max-w-[327px] sm:max-w-none mx-auto"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          The Thaylo Learning Support System
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,480px)_1fr] gap-10 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="space-y-8 lg:space-y-12">
            <div className="text-left">
              <div className="w-[60px] h-[60px] flex items-center justify-center mb-5 mx-0">
                <Image
                  src="/assets/certificate-symbol.png"
                  alt="AI Instructor"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] object-contain"
                />
              </div>
              <h3
                className="font-medium text-[#0C211D] mb-2 text-[24px] sm:text-[26px] leading-[32px] tracking-[-0.64px]"
                style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
              >
                AI Instructor
              </h3>
              <p
                className="text-[#606B68] font-normal text-[16px] sm:text-[18px] leading-[27px] tracking-[-0.48px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                A personalized, human-appearing AI Instructor delivers structured
                lessons aligned to mastery-based expectations. Students have some
                choice in selecting the Instructor&apos;s appearance while
                instruction remains grounded in human pedagogy and curriculum.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 text-left">
              <div className="w-[60px] h-[60px] flex items-center justify-center mb-5 mx-0">
                <Image
                  src="/assets/handshake-symbol.png"
                  alt="Bloom Buddy"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] object-contain"
                />
              </div>
              <h3
                className="font-medium text-[#0C211D] mb-2 text-[24px] sm:text-[26px] leading-[32px] tracking-[-0.64px]"
                style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
              >
                Calyx, Your Bloom Buddy
              </h3>
              <p
                className="text-[#606B68] font-normal text-[16px] sm:text-[18px] leading-[27px] tracking-[-0.48px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                Calyx supports focus and reflection through simple check-ins that
                help students notice how they&apos;re feeling so they can fully
                engage with learning.
              </p>
            </div>
          </div>

          {/* Center - Character (larger on desktop) */}
          <div className="hidden lg:flex justify-center items-center order-first lg:order-none min-h-[520px]">
            <Image
              src="/assets/new-learning-support.png"
              alt="Thaylo Character"
              width={520}
              height={580}
              className="w-[440px] xl:w-[480px] h-auto object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Right Column */}
          <div className="text-left lg:text-right">
            <div>
              <div className="w-[60px] h-[60px] flex items-center justify-center mb-5 mx-0 lg:ml-auto lg:mr-0">
                <Image
                  src="/assets/wayfinder-symbol.png"
                  alt="Wayfinder Support"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] object-contain"
                />
              </div>
              <h3
                className="font-medium text-[#0C211D] mb-2 text-[24px] sm:text-[26px] leading-[32px] tracking-[-0.64px]"
                style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
              >
                Wayfinder Support
              </h3>
              <p
                className="text-[#606B68] font-normal text-[16px] sm:text-[18px] leading-[27px] tracking-[-0.48px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                A real educator oversees progress, intervenes when learning
                stalls, and partners with families when human attention is needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
