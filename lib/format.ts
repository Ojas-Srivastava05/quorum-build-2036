export function formatHash(hash: string) {
  return hash.replace(/(.{4})/g, "$1 ").trim();
}

export function formatConfidence(value: number | null) {
  if (value === null) return "—";
  return value.toFixed(2);
}
