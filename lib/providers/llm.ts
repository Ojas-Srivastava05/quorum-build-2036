export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  scenarioId: string;
  messages: LLMMessage[];
  temperature?: number;
}

/**
 * Seam for a future live model. This build never calls a hosted LLM
 * and never reads an API key.
 */
export interface LLMProvider {
  readonly id: string;
  stream(request: LLMRequest, signal?: AbortSignal): AsyncIterable<string>;
}

export class UnconfiguredLLMProvider implements LLMProvider {
  readonly id = "llm-unconfigured";

  async *stream(): AsyncIterable<string> {
    throw new Error(
      "Quorum has no live model configured. Use the mock deliberation provider.",
    );
  }
}

export const unconfiguredLLM = new UnconfiguredLLMProvider();

export function resolveProvider(mock: LLMProvider): LLMProvider {
  if (process.env.QUORUM_LLM === "live") return unconfiguredLLM;
  return mock;
}
