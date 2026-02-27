import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="home"
      className="snap-section relative h-screen bg-[#0B1D2E] overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] bg-[#60D624]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-100px] w-[300px] h-[300px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Outer border glow */}
      <div className="absolute inset-3 sm:inset-4 md:inset-6 rounded-[24px] border border-[#14B8A6]/15 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#14B8A6]/20 to-transparent" />
      </div>

      {/* Character - absolute positioned, large, clipped at bottom */}
      <div className="absolute right-0 lg:right-[5%] xl:right-[8%] top-[5%] bottom-0 w-[50%] lg:w-[45%] z-[5] flex justify-center">
        <Image
          src="/assets/green-robot-hero.png"
          alt="Thaylo AI Character"
          width={800}
          height={900}
          className="w-full h-[110%] object-cover object-top drop-shadow-2xl"
          priority
        />
      </div>

      {/* Floating badges - absolute to section */}
      <div className="absolute top-[28%] right-[4%] xl:right-[6%] z-20 animate-float">
        <FloatingBadge text="Mastery-Based Progression" />
      </div>
      <div className="absolute bottom-[8%] left-[38%] lg:left-[40%] z-20 animate-float-delayed">
        <FloatingBadge text="Designed for Real Learning" />
      </div>
      <div className="absolute bottom-[6%] right-[4%] xl:right-[6%] z-20 animate-float-slow">
        <FloatingBadge text="Human-Guided AI" />
      </div>

      {/* Left Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 h-full flex items-end pb-12 lg:pb-16">
        <div className="max-w-[55%] space-y-7 lg:space-y-9 pb-8 lg:pb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] xl:text-[72px] font-normal text-white leading-[1.2] tracking-[-0.64px]">
            Rooted In Learning,
            <br />
            Blooming Into
            <br />
            Brilliance.
          </h1>

          <div className="flex flex-wrap gap-5">
            <Button variant="primary" className="px-8 py-4 text-[15px] font-normal shadow-lg shadow-green-500/25">
              See How Thaylo Works
            </Button>
            <Button variant="outline" className="px-8 py-4 text-[15px] font-normal">
              Explore The 4th Grade Pilot
            </Button>
          </div>

          {/* Avatar group */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-[2.5px] border-[#0B1D2E]" />
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-[2.5px] border-[#0B1D2E]" />
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border-[2.5px] border-[#0B1D2E]" />
            </div>
            <span className="text-white/70 text-sm font-normal">
              Personalized for Every Learner
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingBadge({ text }: { text: string }) {
  return (
    <div className="px-5 py-3 rounded-[20px] bg-white/[0.07] border border-white/[0.12] backdrop-blur-xl shadow-lg">
      <span className="text-white/90 text-xs sm:text-sm font-normal whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
