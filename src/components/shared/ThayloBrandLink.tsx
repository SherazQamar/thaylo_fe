import Image from "next/image";
import Link from "next/link";

type BrandSize = "sm" | "md";

interface ThayloBrandLinkProps {
  size?: BrandSize;
  className?: string;
}

const sizeConfig: Record<
  BrandSize,
  { image: number; imageClass: string; titleClass: string; subtitleClass: string }
> = {
  sm: {
    image: 40,
    imageClass: "w-10 h-10",
    titleClass: "text-[18px]",
    subtitleClass: "text-[7px]",
  },
  md: {
    image: 48,
    imageClass: "w-12 h-12",
    titleClass: "text-[20px]",
    subtitleClass: "text-[8px]",
  },
};

export default function ThayloBrandLink({
  size = "md",
  className = "",
}: ThayloBrandLinkProps) {
  const config = sizeConfig[size];

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity ${className}`}
      aria-label="Go to Thaylo home page"
    >
      <Image
        src="/assets/logo.png"
        alt="Thaylo"
        width={config.image}
        height={config.image}
        className={`${config.imageClass} object-contain`}
      />
      <div className="leading-none">
        <span
          className={`block ${config.titleClass} font-medium tracking-[0.08em]`}
          style={{
            background: "linear-gradient(90deg, #60D624, #00A19A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          THAYLO
        </span>
        <span
          className={`block ${config.subtitleClass} tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5`}
        >
          GLOBAL AI SCHOOL
        </span>
      </div>
    </Link>
  );
}
