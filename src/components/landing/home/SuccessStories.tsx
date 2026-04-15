import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

export default function SuccessStories() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="SUCCESS STORIES" />
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-[56px] font-normal text-center mt-4 mb-10 sm:mb-16 text-[#0C211D] leading-[1.2] lg:leading-[67.2px] tracking-[-0.64px]">
          What We&apos;re Measuring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[25%_1fr] gap-6 items-stretch">
          {/* Metrics Card */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0B1D2E] min-h-[200px] md:h-auto flex flex-col">
            <Image
              src="/assets/testimonial-bg-pattern.png"
              alt=""
              fill
              className="object-cover opacity-70"
            />
            <div className="relative z-10 px-6 pt-8 pb-6 text-center">
              <p className="text-white font-medium text-[16px] sm:text-[18px] leading-[1.35] sm:leading-[27px] tracking-[-0.48px] max-w-[290px] mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
                Pilot metrics will be shared as data becomes available
              </p>
            </div>
            <div className="relative z-10 px-6 pb-6">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
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
          <div className="bg-[#F1F5F9] rounded-2xl p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="font-semibold text-[#0C211D] mb-8 text-[22px] sm:text-[26px] leading-[1.2] tracking-[-0.64px]" style={{ fontFamily: "Inter, sans-serif" }}>
              From Our Design Principles
            </p>
            <p className="text-[#0C211D] font-normal text-[18px] sm:text-[26px] leading-[1.45] sm:leading-[39px] tracking-[-0.48px] sm:tracking-[-1.04px]" style={{ fontFamily: "Inter, sans-serif" }}>
              <span className="block sm:inline">Thaylo is designed to balance</span>{" "}
              <span className="block sm:inline">rigor with flexibility—so students</span>{" "}
              <span className="block sm:inline">can engage deeply with learning</span>{" "}
              <span className="block sm:inline">at times and in places that work</span>{" "}
              <span className="block sm:inline">for their families, without</span>{" "}
              <span className="block sm:inline">lowering expectations.&quot;</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
