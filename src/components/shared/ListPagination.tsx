"use client";

import type { PaginatedMeta } from "@/types/api";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

interface ListPaginationProps {
  meta: PaginatedMeta | null;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  itemLabel?: string;
}

export default function ListPagination({
  meta,
  onPageChange,
  isLoading,
  itemLabel = "students",
}: ListPaginationProps) {
  if (!meta || meta.total === 0) return null;

  const start = (meta.currentPage - 1) * meta.perPage + 1;
  const end = Math.min(meta.currentPage * meta.perPage, meta.total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 mt-4 border-t border-white/5">
      <p className="text-white/40 text-xs">
        Showing {start}-{end} of {meta.total} {itemLabel}
      </p>

      {meta.lastPage > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!meta.prev || isLoading}
            onClick={() => meta.prev && onPageChange(meta.prev)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#00CED1] hover:bg-[#00CED1]/10 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous page"
          >
            <ChevronIcon direction="left" />
          </button>
          <span className="text-white/50 text-xs">
            Page {meta.currentPage} of {meta.lastPage}
          </span>
          <button
            type="button"
            disabled={!meta.next || isLoading}
            onClick={() => meta.next && onPageChange(meta.next)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#00CED1] hover:bg-[#00CED1]/10 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next page"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}
