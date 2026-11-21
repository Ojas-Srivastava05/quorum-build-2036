"use client";

import type { ForkId, ForkSnapshot } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";

function sparkPoints(spark: number[], peak: number) {
  const width = 120;
  const height = 36;
  return spark
    .map((value, index) => {
      const x = (index / Math.max(1, spark.length - 1)) * width;
      const y = height - (value / peak) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function ForkSimulator({
  forks,
  armed,
  locked,
  choosable,
  onLock,
}: {
  forks: ForkSnapshot[];
  armed: ForkId | null;
  locked: ForkId | null;
  choosable: boolean;
  onLock: (fork: ForkId) => void;
}) {
  const reduce = useReducedMotion();
  const slots: ForkId[] = ["A", "B", "C"];
  const peak = Math.max(40, ...forks.flatMap((fork) => fork.spark), 0);

  return (
    <section
      className={`forks ${choosable ? "is-open" : ""} ${locked ? "is-locked" : ""}`}
      aria-label="72-hour fork simulator"
    >
      <header>
        <h2>72-hour forks</h2>
        <p>
          {locked
            ? `Fork ${locked} is locked.`
            : choosable
              ? "Lock one fork to seal the capsule."
              : "Harm curves update as the floor argues."}
        </p>
      </header>
      <div className="fork-row">
        {slots.map((id) => {
          const fork = forks.find((item) => item.id === id);
          const isLocked = locked === id;
          const isArmed = armed === id && !locked;
          const dim = Boolean(locked) && !isLocked;
          return (
            <button
              key={id}
              type="button"
              className={`fork ${isLocked ? "locked" : ""} ${isArmed ? "armed" : ""} ${dim ? "dim" : ""}`}
              disabled={!choosable || !fork}
              onClick={() => fork && onLock(fork.id)}
            >
              <span className="fork-kicker">
                Fork {id}
                {isLocked ? " · locked" : isArmed ? " · arming" : ""}
              </span>
              <strong>{fork?.name ?? "Awaiting Sim"}</strong>
              <em>{fork?.thesis ?? "The curve is not on the table yet."}</em>
              {fork ? (
                <>
                  <svg viewBox="0 0 120 36" className="spark" aria-hidden="true">
                    <motion.polyline
                      points={sparkPoints(fork.spark, peak)}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.05, ease: "easeOut" }}
                    />
                  </svg>
                  <dl>
                    <div>
                      <dt>Severe risk</dt>
                      <dd>{fork.severeRisk.toLocaleString("en-IN")}</dd>
                    </div>
                    <div>
                      <dt>Cost</dt>
                      <dd>₹{fork.costCr} cr</dd>
                    </div>
                    <div>
                      <dt>Equity</dt>
                      <dd>{fork.equity.toFixed(2)}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <div className="spark spark-empty" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
