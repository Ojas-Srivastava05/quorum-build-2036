"use client";

import { downloadCapsule } from "@/components/DownloadCapsule";
import { formatHash } from "@/lib/format";
import type { DecisionCapsule } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export function CapsuleSeal({
  capsule,
  onClose,
  onReplay,
}: {
  capsule: DecisionCapsule;
  onClose: () => void;
  onReplay: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="seal-overlay"
      data-sealed="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seal-title"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="seal-sheet"
        initial={reduce ? false : { scale: 1.18, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <p className="seal-kicker">Decision Capsule</p>
        <h2 id="seal-title">Sealed</h2>
        <div className="seal-mark" aria-label={`SHA-256 ${capsule.seal.hash}`}>
          <span>SHA-256</span>
          <strong>{formatHash(capsule.seal.hash)}</strong>
          <em>{capsule.seal.sealedAt}</em>
        </div>
        <p className="seal-choice">
          {capsule.scenarioTitle} · Fork {capsule.fork} {capsule.forkName} · confidence{" "}
          {capsule.confidence.toFixed(2)}
        </p>
        <ol className="seal-actions">
          {capsule.rankedActions.slice(0, 4).map((action) => (
            <li key={action.rank}>
              <span>{action.rank}</span>
              <div>
                <strong>{action.title}</strong>
                <p>{action.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <blockquote>
          <span>Minority dissent, kept in the seal</span>
          {capsule.dissent[0]?.text}
        </blockquote>
        <div className="seal-actions-row">
          <Link href={`/capsule/${capsule.id}`}>Open the capsule</Link>
          <button type="button" onClick={() => downloadCapsule(capsule)}>
            Export JSON
          </button>
          <button type="button" onClick={onClose}>
            Return to the floor
          </button>
          <button type="button" onClick={onReplay}>
            Replay demo
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
