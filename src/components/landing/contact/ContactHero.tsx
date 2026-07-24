import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import aboutBg from "@/app/(landing-flow)/assets/aboutbg.png";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden min-h-[256px] lg:min-h-[510px] bg-[#050F0A]">
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
            className="inline-block size-[10px] bg-[#00CED1] shrink-0"
            style={{ borderRadius: "2px" }}
          />
          <span
            className="text-[18px] font-normal leading-[27px] tracking-[-0.48px] text-[#00CED1]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            Get in Touch
          </span>
        </div>

        <h1
          className="text-[28px] leading-[36px] sm:text-[40px] sm:leading-[48px] lg:text-[56px] lg:leading-[67.2px] font-normal text-white tracking-[-0.64px] max-w-[335px] sm:max-w-[700px] lg:max-w-[1024px] mx-auto"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          Reach Out for More Information
        </h1>
      </div>
    </section>
  );
}
