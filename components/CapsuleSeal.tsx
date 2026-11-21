"use client";

import { downloadCapsule } from "@/components/DownloadCapsule";
import { SealMedallion } from "@/components/SealMedallion";
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
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      className="seal-overlay"
      data-sealed="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seal-title"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="seal-sheet"
        initial={reduce ? false : { y: 56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <SealMedallion
          hash={capsule.seal.hash}
          sealedAt={capsule.seal.sealedAt}
          algorithm={capsule.seal.algorithm}
          size="room"
        />
        <p className="seal-kicker">Decision Capsule</p>
        <motion.h2
          id="seal-title"
          initial={reduce ? false : { opacity: 0, letterSpacing: "0.28em" }}
          animate={{ opacity: 1, letterSpacing: "-0.055em" }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
        >
          Sealed
        </motion.h2>
        <p className="seal-choice">
          {capsule.scenarioTitle} · Fork {capsule.fork} {capsule.forkName} · confidence{" "}
          {capsule.confidence.toFixed(2)}
        </p>
        <ol className="seal-actions">
          {capsule.rankedActions.slice(0, 4).map((action) => (
            <li key={action.rank}>
              <span>{String(action.rank).padStart(2, "0")}</span>
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
