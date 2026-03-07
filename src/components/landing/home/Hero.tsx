import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative lg:h-screen bg-[#0B1D2E] overflow-hidden rounded-b-3xl lg:rounded-b-none"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] bg-[#60D624]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-100px] w-[300px] h-[300px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Character - hidden on mobile, absolute on desktop */}
      <div className="hidden lg:flex absolute right-0 lg:right-[5%] xl:right-[8%] top-[5%] bottom-0 w-[45%] z-[5] justify-center">
        <Image
          src="/assets/green-robot-hero.png"
          alt="Thaylo AI Character"
          width={800}
          height={900}
          className="w-full h-[110%] object-cover object-top drop-shadow-2xl"
          priority
        />
      </div>

      {/* Floating badges - hidden on mobile */}
      <div className="hidden lg:block absolute top-[22%] right-[6%] xl:right-[8%] z-20 animate-float">
        <FloatingBadge text="Mastery-Based Progression" />
      </div>
      <div className="hidden lg:block absolute bottom-[10%] left-[34%] xl:left-[36%] z-20 animate-float-delayed">
        <FloatingBadge text="Designed for Real Learning" />
      </div>
      <div className="hidden lg:block absolute bottom-[8%] right-[3%] xl:right-[5%] z-20 animate-float-slow">
        <FloatingBadge text="Human-Guided AI" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 h-full flex flex-col lg:flex-row lg:items-end pt-24 lg:pt-0 pb-8 lg:pb-16">
        <div className="w-full lg:max-w-[55%] space-y-6 lg:space-y-9 lg:pb-12 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-[60px] xl:text-[72px] font-normal text-white leading-[1.2] tracking-[-0.64px]">
            Rooted In Learning,
            <br />
            Blooming Into
            <br />
            Brilliance.
          </h1>

          <div className="flex flex-wrap gap-4 lg:gap-5 justify-center lg:justify-start">
            <button className="px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-[15px] font-normal bg-gradient-to-r from-[#60D624] to-[#00696B] text-white hover:opacity-90 shadow-lg shadow-green-500/25 transition-all duration-300 cursor-pointer" style={{ borderRadius: "12px" }}>
              See How Thaylo Works
            </button>
            <button className="hidden lg:inline-flex px-8 py-4 text-[15px] font-normal border-2 border-white/40 text-white bg-transparent hover:bg-white/10 transition-all duration-300 cursor-pointer" style={{ borderRadius: "12px" }}>
              Explore The 4th Grade Pilot
            </button>
          </div>

          {/* Avatar group - desktop only */}
          <div className="hidden lg:flex items-center gap-4 justify-start">
            <div className="flex -space-x-3">
              <Image src="/assets/hero 1.jpg" alt="Student 1" width={44} height={44} className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border-[2.5px] border-[#0B1D2E] object-cover" />
              <Image src="/assets/hero 2.jpg" alt="Student 2" width={44} height={44} className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border-[2.5px] border-[#0B1D2E] object-cover" />
              <Image src="/assets/hero 3.jpg" alt="Student 3" width={44} height={44} className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border-[2.5px] border-[#0B1D2E] object-cover" />
            </div>
            <span className="text-white text-[14px] sm:text-[18px] font-normal leading-[21.6px] tracking-[-0.48px]" style={{ fontFamily: "Inter, sans-serif" }}>
              Personalized for Every Learner
            </span>
          </div>
        </div>

        {/* Mobile character - shown only on mobile */}
        <div className="flex lg:hidden justify-center mt-4 flex-1 items-end overflow-hidden">
          <Image
            src="/assets/green-robot-hero.png"
            alt="Thaylo AI Character"
            width={400}
            height={450}
            className="w-[320px] sm:w-[360px] h-auto object-contain drop-shadow-2xl mb-[-40px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function FloatingBadge({ text }: { text: string }) {
  return (
    <div className="px-5 py-4 rounded-[24px] bg-white/[0.1] border border-white/[0.5] shadow-xl" style={{ backdropFilter: "blur(17.5px)", WebkitBackdropFilter: "blur(17.5px)" }}>
      <span className="text-white text-[15px] font-normal whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
        {text}
      </span>
    </div>
  );
}
