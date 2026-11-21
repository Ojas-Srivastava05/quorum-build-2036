import type { ScriptBeat, StreamEvent } from "@/lib/types";

export function beat(delay: number, ...events: StreamEvent[]): ScriptBeat {
  return { delay, events };
}
