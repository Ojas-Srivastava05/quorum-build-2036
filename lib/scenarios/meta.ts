import type { ScenarioId } from "@/lib/types";

export interface ScenarioMeta {
  id: ScenarioId;
  name: string;
  place: string;
  clock: string;
}

export const SCENARIO_META: ScenarioMeta[] = [
  {
    id: "indore-flood",
    name: "Monsoon flood",
    place: "Indore",
    clock: "18 July 2036 · 19:42 IST",
  },
  {
    id: "heatwave",
    name: "Heatwave",
    place: "Indore",
    clock: "12 May 2036 · 15:10 IST",
  },
  {
    id: "budget-triage",
    name: "Budget triage",
    place: "Indore",
    clock: "2 August 2036 · 11:05 IST",
  },
];

export function getScenarioMeta(id: ScenarioId) {
  return SCENARIO_META.find((item) => item.id === id) ?? SCENARIO_META[0];
}
