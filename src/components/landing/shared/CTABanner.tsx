import Image from "next/image";

export default function CTABanner() {
  return (
    <section className="flex flex-col justify-center px-4 sm:px-6 lg:px-12">
      <div className="relative bg-[#0B1D2E] overflow-hidden rounded-none md:rounded-2xl max-w-[1320px] mx-auto w-full" style={{ minHeight: "240px" }}>
          <Image
            src="/assets/testimonial-bg-pattern.png"
            alt=""
            fill
            className="object-cover opacity-70 md:hidden"
          />
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00696B]/20 rounded-full blur-[100px]" />
            <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[#14B8A6]/10 rounded-full blur-[80px]" />
          </div>

          {/* Mobile Layout */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 pt-10 md:hidden">
            <h2 className="text-[20px] font-normal text-white leading-[1.2] tracking-[-0.64px] mb-5 max-w-[320px]">
              <span className="block">Help Your Child Grow With</span>
              <span className="block">Thaylo</span>
            </h2>
            <p className="mb-5 max-w-[320px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "1.45", letterSpacing: "-0.32px", color: "#FFFFFF" }}>
              <span className="block">A thoughtful learning experience</span>
              <span className="block">designed to support understanding,</span>
              <span className="block">confidence, and growth.</span>
            </p>
            <button className="w-full max-w-[300px] px-8 py-3 bg-white hover:bg-white/90 transition-colors cursor-pointer shadow-lg mb-3" style={{ borderRadius: "12px", fontFamily: "Instrument Sans, sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "21.6px", letterSpacing: "-0.48px", color: "#111023" }}>
              Apply Now
            </button>
            <div className="w-full max-w-[320px] h-[280px] overflow-hidden flex justify-center">
              <Image
                src="/assets/new-hero.png"
                alt="Thaylo Character"
                width={420}
                height={560}
                className="w-[320px] h-[420px] object-cover object-top drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="relative z-10 hidden md:grid md:grid-cols-3 items-center p-6 sm:p-10 md:p-14 gap-6 sm:gap-8">
            {/* Left Text */}
            <div className="text-left">
              <h2 className="text-4xl lg:text-[42px] font-normal text-white leading-tight">
                Help Your Child
                <br />
                Grow With Thaylo
              </h2>
            </div>

            {/* Center - Character */}
            <div className="flex justify-center relative">
              <Image
                src="/assets/new-hero.png"
                alt="Thaylo Character"
                width={400}
                height={450}
                className="lg:w-[340px] md:w-[280px] h-auto object-contain drop-shadow-2xl md:-mt-6 lg:-mt-8 md:mb-[-150px] lg:mb-[-200px]"
              />
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="italic mb-4 sm:mb-6" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px", color: "#FFFFFF" }}>
                A thoughtful learning experience designed to support
                understanding, confidence, and growth.
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-white/90 transition-colors cursor-pointer shadow-lg" style={{ borderRadius: "12px", fontFamily: "Instrument Sans, sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "21.6px", letterSpacing: "-0.48px", color: "#111023" }}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
    </section>
  );
}
