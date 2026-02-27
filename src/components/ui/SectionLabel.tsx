import React from "react";

interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({
  text,
  className = "",
}: SectionLabelProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
      <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
        {text}
      </span>
    </div>
  );
}
