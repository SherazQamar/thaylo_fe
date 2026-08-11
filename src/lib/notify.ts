import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/auth-api";

/**
 * Single entry-point for user-facing toasts across thaylo-fe.
 * Prefer notify.error(err) in catch / onError handlers instead of inline red banners.
 */
export const notify = {
  error(error: unknown, fallback?: string) {
    const message =
      typeof error === "string"
        ? error.trim()
        : getApiErrorMessage(error, fallback ?? "Something went wrong. Please try again.");
    if (!message) return;
    toast.error(message);
  },

  success(message: string) {
    const text = message.trim();
    if (!text) return;
    toast.success(text);
  },

  info(message: string) {
    const text = message.trim();
    if (!text) return;
    toast.info(text);
  },

  warning(message: string) {
    const text = message.trim();
    if (!text) return;
    toast.warning(text);
  },
};
