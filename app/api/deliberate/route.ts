import { deliberate } from "@/lib/agents/orchestrator";
import type { ForkId } from "@/lib/types";

function asFork(value: string | null): ForkId | null {
  if (value === "A" || value === "B" || value === "C") return value;
  return null;
}

function clampSpeed(value: string | null) {
  const speed = Number(value ?? "1");
  if (!Number.isFinite(speed)) return 1;
  return Math.min(20, Math.max(0.25, speed));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scenarioId = url.searchParams.get("scenario") ?? "indore-flood";
  const stage = url.searchParams.get("stage") === "seal" ? "seal" : "open";
  const fork = asFork(url.searchParams.get("fork"));
  const speed = clampSpeed(url.searchParams.get("speed"));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };
      try {
        if (stage === "seal" && !fork) {
          send({ type: "error", message: "A fork lock is required before the seal." });
          return;
        }
        for await (const event of deliberate({
          scenarioId,
          stage,
          fork: fork ?? "C",
          speed,
          signal: request.signal,
        })) {
          if (request.signal.aborted) break;
          send(event);
        }
      } catch (error) {
        if (request.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
          return;
        }
        const message = error instanceof Error ? error.message : "Deliberation failed.";
        send({ type: "error", message });
      } finally {
        try {
          controller.close();
        } catch {
          /* closed by the client */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
