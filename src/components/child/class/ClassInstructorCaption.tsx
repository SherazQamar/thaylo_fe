"use client";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type KaraokeTextProps = {
  text: string;
  visibleWords: number;
  keyPrefix?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function KaraokeText({
  text,
  visibleWords,
  keyPrefix = "word",
  className,
  style,
}: KaraokeTextProps) {
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return null;
  }

  return (
    <span className={className} style={{ ...inter, ...style }}>
      {words.map((word, index) => {
        const isSpoken = index < visibleWords;
        const isCurrent = index === visibleWords - 1 && visibleWords > 0;

        return (
          <span
            key={`${keyPrefix}-${index}`}
            className={
              isCurrent
                ? "text-[#00CED1] font-semibold underline decoration-[#00CED1]/40 underline-offset-4"
                : isSpoken
                  ? "text-white/90"
                  : "text-white/25"
            }
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

type ClassInstructorCaptionProps = {
  text: string;
  visibleWords: number;
  instructorName?: string;
  isSpeaking?: boolean;
};

export default function ClassInstructorCaption({
  text,
  visibleWords,
  instructorName = "AI Instructor",
  isSpeaking = false,
}: ClassInstructorCaptionProps) {
  const spoken = visibleWords > 0;

  return (
    <div
      className="shrink-0 rounded-[12px] border border-[#00CED1]/25 px-4 py-3"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,206,209,0.12) 0%, rgba(0,206,209,0.05) 100%)",
      }}
    >
      <div className="mb-2 flex items-center justify-center gap-2">
        <span
          className={`inline-flex h-2 w-2 rounded-full bg-[#00CED1] ${isSpeaking ? "animate-pulse" : ""}`}
        />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#00CED1]/80" style={inter}>
          {instructorName} {isSpeaking ? "is speaking" : spoken ? "said" : "says"}
        </p>
        {isSpeaking && (
          <span className="inline-flex items-center gap-0.5" aria-hidden>
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                className="inline-block w-0.5 rounded-full bg-[#00CED1] animate-pulse"
                style={{
                  height: `${8 + bar * 3}px`,
                  animationDelay: `${bar * 120}ms`,
                }}
              />
            ))}
          </span>
        )}
      </div>

      <p className="text-center text-sm leading-relaxed" style={inter}>
        <KaraokeText text={text} visibleWords={visibleWords} keyPrefix="caption" />
      </p>
    </div>
  );
}
