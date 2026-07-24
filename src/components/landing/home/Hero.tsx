import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-[#111023] overflow-hidden rounded-b-[24px] lg:rounded-b-none lg:min-h-[814px]"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[520px] bg-[#00696B]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-40px] right-[-80px] w-[420px] h-[420px] bg-[#60D624]/6 rounded-full blur-[110px]" />
        <div className="absolute top-[35%] left-[-80px] w-[260px] h-[260px] bg-[#14B8A6]/6 rounded-full blur-[90px]" />
      </div>

      {/* Desktop character — shifted left toward copy */}
      <div className="hidden lg:flex absolute right-[-2%] xl:right-[4%] top-[6%] bottom-0 w-[52%] xl:w-[50%] z-[5] justify-center items-end pointer-events-none">
        <Image
          src="/assets/new-hero.png"
          alt="Calyx, your Bloom Buddy"
          width={792}
          height={792}
          className="w-full max-w-[760px] h-auto object-contain object-bottom drop-shadow-2xl -translate-x-[6%] xl:-translate-x-[10%]"
          priority
        />
      </div>

      {/* Floating badges — desktop only (moved left with character) */}
      <div className="hidden lg:block absolute top-[22%] right-[14%] xl:right-[16%] z-20 animate-float">
        <FloatingBadge text="Mastery-Based Progression" />
      </div>
      <div className="hidden lg:block absolute bottom-[18%] left-[38%] xl:left-[40%] z-20 animate-float-delayed">
        <FloatingBadge text="Designed for Real Learning" />
      </div>
      <div className="hidden lg:block absolute bottom-[18%] right-[10%] xl:right-[12%] z-20 animate-float-slow">
        <FloatingBadge text="Human-Guided AI" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-[50px] pt-[89px] lg:pt-[216px] pb-0 lg:pb-[90px]">
        <div className="w-full lg:max-w-[696px] text-center lg:text-left">
          <h1
            className="text-[32px] leading-[42px] sm:text-[40px] sm:leading-[48px] lg:text-[64px] lg:leading-[86px] font-normal text-white tracking-[-0.64px]"
            style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
          >
            Rooted In Learning,
            <br className="hidden lg:block" />{" "}
            <span className="lg:hidden"> </span>
            Blooming Into
            <br />
            Brilliance.
          </h1>

          <div className="mt-6 lg:mt-10 flex flex-wrap gap-4 lg:gap-[25px] justify-center lg:justify-start">
            <Link
              href="/learning-approach"
              className="inline-flex items-center justify-center h-[50px] lg:h-[58px] px-6 lg:px-8 text-[14px] lg:text-[15px] font-normal text-white bg-gradient-to-r from-[#60D624] to-[#00696B] hover:opacity-90 shadow-lg shadow-green-500/20 transition-all duration-300"
              style={{
                borderRadius: "12px",
                fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
              }}
            >
              See How Thaylo Works
            </Link>
            {/* Second CTA — desktop / web only */}
            <Link
              href="/parent-register"
              className="hidden lg:inline-flex items-center justify-center h-[58px] px-8 text-[15px] font-normal border-2 border-white/40 text-white bg-transparent hover:bg-white/10 transition-all duration-300"
              style={{
                borderRadius: "12px",
                fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
              }}
            >
              Explore the 4th Grade Pilot
            </Link>
          </div>

          {/* Avatar social proof — desktop / web only */}
          <div className="hidden lg:flex items-center gap-[30px] mt-16">
            <div className="flex">
              <Image
                src="/assets/hero 1.jpg"
                alt=""
                width={60}
                height={60}
                className="size-[60px] rounded-full border-[3px] border-[#111023] object-cover relative z-[3]"
              />
              <Image
                src="/assets/hero 2.jpg"
                alt=""
                width={60}
                height={60}
                className="size-[60px] rounded-full border-[3px] border-[#111023] object-cover -ml-3 relative z-[2]"
              />
              <Image
                src="/assets/hero 3.jpg"
                alt=""
                width={60}
                height={60}
                className="size-[60px] rounded-full border-[3px] border-[#111023] object-cover -ml-3 relative z-[1]"
              />
            </div>
            <span
              className="text-white text-[18px] font-normal leading-[22px] tracking-[-0.48px]"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Personalized for Every Learner
            </span>
          </div>
        </div>

        {/* Mobile character — below centered copy */}
        <div className="flex lg:hidden justify-center mt-8 overflow-hidden">
          <Image
            src="/assets/new-hero.png"
            alt="Calyx, your Bloom Buddy"
            width={303}
            height={345}
            className="w-[303px] h-auto object-contain drop-shadow-2xl mb-[-8px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function FloatingBadge({ text }: { text: string }) {
  return (
    <div
      className="px-5 py-[20px] rounded-[24px] bg-white/10 border border-white/50 shadow-xl"
      style={{
        backdropFilter: "blur(17.5px)",
        WebkitBackdropFilter: "blur(17.5px)",
      }}
    >
      <span
        className="text-white text-[15px] font-normal leading-[22px] whitespace-nowrap"
        style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
      >
        {text}
      </span>
    </div>
  );
}
