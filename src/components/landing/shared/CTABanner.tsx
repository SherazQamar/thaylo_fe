import Image from "next/image";

export default function CTABanner() {
  return (
    <section className="flex flex-col justify-center">
      <div className="relative bg-[#0B1D2E] overflow-hidden" style={{ minHeight: "240px" }}>
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00696B]/20 rounded-full blur-[100px]" />
            <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[#14B8A6]/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center p-6 sm:p-10 md:p-14 gap-6 sm:gap-8">
            {/* Left Text */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal text-white leading-tight">
                Help Your Child
                <br />
                Grow With Thaylo
              </h2>
            </div>

            {/* Center - Character */}
            <div className="flex justify-center relative order-first md:order-none">
              <Image
                src="/assets/character-sitting.png"
                alt="Thaylo Character"
                width={400}
                height={450}
                className="w-[180px] sm:w-[220px] lg:w-[340px] h-auto object-contain drop-shadow-2xl md:-mt-6 lg:-mt-8 md:mb-[-150px] lg:mb-[-200px]"
              />
            </div>

            {/* Right */}
            <div className="text-center md:text-right">
              <p className="text-white/70 text-sm leading-relaxed italic mb-4 sm:mb-6">
                A thoughtful learning experience designed to support
                understanding, confidence, and growth.
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-[#0B1D2E] text-sm font-normal hover:bg-white/90 transition-colors cursor-pointer shadow-lg" style={{ borderRadius: "12px" }}>
                Start Your Free 7-Day Trial
              </button>
            </div>
          </div>
        </div>
    </section>
  );
}
