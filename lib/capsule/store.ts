import { sealCapsule } from "@/lib/capsule/seal";
import { getScenario, listCapsuleIds } from "@/lib/scenarios";
import type { DecisionCapsule, ForkId } from "@/lib/types";

export function capsuleId(scenarioId: string, fork: ForkId) {
  return `${scenarioId}-${fork.toLowerCase()}`;
}

export function getCapsule(id: string): DecisionCapsule | null {
  const match = /^([a-z0-9-]+)-([abc])$/.exec(id);
  if (!match) return null;
  const scenario = getScenario(match[1]);
  if (!scenario) return null;
  const fork = match[2].toUpperCase() as ForkId;
  return sealCapsule(scenario.draft(fork), scenario.sealedAt);
}

export function allCapsuleIds() {
  return listCapsuleIds();
}
