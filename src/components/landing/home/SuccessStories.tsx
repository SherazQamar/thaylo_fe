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
          <div className="relative rounded-2xl overflow-hidden bg-[#0B1D2E] min-h-[200px] md:h-auto flex items-start">
            <Image
              src="/assets/testimonial-bg-pattern.png"
              alt=""
              fill
              className="object-cover opacity-70"
            />
            <div className="relative z-10 px-6 py-8">
              <p className="text-white font-medium" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
                Pilot metrics will be shared as data becomes available
              </p>
            </div>
          </div>

          {/* Design Principles Card */}
          <div className="bg-[#F1F5F9] rounded-2xl p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="font-semibold text-[#0C211D] mb-6" style={{ fontFamily: "Inter, sans-serif", fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.64px" }}>
              From Our Design Principles
            </p>
            <p className="text-[#0C211D] font-normal" style={{ fontFamily: "Inter, sans-serif", fontSize: "26px", lineHeight: "39px", letterSpacing: "-1.04px" }}>
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
