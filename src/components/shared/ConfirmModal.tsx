"use client";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "teal" | "danger";
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "teal",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmClass =
    tone === "danger"
      ? "bg-[#FF6F6F] hover:bg-[#F05555] text-white"
      : "bg-[#00CED1] hover:bg-[#00B8BB] text-[#111023]";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 cursor-pointer"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-md rounded-[20px] border border-[#525162]/50 bg-[#313044] p-6 shadow-xl"
        style={inter}
      >
        <h2
          id="confirm-modal-title"
          className="text-white text-lg font-semibold"
        >
          {title}
        </h2>
        <p className="text-white/60 text-sm mt-2 leading-relaxed">{description}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-white/70 border border-white/15 hover:bg-white/5 cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full font-semibold cursor-pointer disabled:opacity-60 ${confirmClass}`}
          >
            {isConfirming ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
