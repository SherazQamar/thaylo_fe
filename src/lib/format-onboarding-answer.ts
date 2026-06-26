export function formatOnboardingAnswerValue(
  questionType: string,
  value: Record<string, unknown>,
): string {
  if (typeof value.selectedOption === "string" && value.selectedOption) {
    return value.selectedOption;
  }
  if (typeof value.text === "string" && value.text.trim()) {
    return value.text.trim();
  }
  if (Array.isArray(value.selectedOptions) && value.selectedOptions.length > 0) {
    return value.selectedOptions.join(", ");
  }
  if (questionType === "ICON_MATRIX" && Array.isArray(value.selectedOptions)) {
    return value.selectedOptions.length
      ? value.selectedOptions.join(", ")
      : "No items selected";
  }
  return "—";
}
