import Image from "next/image";
import foundedImage from "@/app/(landing-flow)/assets/founded-image.jpg";
import empowerImage from "@/app/(landing-flow)/assets/empower-image.png";
import teachingImage from "@/app/(landing-flow)/assets/teaching-image.png";
import aboutBg from "@/app/(landing-flow)/assets/aboutbg.png";

const milestones = [
  {
    year: "2020",
    title: "Founded Innovative AI Course For Beginners",
    image: foundedImage,
    highlight: false,
  },
  {
    year: "2023",
    title: "Empower Global Students Through AI",
    image: empowerImage,
    highlight: true,
  },
  {
    year: "2025",
    title: "Teaching AI to 10,000 Students Worldwide",
    image: teachingImage,
    highlight: false,
  },
];

export default function MilestonePath() {
  return (
    <section className="bg-[#F1F5F9] px-6 lg:px-[47px] py-6 lg:py-[120px] flex flex-col justify-center">
      <div className="max-w-[1346px] mx-auto w-full">
        <div className="flex items-center justify-center gap-[10px] mb-0">
          <span
            className="inline-block size-[10px] bg-[#00CED1]"
            style={{ borderRadius: "2px" }}
          />
          <span
            className="text-[18px] font-normal leading-[27px] tracking-[-0.48px] text-[#606B68]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            Milestone Path
          </span>
        </div>

        {/* Figma desktop heading ~611×135 (2 lines @ ~56px); mobile 327×64 */}
        <h2
          className="text-[24px] leading-[32px] lg:text-[56px] lg:leading-[67.5px] font-normal text-center mt-[19px] lg:mt-[19px] mb-8 lg:mb-[50px] max-w-[327px] lg:max-w-[611px] mx-auto tracking-[-0.64px] text-[#0C211D]"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          A Journey of Knowledge Driving Real Growth
        </h2>

        {/* Figma: 3 cards × ~433w × ~422h, 24px gaps, 15px inner inset */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6">
          {milestones.map((milestone) => (
            <article
              key={milestone.year}
              className={`relative rounded-[16px] overflow-hidden flex flex-col h-auto lg:h-[422px] ${
                milestone.highlight ? "bg-[#050F0A]" : "bg-white"
              }`}
            >
              {milestone.highlight && (
                <Image
                  src={aboutBg}
                  alt=""
                  fill
                  className="object-cover object-top pointer-events-none"
                />
              )}

              <div className="relative z-10 flex flex-col h-full px-[15px] pt-3 pb-0">
                <div className="pt-[18px] lg:pt-[30px] pb-4 lg:pb-0 lg:min-h-[189px]">
                  <p
                    className={`text-[18px] leading-[27px] tracking-[-0.48px] font-normal mb-[9px] ${
                      milestone.highlight ? "text-white/55" : "text-[#606B68]"
                    }`}
                    style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
                  >
                    {milestone.year}
                  </p>
                  <h3
                    className={`text-[22px] lg:text-[26px] font-medium leading-[31px] tracking-[-0.64px] ${
                      milestone.highlight ? "text-white" : "text-[#111023]"
                    }`}
                    style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
                  >
                    {milestone.title}
                  </h3>
                </div>

                {/* Image band — Figma 402×208 (desktop) / 297×208 (mobile), inset 15px */}
                <div className="relative w-full h-[208px] mt-auto rounded-t-none overflow-hidden mb-0">
                  <Image
                    src={milestone.image}
                    alt={milestone.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
