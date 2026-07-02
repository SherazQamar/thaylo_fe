export const NO_CLASS_AVAILABLE_TITLE = "No class available yet";

export const NO_CLASS_AVAILABLE_MESSAGE =
  "Your teacher has not published a class for your grade yet. Check back soon — your learning path will appear here once a class is ready.";

export const NO_CLASS_AVAILABLE_SHORT =
  "No published class for your grade yet.";

export function getStartClassErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosError = error as {
      isAxiosError?: boolean;
      response?: { status?: number; data?: { message?: string | string[] } };
    };

    if (axiosError.isAxiosError) {
      const message = axiosError.response?.data?.message;
      if (Array.isArray(message)) return message.join(", ");
      if (typeof message === "string" && message.trim()) return message;
      if (axiosError.response?.status === 404) {
        return NO_CLASS_AVAILABLE_MESSAGE;
      }
    }
  }

  return "Unable to start class right now. Please try again.";
}
