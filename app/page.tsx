"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function Home() {
  const reduce = useReducedMotion();
  const enter = (delay: number, y = 16) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <main className="hero">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-wash" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-rain" />
        <div className="hero-grain" />
      </div>

      <div className="hero-shell">
        <motion.p className="hero-kicker" {...enter(0, 10)}>
          BUILD 2036 · Frontier 01 · Applied AI
        </motion.p>

        <motion.p className="hero-brand" {...enter(0.06, 24)}>
          QUORUM
        </motion.p>

        <motion.h1 className="hero-line" {...enter(0.16, 16)}>
          Cities don’t need another dashboard.
        </motion.h1>

        <motion.p className="hero-sub" {...enter(0.26, 12)}>
          They need a quorum that can think under fire.
        </motion.p>

        <motion.div className="hero-actions" {...enter(0.36, 12)}>
          <Link className="hero-cta" href="/war-room">
            Open the War Room
            <span aria-hidden="true">→</span>
          </Link>
          <p className="hero-meta">Indore monsoon · six agents · Decision Capsule</p>
        </motion.div>
      </div>

      <aside className="hero-stage" aria-hidden="true">
        <div className="radar">
          <span className="radar-ring r1" />
          <span className="radar-ring r2" />
          <span className="radar-ring r3" />
          <span className="radar-sweep" />
          <span className="radar-core" />
          <span className="radar-blip b1" />
          <span className="radar-blip b2" />
          <span className="radar-blip b3" />
          <span className="radar-blip b4" />
        </div>
        <ul className="hero-agents">
          {["Scout", "Risk", "Sim", "Equity", "Ops", "Adversary"].map((name, i) => (
            <li key={name} style={{ animationDelay: `${0.45 + i * 0.08}s` }}>
              <span className={name === "Adversary" ? "dot strike" : "dot"} />
              {name}
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
