const PARENT_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export const PARENT_PASSWORD_REQUIREMENTS =
  "At least 6 characters with 1 uppercase letter, 1 lowercase letter, and 1 number.";

export function validateParentPassword(password: string): string | null {
  if (!PARENT_PASSWORD_REGEX.test(password)) {
    return PARENT_PASSWORD_REQUIREMENTS;
  }
  return null;
}

export function validatePasswordConfirm(password: string, confirmPassword: string): string | null {
  if (!confirmPassword.trim()) {
    return "Please confirm your password.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}
