"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { notify } from "@/lib/notify";
import {
  createWayfinderChildNote,
  deleteWayfinderChildNote,
  fetchWayfinderChildNotes,
  sendWayfinderChildNoteToParent,
  updateWayfinderChildNote,
  wayfinderQueryKeys,
  type WayfinderChildNote,
} from "@/lib/wayfinder-api";

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

type PendingAction =
  | { type: "send"; note: WayfinderChildNote }
  | { type: "delete"; note: WayfinderChildNote }
  | null;

interface WayfinderChildNotesDrawerProps {
  open: boolean;
  childId: number;
  onClose: () => void;
}

export default function WayfinderChildNotesDrawer({
  open,
  childId,
  onClose,
}: WayfinderChildNotesDrawerProps) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);

  const notesQuery = useQuery({
    queryKey: wayfinderQueryKeys.studentNotes(childId),
    queryFn: () => fetchWayfinderChildNotes(childId),
    enabled: open && childId > 0,
  });

  const notes = notesQuery.data ?? [];

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: wayfinderQueryKeys.studentNotes(childId),
    });
  };

  const createMutation = useMutation({
    mutationFn: (body: string) => createWayfinderChildNote(childId, body),
    onSuccess: async () => {
      setDraft("");
      await invalidate();
      notify.success("Note added");
    },
    onError: (err) => notify.error(err),
  });

  const updateMutation = useMutation({
    mutationFn: ({ noteId, body }: { noteId: number; body: string }) =>
      updateWayfinderChildNote(childId, noteId, body),
    onSuccess: async () => {
      setEditingId(null);
      setEditDraft("");
      await invalidate();
      notify.success("Note updated");
    },
    onError: (err) => notify.error(err),
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: number) => deleteWayfinderChildNote(childId, noteId),
    onSuccess: async () => {
      setPending(null);
      await invalidate();
      notify.success("Note deleted");
    },
    onError: (err) => notify.error(err),
  });

  const sendMutation = useMutation({
    mutationFn: (noteId: number) => sendWayfinderChildNoteToParent(childId, noteId),
    onSuccess: async () => {
      setPending(null);
      await invalidate();
      notify.success("Note sent to parent");
    },
    onError: (err) => notify.error(err),
  });

  const busy = useMemo(
    () =>
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      sendMutation.isPending,
    [
      createMutation.isPending,
      updateMutation.isPending,
      deleteMutation.isPending,
      sendMutation.isPending,
    ],
  );

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) {
      notify.error("Write a note before adding.");
      return;
    }
    createMutation.mutate(body);
  }

  function startEdit(note: WayfinderChildNote) {
    setEditingId(note.id);
    setEditDraft(note.body);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft("");
  }

  function saveEdit() {
    if (editingId == null) return;
    const body = editDraft.trim();
    if (!body) {
      notify.error("Note cannot be empty.");
      return;
    }
    updateMutation.mutate({ noteId: editingId, body });
  }

  function handleConfirmPending() {
    if (!pending) return;
    if (pending.type === "send") {
      sendMutation.mutate(pending.note.id);
      return;
    }
    deleteMutation.mutate(pending.note.id);
  }

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
            <h2 className="text-white text-lg font-bold">Wayfinder notes</h2>
            <p className="text-white/45 text-xs mt-1">
              Private until you send to parent
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

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <form onSubmit={handleAdd} className="space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Add a note about this student…"
              className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#00CED1]/50 resize-y min-h-[84px]"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-white/30 text-xs">{draft.length}/2000</span>
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="px-4 py-2 rounded-xl bg-[#00CED1] text-[#111023] text-sm font-semibold hover:bg-[#00B8BB] transition-colors disabled:opacity-40 cursor-pointer"
              >
                {createMutation.isPending ? "Adding…" : "Add note"}
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {notesQuery.isLoading && (
              <p className="text-white/40 text-sm">Loading notes…</p>
            )}
            {!notesQuery.isLoading && notes.length === 0 && (
              <p className="text-white/40 text-sm">No notes yet for this student.</p>
            )}

            {notes.map((note) => {
              const sent = !!note.sentToParentAt;
              const isEditing = editingId === note.id;

              return (
                <article
                  key={note.id}
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{
                        color: sent ? "#86EFAC" : "#FDE68A",
                        backgroundColor: sent
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(251,191,36,0.12)",
                      }}
                    >
                      {sent ? "Sent to parent" : "Internal only"}
                    </span>
                    <span className="text-white/35 text-xs">
                      {formatNoteDate(note.updatedAt)}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        rows={3}
                        maxLength={2000}
                        className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#00CED1]/50 resize-y"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={saveEdit}
                          className="px-3 py-1.5 rounded-lg bg-[#00CED1] text-[#111023] text-xs font-semibold cursor-pointer disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={cancelEdit}
                          className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 text-xs font-semibold cursor-pointer disabled:opacity-40"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">
                      {note.body}
                    </p>
                  )}

                  {!isEditing && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => startEdit(note)}
                        className="px-3 py-1.5 rounded-lg border border-[#00CED1]/50 text-[#00CED1] text-xs font-semibold hover:bg-[#00CED1]/10 cursor-pointer disabled:opacity-40"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setPending({ type: "delete", note })}
                        className="px-3 py-1.5 rounded-lg border border-[#FF6F6F]/50 text-[#FF9B9B] text-xs font-semibold hover:bg-[#FF6F6F]/10 cursor-pointer disabled:opacity-40"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        disabled={busy || sent}
                        onClick={() => setPending({ type: "send", note })}
                        className="px-3 py-1.5 rounded-lg bg-[#00CED1] text-[#111023] text-xs font-semibold hover:bg-[#00B8BB] cursor-pointer disabled:opacity-40"
                      >
                        {sent ? "Sent" : "Send to parent"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </aside>

      <ConfirmModal
        open={pending?.type === "send"}
        title="Send note to parent?"
        description="They will see this note on the child profile under Messages → Wayfinder sent note."
        confirmLabel="Send to parent"
        tone="teal"
        isConfirming={sendMutation.isPending}
        onCancel={() => setPending(null)}
        onConfirm={handleConfirmPending}
      />

      <ConfirmModal
        open={pending?.type === "delete"}
        title="Delete this note?"
        description={
          pending?.type === "delete" && pending.note.sentToParentAt
            ? "This note was already sent. Deleting it will also remove it from the parent’s view."
            : "This cannot be undone."
        }
        confirmLabel="Delete note"
        tone="danger"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setPending(null)}
        onConfirm={handleConfirmPending}
      />
    </>
  );
}
