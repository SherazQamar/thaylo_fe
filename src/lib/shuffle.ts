/** Fisher–Yates shuffle. Returns a new array; retries so order differs when possible. */
export function shuffleArray<T>(items: T[]): T[] {
  if (items.length < 2) return [...items];

  const copy = [...items];
  for (let attempt = 0; attempt < 8; attempt += 1) {
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const sameOrder = copy.every((item, index) => item === items[index]);
    if (!sameOrder) return copy;
  }
  return copy;
}
