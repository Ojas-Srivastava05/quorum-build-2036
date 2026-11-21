import { createHash } from "node:crypto";
import type { CapsuleDraft, DecisionCapsule } from "@/lib/types";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

export function sealCapsule(draft: CapsuleDraft, sealedAt: string): DecisionCapsule {
  const hash = createHash("sha256").update(stableStringify(draft)).digest("hex");
  return {
    ...draft,
    seal: {
      algorithm: "SHA-256",
      hash,
      sealedAt,
    },
  };
}
