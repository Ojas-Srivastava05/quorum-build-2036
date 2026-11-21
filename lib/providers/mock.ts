import type { LLMProvider } from "@/lib/providers/llm";
import type { ScriptBeat, StreamEvent } from "@/lib/types";

export const mockProvider: LLMProvider = {
  id: "mock-deliberation",
  async *stream() {
    yield "Mock deliberation is on the script. The orchestrator emits structured council turns.";
  },
};

function delay(ms: number, signal?: AbortSignal) {
  if (ms <= 0) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
    };
    if (signal?.aborted) {
      onAbort();
      return;
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/** Timed dramatic script engine. Speed 1 is the Demo Mode pace. */
export async function* playScript(
  beats: ScriptBeat[],
  speed = 1,
  signal?: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const factor = Number.isFinite(speed) && speed > 0 ? speed : 1;
  for (const beat of beats) {
    await delay(beat.delay / factor, signal);
    for (const event of beat.events) {
      yield event;
    }
  }
}
