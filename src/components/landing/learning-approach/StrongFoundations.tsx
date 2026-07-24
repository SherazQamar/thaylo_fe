import Image from "next/image";

const foundations = [
  "Strong fundamentals",
  "Positive learning habits",
  "Confidence to explore new ideas",
  "A healthy relationship with learning",
];

export default function StrongFoundations() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-[50px] py-12 lg:py-16 flex flex-col justify-center">
      <div className="max-w-[1340px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[672fr_576fr] gap-8 lg:gap-[92px] items-center">
          {/* Text — left on desktop, top on mobile */}
          <div>
            <div className="flex items-center gap-[10px] mb-3">
              <span
                className="inline-block size-[10px] bg-[#00CED1]"
                style={{ borderRadius: "2px" }}
              />
              <span
                className="text-[18px] font-normal leading-[27px] tracking-[-0.48px] text-[#606B68]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                Personalized learning
              </span>
            </div>

            <h2
              className="text-[24px] leading-[32px] lg:text-[56px] lg:leading-[67.5px] font-normal tracking-[-0.64px] text-[#111023] mb-4 lg:mb-5 max-w-[327px] lg:max-w-[672px]"
              style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
            >
              Building strong learning foundations
            </h2>

            <p
              className="text-[#606B68] font-normal mb-6 text-[16px] lg:text-[18px] leading-[27px] tracking-[-0.48px] max-w-[327px] lg:max-w-[672px]"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Early learning shapes how children think, solve problems, and build
              confidence in the future. By personalizing learning early, THAYLO
              helps children develop:
            </p>

            <ul className="space-y-4">
              {foundations.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Image
                    src="/assets/mdi_tick-circle-outline.png"
                    alt=""
                    width={24}
                    height={24}
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <span
                    className="text-[#606B68] font-normal text-[16px] lg:text-[18px] leading-[27px] tracking-[-0.48px]"
                    style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image — Figma desktop 576×485; mobile 327×279 below text */}
          <div className="relative rounded-2xl overflow-hidden h-[279px] lg:h-[485px] bg-[#F1F5F9]">
            <Image
              src="/assets/building.jpg"
              alt="Building strong learning foundations"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
