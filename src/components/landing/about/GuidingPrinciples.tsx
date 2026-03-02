const principles = [
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

function PrincipleCard({
  item,
}: {
  item: (typeof principles)[number];
}) {
  return (
    <div className="bg-white/5 backdrop-blur-[19.54px] rounded-[16.75px] p-5 sm:p-[33.5px]">
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-4 sm:mb-[88.6px]">
        <span className="text-black text-sm font-medium">{item.number}</span>
      </div>
      <h3 className="text-[22px] sm:text-[29.03px] font-medium text-white mb-2 leading-[1.25] sm:leading-[34.84px] tracking-[-0.71px]">
        {item.title}
      </h3>
      <p className="text-[14px] sm:text-[20.1px] text-white/70 leading-[1.6] sm:leading-[30.15px] tracking-[-0.54px] font-normal">
        {item.description}
      </p>
    </div>
  );
}

export default function GuidingPrinciples() {
  return (
    <section className="relative bg-[#0B1D2E] px-4 sm:px-6 lg:px-12 py-12 lg:py-24 flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-100px] w-[400px] h-[400px] bg-[#60D624]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-[3px] bg-[#14B8A6]" />
          <span className="text-sm font-normal tracking-widest text-white/50 uppercase">
            ETHICAL STANDARDS
          </span>
        </div>
        <h2 className="text-xl md:text-3xl lg:text-[2.5rem] font-normal text-center mt-3 mb-4 max-w-3xl mx-auto leading-tight text-white">
          Our Guiding Principles
        </h2>
        <p
          className="text-white/70 text-[13px] sm:text-sm lg:text-base leading-[1.6] font-normal text-center max-w-md sm:max-w-3xl mx-auto mb-8 lg:mb-16"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Thaylo is guided by a clear set of educational principles rooted in
          responsibility, structure, and respect for how students learn. Every
          decision—from pacing to technology use—is shaped by the belief that
          flexibility should support learning, not replace expectations.
        </p>

        <div className="space-y-4 lg:space-y-6">
          <PrincipleCard item={principles[0]} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {principles.slice(1, 3).map((item, idx) => (
              <PrincipleCard key={idx} item={item} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {principles.slice(3, 5).map((item, idx) => (
              <PrincipleCard key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
