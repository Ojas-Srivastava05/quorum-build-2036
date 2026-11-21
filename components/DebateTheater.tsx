"use client";

import { getAgent } from "@/lib/agents/roster";
import type { AgentId } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";

const SEATS: Record<AgentId, { x: number; y: number }> = {
  scout: { x: 16, y: 18 },
  risk: { x: 84, y: 16 },
  sim: { x: 12, y: 46 },
  equity: { x: 88, y: 44 },
  ops: { x: 22, y: 68 },
  adversary: { x: 78, y: 66 },
};

export function DebateTheater({
  active,
  arc,
  caption,
  speaker,
}: {
  active: AgentId | null;
  arc: { id: number; from: AgentId; to: AgentId; kind: "strike" | "consensus" } | null;
  caption: string;
  speaker: AgentId | null;
}) {
  const reduce = useReducedMotion();
  const speaking = speaker ? getAgent(speaker) : null;

  return (
    <div className="theater" aria-label="Council">
      <svg className="theater-arcs" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {arc ? (
          <motion.path
            key={arc.id}
            d={`M ${SEATS[arc.from].x} ${SEATS[arc.from].y} Q 50 42 ${SEATS[arc.to].x} ${SEATS[arc.to].y}`}
            fill="none"
            stroke={arc.kind === "strike" ? "#d4654a" : "#3dbeb6"}
            strokeWidth="0.7"
            initial={reduce ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        ) : null}
      </svg>
      {(Object.keys(SEATS) as AgentId[]).map((id) => {
        const agent = getAgent(id);
        const on = active === id;
        const seat = SEATS[id];
        return (
          <div
            key={id}
            className={`seat ${on ? "is-on" : ""} ${id === "adversary" ? "is-adversary" : ""}`}
            style={{ left: `${seat.x}%`, top: `${seat.y}%` }}
          >
            <motion.span
              className="seat-ring"
              style={{ borderColor: agent.color }}
              animate={
                on && !reduce
                  ? { scale: [1, 1.45, 1], opacity: [0.95, 0.25, 0.95] }
                  : { scale: 1, opacity: on ? 1 : 0.35 }
              }
              transition={on && !reduce ? { duration: 1.5, repeat: Infinity } : { duration: 0.2 }}
            />
            <span className="seat-dot" style={{ background: agent.color }} />
            <span className="seat-copy">
              <strong>{agent.name}</strong>
              <em>{agent.role}</em>
            </span>
          </div>
        );
      })}
      <div className="caption" aria-live="polite">
        <span>{speaking ? speaking.name : "Quorum"}</span>
        <p>{caption}</p>
      </div>
    </div>
  );
}
