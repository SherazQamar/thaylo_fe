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
          <div className="relative rounded-2xl overflow-hidden bg-[#0B1D2E] min-h-[200px] md:h-auto flex items-center justify-center">
            <Image
              src="/assets/testimonial-bg-pattern.png"
              alt=""
              fill
              className="object-cover opacity-70"
            />
            <div className="relative z-10 px-6 py-8">
              <p className="text-white text-lg sm:text-xl font-medium leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                Pilot metrics will be shared as data becomes available
              </p>
            </div>
          </div>

          {/* Design Principles Card */}
          <div className="bg-[#F1F5F9] rounded-2xl p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="text-[#0C211D] text-base lg:text-[26px] lg:leading-[39px] lg:tracking-[-1.04px] font-semibold mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              From Our Design Principles
            </p>
            <p className="text-[#0C211D] text-base lg:text-[26px] lg:leading-[39px] lg:tracking-[-1.04px] font-normal" style={{ fontFamily: "Inter, sans-serif" }}>
              Thaylo is designed to balance rigor with flexibility—so students can engage
              deeply with learning at times and in places that work for their families,
              without lowering expectations.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
