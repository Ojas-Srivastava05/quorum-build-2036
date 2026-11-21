import { beat } from "@/lib/scenarios/beats";
import type { DecisionCapsule, ForkId, ScriptBeat } from "@/lib/types";

export function sealBeats(input: {
  fork: ForkId;
  confidence: number;
  confidenceReason: string;
  ops: string;
  equity: string;
  adversary: string;
  dissent: string;
  operator: string;
  citizen: string;
  capsule: DecisionCapsule;
}): ScriptBeat[] {
  return [
    beat(
      420,
      { type: "lock", fork: input.fork },
      { type: "phase", phase: "synthesis", label: "Synthesis" },
      {
        type: "confidence",
        value: input.confidence,
        reason: input.confidenceReason,
      },
    ),
    beat(2500, {
      type: "turn",
      agent: "ops",
      tone: "synthesis",
      text: input.ops,
    }),
    beat(
      2200,
      { type: "turn", agent: "equity", tone: "synthesis", text: input.equity },
      { type: "brief", operator: input.operator, citizen: input.citizen },
    ),
    beat(
      2300,
      { type: "turn", agent: "adversary", tone: "challenge", text: input.adversary },
      { type: "dissent", agent: "adversary", text: input.dissent },
      { type: "arc", from: "adversary", to: "ops", kind: "strike" },
    ),
    beat(
      900,
      { type: "phase", phase: "seal", label: "Capsule sealed" },
      { type: "seal", capsule: input.capsule },
    ),
    beat(240, { type: "done" }),
  ];
}
