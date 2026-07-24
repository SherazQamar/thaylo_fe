import React from "react";

interface SectionLabelProps {
  text: string;
  className?: string;
  /** Figma sometimes uses title case (Why Us / Success Stories) vs all-caps */
  uppercase?: boolean;
}

export default function SectionLabel({
  text,
  className = "",
  uppercase = true,
}: SectionLabelProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="w-[10px] h-[10px] bg-[#00CED1]" style={{ borderRadius: "2px" }} />
      <span
        className={`text-[18px] font-normal leading-[27px] tracking-[-0.48px] text-[#606B68] ${
          uppercase ? "uppercase" : ""
        }`}
        style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
      >
        {text}
      </span>
    </div>
  );
}
