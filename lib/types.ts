export type AgentId =
  | "scout"
  | "risk"
  | "sim"
  | "equity"
  | "ops"
  | "adversary";

export type Phase =
  | "intake"
  | "specialists"
  | "adversarial"
  | "forks"
  | "lock"
  | "synthesis"
  | "seal";

export type TurnTone = "report" | "challenge" | "rebuttal" | "synthesis";

export type ForkId = "A" | "B" | "C";

export type ScenarioId = "indore-flood" | "heatwave" | "budget-triage";

export interface WardPatch {
  id: string;
  severity?: number;
  hazard?: number;
  equity?: number;
}

export interface MapDelta {
  wards?: WardPatch[];
  shelters?: { id: string; open: boolean }[];
  corridors?: { id: string; active: boolean }[];
  feeds?: { id: string; on: boolean }[];
}

export interface ForkSnapshot {
  id: ForkId;
  name: string;
  thesis: string;
  severeRisk: number;
  costCr: number;
  equity: number;
  spark: number[];
  confidence: number;
}

export interface DissentNote {
  agent: AgentId;
  text: string;
}

export interface RankedAction {
  rank: number;
  title: string;
  detail: string;
  owner: string;
}

export interface CapsuleDraft {
  id: string;
  scenarioId: ScenarioId;
  scenarioTitle: string;
  city: string;
  clock: string;
  fork: ForkId;
  forkName: string;
  confidence: number;
  rankedActions: RankedAction[];
  tradeoffs: string[];
  dissent: DissentNote[];
  operatorBrief: string;
  citizenBrief: string;
}

export interface DecisionCapsule extends CapsuleDraft {
  seal: {
    algorithm: "SHA-256";
    hash: string;
    sealedAt: string;
  };
}

export type StreamEvent =
  | { type: "phase"; phase: Phase; label: string; legend?: string }
  | { type: "turn"; agent: AgentId; text: string; tone: TurnTone }
  | { type: "map"; delta: MapDelta }
  | { type: "confidence"; value: number; reason: string }
  | { type: "arc"; from: AgentId; to: AgentId; kind: "strike" | "consensus" }
  | { type: "forks"; forks: ForkSnapshot[] }
  | { type: "fork_gate" }
  | { type: "lock"; fork: ForkId }
  | { type: "dissent"; agent: AgentId; text: string }
  | { type: "brief"; operator: string; citizen: string }
  | { type: "seal"; capsule: DecisionCapsule }
  | { type: "error"; message: string }
  | { type: "done" };

export interface ScriptBeat {
  delay: number;
  events: StreamEvent[];
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  city: string;
  clock: string;
  sealedAt: string;
  legend: string;
  forks: ForkSnapshot[];
  open: ScriptBeat[];
  draft: (fork: ForkId) => CapsuleDraft;
  close: (fork: ForkId) => ScriptBeat[];
}
