"use client";

import { formatHash } from "@/lib/format";
import { motion, useReducedMotion } from "framer-motion";

const TICKS = Array.from({ length: 72 }, (_, index) => {
  const angle = (index / 72) * Math.PI * 2 - Math.PI / 2;
  const inner = index % 9 === 0 ? 78 : 84;
  const outer = 91;
  return {
    x1: 100 + Math.cos(angle) * inner,
    y1: 100 + Math.sin(angle) * inner,
    x2: 100 + Math.cos(angle) * outer,
    y2: 100 + Math.sin(angle) * outer,
    major: index % 9 === 0,
  };
});

export function SealMedallion({
  hash,
  sealedAt,
  algorithm,
  size = "page",
}: {
  hash: string;
  sealedAt: string;
  algorithm: string;
  size?: "page" | "room";
}) {
  const reduce = useReducedMotion();
  const groups = formatHash(hash).split(" ");
  const short = `${groups[0]} ${groups[1]}`;

  return (
    <div className={`seal-medallion is-${size}`}>
      <div className="seal-disc" role="img" aria-label={`${algorithm} ${hash}. Sealed ${sealedAt}.`}>
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <motion.g
            style={{ transformOrigin: "100px 100px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={reduce ? undefined : { duration: 90, repeat: Infinity, ease: "linear" }}
          >
            {TICKS.map((tick, index) => (
              <line
                key={index}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={tick.major ? "rgba(245,165,36,0.9)" : "rgba(186,220,216,0.35)"}
                strokeWidth={tick.major ? 1.4 : 0.6}
              />
            ))}
          </motion.g>
          <motion.circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="rgba(61,206,196,0.75)"
            strokeWidth="0.7"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="100"
            cy="100"
            r="68"
            fill="none"
            stroke="#f5a524"
            strokeWidth="1.4"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.15, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="seal-core">
          <span>{algorithm}</span>
          <strong>{short}</strong>
        </div>
      </div>
      <p className="hash-line">{formatHash(hash)}</p>
      <p className="seal-when">{sealedAt}</p>
    </div>
  );
}
