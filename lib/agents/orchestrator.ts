import { councilMessages } from "@/lib/agents/roster";
import { mockProvider, playScript } from "@/lib/providers/mock";
import { resolveProvider } from "@/lib/providers/llm";
import { getScenario } from "@/lib/scenarios";
import type { ForkId, StreamEvent } from "@/lib/types";

export interface DeliberateInput {
  scenarioId: string;
  stage: "open" | "seal";
  fork: ForkId;
  speed: number;
  signal?: AbortSignal;
}

/**
 * Council run: intake → specialists → adversarial rounds → 72h forks →
 * human lock → synthesis → capsule seal.
 * The live LLM seam is resolved and refused unless the mock provider is active.
 */
export async function* deliberate(input: DeliberateInput): AsyncGenerator<StreamEvent> {
  const scenario = getScenario(input.scenarioId);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${input.scenarioId}`);
  }

  const provider = resolveProvider(mockProvider);
  if (provider.id !== mockProvider.id) {
    for await (const chunk of provider.stream(
      {
        scenarioId: scenario.id,
        messages: councilMessages(scenario.title),
      },
      input.signal,
    )) {
      if (chunk) break;
    }
  }

  const beats = input.stage === "seal" ? scenario.close(input.fork) : scenario.open;
  yield* playScript(beats, input.speed, input.signal);
}
