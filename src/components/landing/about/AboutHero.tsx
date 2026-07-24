import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import aboutBg from "@/app/(landing-flow)/assets/aboutbg.png";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden min-h-[294px] lg:min-h-[683px] bg-[#050F0A]">
      {/* Figma Regular BG Pattern — dark green light-ray asset (no blend that tints navy) */}
      <Image
        src={aboutBg}
        alt=""
        fill
        className="object-cover object-top"
        priority
      />

      <Navbar />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-0 pt-[115px] lg:pt-[237px] pb-10 lg:pb-[140px] text-center">
        <div className="flex items-center justify-center gap-[10px] mb-3 lg:mb-[19px]">
          <span
            className="inline-block size-[10px] bg-[#00CED1]"
            style={{ borderRadius: "2px" }}
          />
          <span
            className="text-[18px] font-normal leading-[27px] tracking-[-0.48px] text-[#00CED1]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            About us
          </span>
        </div>

        <h1
          className="text-[24px] leading-[32px] sm:text-[36px] sm:leading-[44px] lg:text-[56px] lg:leading-[65px] font-normal text-white tracking-[-0.64px] max-w-[335px] sm:max-w-[700px] lg:max-w-[954px] mx-auto"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          Who built this, and is there real educational thinking and leadership
          behind it?
        </h1>
      </div>
    </section>
  );
}
