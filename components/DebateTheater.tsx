"use client";

import { getAgent } from "@/lib/agents/roster";
import type { AgentId } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";

const SEATS: Record<AgentId, { x: number; y: number }> = {
  scout: { x: 16, y: 16 },
  risk: { x: 84, y: 14 },
  sim: { x: 12, y: 42 },
  equity: { x: 86, y: 40 },
  ops: { x: 22, y: 62 },
  adversary: { x: 78, y: 60 },
};

function arcPath(from: AgentId, to: AgentId) {
  const start = SEATS[from];
  const end = SEATS[to];
  return `M ${start.x} ${start.y} Q 50 34 ${end.x} ${end.y}`;
}

export function DebateTheater({
  active,
  arc,
  caption,
  speaker,
  struck,
}: {
  active: AgentId | null;
  arc: { id: number; from: AgentId; to: AgentId; kind: "strike" | "consensus" } | null;
  caption: string;
  speaker: AgentId | null;
  struck: number;
}) {
  const reduce = useReducedMotion();
  const speaking = speaker ? getAgent(speaker) : null;
  const curve = arc ? arcPath(arc.from, arc.to) : "";
  const strike = arc?.kind === "strike";

  return (
    <div className="theater" aria-label="Council">
      <svg className="theater-arcs" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {arc ? (
          <>
            <motion.path
              key={`${arc.id}-glow`}
              d={curve}
              fill="none"
              stroke={strike ? "#e25b3c" : "#3dcec4"}
              strokeWidth={strike ? 2.2 : 1.4}
              strokeLinecap="round"
              initial={reduce ? { pathLength: 1, opacity: 0.35 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.45 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.path
              key={arc.id}
              d={curve}
              fill="none"
              stroke={strike ? "#ffb4a2" : "#d7fffb"}
              strokeWidth={strike ? 0.7 : 0.4}
              strokeLinecap="round"
              initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            />
          </>
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
            <span className="seat-mark">
              {id === "adversary" && struck > 0 ? (
                <motion.span
                  key={struck}
                  className="seat-strike"
                  initial={{ scale: 0.5, opacity: 0.85 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              ) : null}
              <motion.span
                className="seat-beam"
                style={{
                  background: `linear-gradient(to bottom, ${agent.color}, transparent)`,
                }}
                animate={
                  on && !reduce
                    ? { opacity: [0.2, 1, 0.2], scaleY: [0.45, 1, 0.45] }
                    : { opacity: 0, scaleY: 0.3 }
                }
                transition={
                  on && !reduce ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }
                }
              />
              <motion.span
                className="seat-ring"
                style={{ borderColor: agent.color }}
                animate={
                  on && !reduce
                    ? { scale: [1, 1.55, 1], opacity: [0.95, 0.2, 0.95] }
                    : { scale: 1, opacity: on ? 1 : 0.28 }
                }
                transition={on && !reduce ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
              />
              <span className="seat-dot" style={{ background: agent.color }} />
            </span>
            <span className="seat-copy">
              <strong>{agent.name}</strong>
              <em>{agent.role}</em>
            </span>
          </div>
        );
      })}
      <div className="caption" aria-live="polite">
        <motion.span
          key={speaking?.name ?? "quorum"}
          style={{ color: speaking?.color ?? "var(--amber)" }}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          {speaking ? speaking.name : "Quorum"}
        </motion.span>
        <motion.p
          key={caption}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          {caption}
        </motion.p>
      </div>
    </div>
  );
}
