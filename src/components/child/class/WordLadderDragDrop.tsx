"use client";

import { useCallback, useMemo, useState } from "react";
import OptionHintButton from "@/components/child/class/OptionHintButton";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type WordLadderDragDropProps = {
  words: Array<{ id: string; label: string; hint?: string }>;
  showHints?: boolean;
  disabled?: boolean;
  submitted?: boolean;
  isCorrect?: boolean | null;
  compact?: boolean;
  onSubmit: (orderedIds: string[]) => void;
};

function shuffleWords(words: Array<{ id: string; label: string; hint?: string }>) {
  const copy = [...words];
  for (let attempt = 0; attempt < 8; attempt += 1) {
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const shuffledIds = copy.map((w) => w.id).join(",");
    const originalIds = words.map((w) => w.id).join(",");
    if (shuffledIds !== originalIds || words.length < 3) {
      return copy;
    }
  }
  return copy;
}

export default function WordLadderDragDrop({
  words,
  showHints = false,
  disabled = false,
  submitted = false,
  isCorrect = null,
  compact = false,
  onSubmit,
}: WordLadderDragDropProps) {
  const initialOrder = useMemo(() => shuffleWords(words), [words]);
  const [order, setOrder] = useState(initialOrder);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const moveItem = useCallback((from: number, to: number) => {
    if (from === to) return;
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const handleSubmit = () => {
    if (disabled || submitted) return;
    onSubmit(order.map((item) => item.id));
  };

  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      {!compact && (
        <p className="text-xs text-white/45" style={inter}>
          Drag words to order them from weakest (top) to strongest (bottom).
        </p>
      )}

      <ol className={compact ? "space-y-1" : "space-y-2"}>
        {order.map((word, index) => {
          const isDragging = dragIndex === index;
          const isDropTarget = dragOverIndex === index && dragIndex !== index;

          return (
            <li
              key={word.id}
              draggable={!disabled && !submitted}
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverIndex(index);
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex == null) return;
                moveItem(dragIndex, index);
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              className={`flex items-center gap-2 rounded-xl cursor-grab active:cursor-grabbing transition-all ${compact ? "px-2.5 py-1.5" : "px-4 py-3 gap-3"}`}
              style={{
                border: `2px solid ${isDropTarget ? "#00CED1" : "rgba(255,255,255,0.2)"}`,
                backgroundColor: isDragging
                  ? "rgba(0,206,209,0.12)"
                  : "rgba(0,0,0,0.25)",
                opacity: isDragging ? 0.65 : 1,
                ...inter,
              }}
            >
              <span
                className={`rounded-full flex items-center justify-center shrink-0 font-bold ${compact ? "w-5 h-5 text-[10px]" : "w-7 h-7 text-xs"}`}
                style={{ backgroundColor: "rgba(0,206,209,0.2)", color: "#00CED1" }}
              >
                {index + 1}
              </span>
              <span className="flex-1 min-w-0" style={{ fontWeight: 600, fontSize: compact ? "clamp(11px, 1.8vh, 13px)" : "14px", color: "#E8F5E9" }}>
                {word.label}
              </span>
              {showHints && word.hint?.trim() && (
                <OptionHintButton hint={word.hint.trim()} compact={compact} placement="above" />
              )}
              {!compact && (
              <svg
                className="ml-auto shrink-0 opacity-40"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="5" r="1.5" fill="currentColor" />
                <circle cx="9" cy="12" r="1.5" fill="currentColor" />
                <circle cx="9" cy="19" r="1.5" fill="currentColor" />
                <circle cx="15" cy="5" r="1.5" fill="currentColor" />
                <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                <circle cx="15" cy="19" r="1.5" fill="currentColor" />
              </svg>
              )}
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <button
          type="button"
          disabled={disabled}
          onClick={handleSubmit}
          className={`relative z-10 w-full rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 ${compact ? "py-2.5 text-xs" : "py-3 text-sm"}`}
          style={{
            backgroundColor: "#00CED1",
            color: "#111023",
            ...inter,
          }}
        >
          Check my order
        </button>
      ) : (
        <p
          className={`text-center ${compact ? "text-xs" : "text-sm"}`}
          style={{
            ...inter,
            color: isCorrect ? "#00CED1" : "#FFC542",
          }}
        >
          {isCorrect
            ? "Perfect order! Great job on the Word Ladder."
            : "Thanks for trying — let's wrap up this lesson."}
        </p>
      )}
    </div>
  );
}
