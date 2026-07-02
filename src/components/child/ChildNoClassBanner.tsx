import {
  NO_CLASS_AVAILABLE_MESSAGE,
  NO_CLASS_AVAILABLE_TITLE,
} from "@/lib/child-class-messages";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ChildNoClassBannerProps = {
  compact?: boolean;
};

export default function ChildNoClassBanner({ compact = false }: ChildNoClassBannerProps) {
  return (
    <div
      className={
        "rounded-[12px] border border-[#FFC542]/30 flex gap-3 " +
        (compact ? "px-4 py-3" : "px-5 py-4")
      }
      style={{ backgroundColor: "rgba(255, 197, 66, 0.1)" }}
      role="status"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: "rgba(255, 197, 66, 0.18)" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFC542"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="min-w-0">
        <p style={{ ...inter, fontWeight: 700, fontSize: compact ? "13px" : "14px", color: "#FFC542" }}>
          {NO_CLASS_AVAILABLE_TITLE}
        </p>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: compact ? "12px" : "13px",
            color: "rgba(255,255,255,0.65)",
            marginTop: "4px",
            lineHeight: "18px",
          }}
        >
          {NO_CLASS_AVAILABLE_MESSAGE}
        </p>
      </div>
    </div>
  );
}
