import { AGENT_IDS } from "@/lib/agents/roster";
import { sealCapsule } from "@/lib/capsule/seal";
import { budgetTriage } from "@/lib/scenarios/budget-triage";
import { heatwave } from "@/lib/scenarios/heatwave";
import { indoreFlood } from "@/lib/scenarios/indore-flood";
import type { ForkId, Scenario, ScenarioId, StreamEvent } from "@/lib/types";

export const SCENARIOS: Scenario[] = [indoreFlood, heatwave, budgetTriage];

const FORKS: ForkId[] = ["A", "B", "C"];

function eventsFor(scenario: Scenario, fork: ForkId): StreamEvent[] {
  return [...scenario.open, ...scenario.close(fork)].flatMap((item) => item.events);
}

for (const scenario of SCENARIOS) {
  if (!scenario.open.some((item) => item.events.some((event) => event.type === "fork_gate"))) {
    throw new Error(`${scenario.id} never opens a fork gate`);
  }
  for (const fork of FORKS) {
    const events = eventsFor(scenario, fork);
    if (!events.some((event) => event.type === "seal")) {
      throw new Error(`${scenario.id} ${fork} never seals`);
    }
    if (fork === "C") {
      const turns = events.filter(
        (event): event is Extract<StreamEvent, { type: "turn" }> => event.type === "turn",
      );
      for (const id of AGENT_IDS) {
        if (!turns.some((event) => event.agent === id)) {
          throw new Error(`${scenario.id} never seats ${id}`);
        }
      }
      if (!turns.some((event) => event.agent === "adversary" && event.tone === "challenge")) {
        throw new Error(`${scenario.id} has no adversary challenge`);
      }
    }
    const capsule = sealCapsule(scenario.draft(fork), scenario.sealedAt);
    if (capsule.seal.hash.length !== 64) {
      throw new Error(`${scenario.id} ${fork} seal is not SHA-256`);
    }
  }
}

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}

export function isScenarioId(id: string): id is ScenarioId {
  return SCENARIOS.some((scenario) => scenario.id === id);
}

export function listCapsuleIds() {
  return SCENARIOS.flatMap((scenario) =>
    FORKS.map((fork) => `${scenario.id}-${fork.toLowerCase()}`),
  );
}
