import Image from "next/image";
import guideBg from "@/app/(landing-flow)/assets/guide background.png";

const principlesDesktop = [
  {
    number: "01",
    title: "Understanding matters more than speed",
    description:
      "Learning should move forward when students truly understand, not when a schedule demands it.",
  },
  {
    number: "02",
    title: "Flexibility and rigor must coexist",
    description:
      "Students deserve learning experiences that adapt to real life while maintaining clear academic standards.",
  },
  {
    number: "03",
    title: "Focus is essential for learning",
    description:
      "Thoughtful learning environments reduce unnecessary distractions so students can concentrate.",
  },
  {
    number: "03",
    title: "Technology should support, not dominate",
    description:
      "Tools are used intentionally to enhance instruction, not to remove responsibility or human judgment.",
  },
  {
    number: "04",
    title: "Adults remain accountable",
    description:
      "Educators are ultimately responsible for oversight, decisions, and partnership with families.",
  },
];

const principlesMobile = principlesDesktop.map((p, i) => ({
  ...p,
  number: String(i + 1).padStart(2, "0"),
}));

function PrincipleCard({
  item,
  compact,
}: {
  item: { number: string; title: string; description: string };
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[16.75px] h-full ${
        compact ? "px-6 pt-[33.5px] pb-8" : "p-[33.5px]"
      }`}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(19.54px)",
        WebkitBackdropFilter: "blur(19.54px)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* Number badge — Figma ~70×67 outer / ~58×57 white */}
      <div
        className={`rounded-[12px] bg-white flex items-center justify-center ${
          compact
            ? "w-[58px] h-[57px] mb-6"
            : "w-[60px] h-[57px] mb-[88px]"
        }`}
      >
        <span
          className="text-[#111023] text-[20px] font-medium leading-[30px]"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          {item.number}
        </span>
      </div>
      <h3
        className={`font-medium text-white tracking-[-0.71px] ${
          compact
            ? "text-[26px] leading-[35px] mb-4"
            : "text-[29px] leading-[35px] mb-[17px]"
        }`}
        style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
      >
        {item.title}
      </h3>
      <p
        className={`text-white/70 font-normal tracking-[-0.54px] ${
          compact
            ? "text-[16px] leading-[24px]"
            : "text-[20px] leading-[30px]"
        }`}
        style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
      >
        {item.description}
      </p>
    </div>
  );
}

export default function GuidingPrinciples() {
  return (
    <section className="relative bg-[#050F0A] px-5 lg:px-[53px] py-8 lg:py-[120px] flex flex-col justify-center overflow-hidden">
      <Image
        src={guideBg}
        alt=""
        fill
        className="object-cover object-top"
      />

      <div className="relative z-10 max-w-[1340px] mx-auto w-full">
        {/* Mobile header — Figma: label + 24/32 heading, tight stack */}
        <div className="lg:hidden">
          <div className="flex items-center justify-center gap-[11px]">
            <span
              className="inline-block size-[11px] bg-[#00CED1]"
              style={{ borderRadius: "2px" }}
            />
            <span
              className="text-[18px] font-normal leading-[31px] tracking-[-0.48px] text-white/55"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Ethical Standards
            </span>
          </div>
          <h2
            className="text-[24px] leading-[32px] font-normal text-center mt-[3px] tracking-[-0.64px] text-white"
            style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
          >
            Our Guiding Principles
          </h2>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-center gap-[11px]">
            <span
              className="inline-block size-[11px] bg-[#00CED1]"
              style={{ borderRadius: "2px" }}
            />
            <span
              className="text-[20px] font-normal leading-[31px] tracking-[-0.48px] text-white/50"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Ethical Standards
            </span>
          </div>
          <h2
            className="text-[56px] leading-[76px] font-normal text-center mt-5 tracking-[-0.64px] text-white"
            style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
          >
            Our Guiding Principles
          </h2>
          <p
            className="text-white/70 text-[18px] leading-[30px] tracking-[-0.48px] font-normal text-center max-w-[1090px] mx-auto mt-10 mb-16"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            Thaylo is guided by a clear set of educational principles rooted in
            responsibility, structure, and respect for how students learn. Every
            decision—from pacing to technology use—is shaped by the belief that
            flexibility should support learning, not replace expectations.
          </p>
        </div>

        {/* Mobile cards — Figma: ~28px gap, compact badge→title spacing */}
        <div className="lg:hidden mt-[56px] space-y-7">
          {principlesMobile.map((item) => (
            <PrincipleCard
              key={`m-${item.number}-${item.title}`}
              item={item}
              compact
            />
          ))}
        </div>

        {/* Desktop: 1 full + 2×2 */}
        <div className="hidden lg:block space-y-6">
          <PrincipleCard item={principlesDesktop[0]} />
          <div className="grid grid-cols-2 gap-6">
            {principlesDesktop.slice(1, 3).map((item) => (
              <PrincipleCard key={`d-${item.number}-${item.title}`} item={item} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {principlesDesktop.slice(3, 5).map((item) => (
              <PrincipleCard key={`d-${item.number}-${item.title}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
