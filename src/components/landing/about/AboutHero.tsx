import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import SectionLabel from "@/components/ui/SectionLabel";
import aboutBg from "@/app/(landing-flow)/assets/aboutbg.png";

export default function AboutHero() {
  return (
    <section className="relative bg-[#0B1D2E] overflow-hidden">
      <Image
        src={aboutBg}
        alt=""
        fill
        className="object-cover mix-blend-screen"
        priority
      />

      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00696B]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-40px] right-[-80px] w-[400px] h-[400px] bg-[#60D624]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-80px] w-[250px] h-[250px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
          <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
            About Us
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-normal text-white leading-[1.2] tracking-[-0.64px] max-w-4xl mx-auto">
          Who built this, and is there real educational thinking and leadership behind it?
        </h1>
      </div>
    </section>
  );
}
