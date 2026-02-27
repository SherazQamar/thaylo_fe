import React from "react";
import Image from "next/image";

export default function CTABanner() {
  return (
    <section className="snap-section px-6 lg:px-12 flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="relative rounded-3xl bg-[#0B1D2E] min-h-[320px] lg:min-h-[360px]">
          {/* Background glow - stronger aurora effects */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00696B]/25 rounded-full blur-[120px]" />
            <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#14B8A6]/15 rounded-full blur-[100px]" />
            <div className="absolute top-0 right-[10%] w-[300px] h-[300px] bg-[#60D624]/8 rounded-full blur-[100px]" />
            <div className="absolute top-0 left-[10%] w-[300px] h-[300px] bg-[#60D624]/8 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 grid md:grid-cols-3 items-center p-10 md:p-14 gap-8">
            {/* Left Text */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-normal text-white leading-tight">
                Help Your Child
                <br />
                Grow With Thaylo
              </h2>
            </div>

            {/* Center - Character (overflows above the banner) */}
            <div className="flex justify-center relative">
              <Image
                src="/assets/character-sitting.png"
                alt="Thaylo Character"
                width={400}
                height={450}
                className="w-[260px] lg:w-[340px] h-auto object-contain drop-shadow-2xl -mt-32 lg:-mt-44"
              />
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="text-white/70 text-sm leading-relaxed italic mb-6">
                A thoughtful learning experience designed to support
                understanding, confidence, and growth.
              </p>
              <button className="px-8 py-3.5 rounded-full bg-white text-[#0B1D2E] text-sm font-normal hover:bg-white/90 transition-colors cursor-pointer shadow-lg">
                Start Your Free 7-Day Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
