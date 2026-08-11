"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { notify } from "@/lib/notify";
import {
  acknowledgeParentWayfinderNote,
  fetchParentWayfinderNotes,
  type ParentWayfinderNote,
} from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatNoteDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

interface ParentWayfinderNotesDrawerProps {
  open: boolean;
  childId: number;
  onClose: () => void;
}

export default function ParentWayfinderNotesDrawer({
  open,
  childId,
  onClose,
}: ParentWayfinderNotesDrawerProps) {
  const queryClient = useQueryClient();
  const [pendingNote, setPendingNote] = useState<ParentWayfinderNote | null>(
    null,
  );

  const notesQuery = useQuery({
    queryKey: ["parent-child-wayfinder-notes", childId],
    queryFn: () => fetchParentWayfinderNotes(childId),
    enabled: open && childId > 0,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (noteId: number) =>
      acknowledgeParentWayfinderNote(childId, noteId),
    onSuccess: async () => {
      setPendingNote(null);
      await queryClient.invalidateQueries({
        queryKey: ["parent-child-wayfinder-notes", childId],
      });
      notify.success("Note acknowledged");
    },
    onError: (err) => notify.error(err),
  });

  const notes: ParentWayfinderNote[] = notesQuery.data ?? [];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[440px] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#313044", ...inter }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-white text-lg font-bold">Notes from Wayfinder</h2>
            <p className="text-white/45 text-xs mt-1">
              Updates shared with you about your child
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {notesQuery.isLoading && (
            <p className="text-white/40 text-sm">Loading notes…</p>
          )}

          {!notesQuery.isLoading && notes.length === 0 && (
            <p className="text-white/40 text-sm">
              No notes from the Wayfinder yet.
            </p>
          )}

          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    color: "#67E8F9",
                    backgroundColor: "rgba(0,206,209,0.12)",
                  }}
                >
                  From {note.wayfinderName?.trim() || "Wayfinder"}
                </span>
                <span className="text-white/35 text-xs">
                  Sent {formatNoteDate(note.sentToParentAt)}
                </span>
              </div>
              <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">
                {note.body}
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  disabled={acknowledgeMutation.isPending}
                  onClick={() => setPendingNote(note)}
                  className="px-3 py-1.5 rounded-lg bg-[#00CED1] text-[#111023] text-xs font-semibold hover:bg-[#00B8BB] cursor-pointer disabled:opacity-40"
                >
                  Acknowledge
                </button>
              </div>
            </article>
          ))}
        </div>
      </aside>

      <ConfirmModal
        open={!!pendingNote}
        title="Acknowledge this note?"
        description="This clears the note for you and removes it from the Wayfinder’s list as well."
        confirmLabel="Acknowledge"
        tone="teal"
        isConfirming={acknowledgeMutation.isPending}
        onCancel={() => setPendingNote(null)}
        onConfirm={() => {
          if (pendingNote) acknowledgeMutation.mutate(pendingNote.id);
        }}
      />
    </>
  );
}
