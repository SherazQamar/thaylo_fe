import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import SectionLabel from "@/components/ui/SectionLabel";
import aboutBg from "@/app/(landing-flow)/assets/aboutbg.png";

export default function AboutHero() {
  return (
    <section className="snap-section relative min-h-[60vh] sm:min-h-[60vh] lg:min-h-[70vh] bg-[#111023] overflow-hidden flex flex-col">
      <Image
        src={aboutBg}
        alt=""
        fill
        className="object-cover mix-blend-screen"
        priority
      />

      <Navbar />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-0 lg:pb-0">
        <div className="text-center max-w-3xl">
          <SectionLabel text="ABOUT US" />
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[48px] xl:text-[56px] font-normal text-white leading-[1.2] tracking-[-0.64px] mt-5">
            Who built this, and is there
            <br className="hidden sm:block" />
            {" "}real educational thinking and
            <br className="hidden sm:block" />
            {" "}leadership behind it?
          </h1>
        </div>
      </div>
    </section>
  );
}
