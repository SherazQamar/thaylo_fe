import Image from "next/image";

const leftItems = [
  {
    icon: "/assets/certificate-symbol.png",
    title: "Adapts Pace",
    description: "Adapts to their pace and understanding",
  },
  {
    icon: "/assets/handshake-symbol.png",
    title: "Adjust Lessons",
    description: "Adjusts lessons based on progress",
  },
];

const rightItems = [
  {
    icon: "/assets/wayfinder-symbol.png",
    title: "Encourages curiosity",
    description: "Encourages curiosity without pressure",
  },
  {
    icon: "/assets/treat.png",
    title: "Treats mistakes",
    description: "Treats mistakes as part of learning",
  },
];

const allItems = [...leftItems, ...rightItems];

function FeatureBlock({
  icon,
  title,
  description,
  align = "left",
}: {
  icon: string;
  title: string;
  description: string;
  align?: "left" | "right" | "center";
}) {
  const alignClass =
    align === "right"
      ? "text-left lg:text-right"
      : align === "center"
        ? "text-center"
        : "text-left";

  const iconClass =
    align === "right"
      ? "lg:ml-auto"
      : align === "center"
        ? "mx-auto"
        : "";

  return (
    <div className={alignClass}>
      <div
        className={`w-[60px] h-[60px] flex items-center justify-center mb-5 ${iconClass}`}
      >
        <Image
          src={icon}
          alt=""
          width={60}
          height={60}
          className="w-[60px] h-[60px] object-contain"
        />
      </div>
      <h3
        className="font-medium text-[#111023] mb-2 text-[26px] leading-[32px] tracking-[-0.64px]"
        style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
      >
        {title}
      </h3>
      <p
        className="text-[#606B68] font-normal text-[18px] leading-[27px] tracking-[-0.48px]"
        style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
      >
        {description}
      </p>
    </div>
  );
}

export default function PersonalizedMeans() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-[50px] py-12 lg:py-20 flex flex-col justify-center">
      <div className="max-w-[1340px] mx-auto w-full">
        <div className="flex items-center justify-center gap-[10px]">
          <span
            className="inline-block size-[10px] bg-[#00CED1]"
            style={{ borderRadius: "2px" }}
          />
          <span
            className="text-[18px] font-normal leading-[27px] tracking-[-0.48px] text-[#606B68]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            Why Us
          </span>
        </div>

        <h2
          className="text-[24px] leading-[32px] lg:text-[56px] lg:leading-[67.5px] font-normal text-center mt-3 lg:mt-4 mb-10 lg:mb-14 tracking-[-0.64px] text-[#111023] max-w-[327px] lg:max-w-[748px] mx-auto"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          What personalized learning means at THAYLO
        </h2>

        {/* Mobile — stacked + center-aligned (Figma) */}
        <div className="lg:hidden space-y-0">
          {allItems.map((item, idx) => (
            <div
              key={item.title}
              className={idx > 0 ? "pt-6 mt-6 border-t border-[#E2E8F0]" : ""}
            >
              <FeatureBlock {...item} align="center" />
            </div>
          ))}
        </div>

        {/* Desktop — left | Home WHY US character | right */}
        <div className="hidden lg:grid grid-cols-[340px_1fr_340px] gap-8 xl:gap-10 items-center">
          <div className="space-y-0">
            <FeatureBlock {...leftItems[0]} align="left" />
            <div className="my-8 border-t border-[#E2E8F0]" />
            <FeatureBlock {...leftItems[1]} align="left" />
          </div>

          <div className="flex justify-center items-center min-h-[520px]">
            <Image
              src="/assets/new-learning-support.png"
              alt="Thaylo Character"
              width={480}
              height={580}
              className="w-[400px] xl:w-[440px] h-auto object-contain drop-shadow-xl"
              priority
            />
          </div>

          <div className="space-y-0">
            <FeatureBlock {...rightItems[0]} align="right" />
            <div className="my-8 border-t border-[#E2E8F0]" />
            <FeatureBlock {...rightItems[1]} align="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
