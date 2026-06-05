export function isVerificationCodeExpiredMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("expired") ||
    normalized.includes("expire")
  );
}

export function isInvalidVerificationCodeMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("invalid verification code");
}
