import Image from "next/image";

export default function CTABanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-12 flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#0B1D2E] min-h-[280px] lg:min-h-[360px]">
          {/* Background glow */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00696B]/25 rounded-full blur-[120px]" />
            <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#14B8A6]/15 rounded-full blur-[100px]" />
            <div className="absolute top-0 right-[10%] w-[300px] h-[300px] bg-[#60D624]/8 rounded-full blur-[100px]" />
            <div className="absolute top-0 left-[10%] w-[300px] h-[300px] bg-[#60D624]/8 rounded-full blur-[100px]" />
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
                className="w-[180px] sm:w-[220px] lg:w-[340px] h-auto object-contain drop-shadow-2xl md:-mt-32 lg:-mt-44"
              />
            </div>

            {/* Right */}
            <div className="text-center md:text-right">
              <p className="text-white/70 text-sm leading-relaxed italic mb-4 sm:mb-6">
                A thoughtful learning experience designed to support
                understanding, confidence, and growth.
              </p>
              <button className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-[#0B1D2E] text-sm font-normal hover:bg-white/90 transition-colors cursor-pointer shadow-lg">
                Start Your Free 7-Day Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
