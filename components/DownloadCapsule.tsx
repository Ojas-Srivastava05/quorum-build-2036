"use client";

import type { DecisionCapsule } from "@/lib/types";

export function downloadCapsule(capsule: DecisionCapsule) {
  const blob = new Blob([JSON.stringify(capsule, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${capsule.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function DownloadCapsule({ capsule }: { capsule: DecisionCapsule }) {
  return (
    <button type="button" className="text-button" onClick={() => downloadCapsule(capsule)}>
      Export JSON
    </button>
  );
}
