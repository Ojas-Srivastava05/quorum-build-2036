import { adversary } from "@/lib/agents/adversary";
import { equity } from "@/lib/agents/equity";
import { ops } from "@/lib/agents/ops";
import type { AgentPersona } from "@/lib/agents/persona";
import { risk } from "@/lib/agents/risk";
import { scout } from "@/lib/agents/scout";
import { sim } from "@/lib/agents/sim";
import type { AgentId } from "@/lib/types";

export const COUNCIL: AgentPersona[] = [scout, risk, sim, equity, ops, adversary];

export const AGENT_IDS: AgentId[] = COUNCIL.map((agent) => agent.id);

const byId = Object.fromEntries(COUNCIL.map((agent) => [agent.id, agent])) as Record<
  AgentId,
  AgentPersona
>;

export function getAgent(id: AgentId) {
  return byId[id];
}

export function councilMessages(scenarioTitle: string) {
  return [
    {
      role: "system" as const,
      content: COUNCIL.map((agent) => `${agent.name} (${agent.role}): ${agent.system}`).join(
        "\n\n",
      ),
    },
    {
      role: "user" as const,
      content: `Deliberate this civic crisis and keep the dissent: ${scenarioTitle}.`,
    },
  ];
}
