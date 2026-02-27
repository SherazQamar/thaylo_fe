import React from "react";
import Image from "next/image";

export default function CTABanner() {
  return (
    <section className="py-16 px-6 lg:px-12">
      <div className="max-w-[1320px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-[#0B1D2E] min-h-[280px]">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-[#00696B]/20 rounded-full blur-[100px]" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#60D624]/5 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 grid md:grid-cols-3 items-center p-8 md:p-12 gap-8">
            {/* Left Text */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Help Your Child
                <br />
                Grow With Thaylo
              </h2>
            </div>

            {/* Center - Character */}
            <div className="flex justify-center">
              <Image
                src="/assets/character-sitting.png"
                alt="Thaylo Character"
                width={220}
                height={240}
                className="w-[160px] lg:w-[200px] h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="text-white/70 text-sm leading-relaxed italic mb-6">
                A thoughtful learning experience designed to support
                understanding, confidence, and growth.
              </p>
              <button className="px-8 py-3 rounded-full border border-white/80 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                Start Your Free 7-Day Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
