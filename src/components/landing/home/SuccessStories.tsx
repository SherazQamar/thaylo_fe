import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

export default function SuccessStories() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <SectionLabel text="Success Stories" uppercase={false} />
        <h2
          className="text-[28px] leading-[35px] sm:text-2xl md:text-4xl lg:text-[56px] lg:leading-[67.2px] font-normal text-center mt-3 mb-8 sm:mb-16 text-[#0C211D] tracking-[-0.64px]"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          What We&apos;re Measuring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[25%_1fr] gap-6 items-stretch">
          {/* Metrics Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0B1D2E] min-h-[324px] md:min-h-[200px] md:h-auto flex flex-col">
            <Image
              src="/assets/testimonial-bg-pattern.png"
              alt=""
              fill
              className="object-cover opacity-70"
            />
            <div className="relative z-10 px-5 sm:px-6 pt-8 pb-5 text-center">
              <p
                className="text-white font-medium text-[18px] sm:text-[18px] leading-[21px] sm:leading-[27px] tracking-[-0.48px] max-w-[267px] sm:max-w-[290px] mx-auto"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                Pilot metrics will be shared as data becomes available
              </p>
            </div>
            <div className="relative z-10 px-2.5 sm:px-6 pb-2.5 sm:pb-6 mt-auto">
              <div className="relative w-full h-[209px] sm:aspect-[16/9] sm:h-auto rounded-xl overflow-hidden">
                <Image
                  src="/assets/four-diverse-young-adults.png"
                  alt="Children learning together"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Design Principles Card */}
          <div className="bg-[#F1F5F9] rounded-2xl px-6 py-9 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p
              className="font-semibold text-[#0C211D] mb-4 lg:mb-8 text-[20px] sm:text-[26px] leading-[28px] sm:leading-[1.2] tracking-[-0.64px]"
              style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
            >
              From Our Design Principles
            </p>
            <p
              className="text-[#0C211D] font-normal text-[18px] sm:text-[26px] leading-[28px] sm:leading-[39px] tracking-[-0.48px] sm:tracking-[-1.04px]"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Thaylo is designed to balance rigor with flexibility—so students
              can engage deeply with learning at times and in places that work
              for their families, without lowering expectations.&quot;
            </p>

            {/* Attribution — desktop / web only */}
            <div className="hidden md:flex items-center justify-between mt-10 pt-2">
              <p
                className="text-[#0C211D] font-medium text-[16px] leading-[24px] tracking-[-0.32px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                Parent of a Grade 4 Learner
              </p>
              <p
                className="text-[#606B68] font-normal text-[14px] leading-[21px] tracking-[-0.32px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                AI &amp; Robotics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
