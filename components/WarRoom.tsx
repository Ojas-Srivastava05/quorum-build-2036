"use client";

import { CapsuleSeal } from "@/components/CapsuleSeal";
import { CityPulseMap } from "@/components/CityPulseMap";
import { ConfidenceRibbon } from "@/components/ConfidenceRibbon";
import { DebateTheater } from "@/components/DebateTheater";
import { DissentLog } from "@/components/DissentLog";
import { DualBrief } from "@/components/DualBrief";
import { ForkSimulator } from "@/components/ForkSimulator";
import { useDeliberation } from "@/components/useDeliberation";
import { getAgent } from "@/lib/agents/roster";
import { SCENARIO_META, getScenarioMeta } from "@/lib/scenarios/meta";
import type { TurnTone } from "@/lib/types";
import Link from "next/link";
import { useEffect, useRef } from "react";

const TONE: Record<TurnTone, string> = {
  report: "Report",
  challenge: "Challenge",
  rebuttal: "Rebuttal",
  synthesis: "Synthesis",
};

export function WarRoom() {
  const room = useDeliberation();
  const { state } = room;
  const feedEnd = useRef<HTMLLIElement>(null);
  const meta = getScenarioMeta(state.scenarioId);
  const last = state.turns[state.turns.length - 1];
  const busy = state.status === "live" || state.status === "gate" || state.status === "sealing";

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ block: "end" });
  }, [state.turns.length, state.dissent.length]);

  return (
    <main className={`war-shell ${state.hit ? "was-struck" : ""}`}>
      <div className="war-rain" aria-hidden="true" />
      {state.hit > 0 ? <div key={state.hit} className="strike-flash" /> : null}
      <header className="war-bar">
        <div className="war-brand">
          <Link href="/">Quorum</Link>
          <p>
            {meta.place} · {meta.name}
            <span>{meta.clock}</span>
          </p>
        </div>
        <p className="phase-label">{state.phaseLabel}</p>
        <div className="war-controls">
          <div className="scenario-switch" role="group" aria-label="Scenario">
            {SCENARIO_META.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === state.scenarioId}
                disabled={busy}
                onClick={() => room.selectScenario(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button type="button" className="ghost-btn" disabled={busy} onClick={room.startFloor}>
            Open the floor
          </button>
          <button
            type="button"
            className="demo-btn"
            disabled={busy}
            onClick={room.startDemo}
          >
            {state.demo && busy ? "Demo running" : state.status === "sealed" ? "Replay demo" : "Demo Mode"}
          </button>
        </div>
      </header>
      <ConfidenceRibbon
        value={state.confidence}
        reason={state.confidenceReason}
        hit={state.hit}
      />
      <div className="war-stage">
        <section className="map-column" aria-label="City pulse">
          <CityPulseMap
            wards={state.wards}
            shelters={state.shelters}
            corridors={state.corridors}
            feeds={state.feeds}
            legend={state.legend}
          />
          <DebateTheater
            active={state.activeAgent}
            arc={state.arc}
            speaker={last?.agent ?? null}
            caption={
              last?.text ??
              "The council is seated. The city is waiting for a floor."
            }
          />
        </section>
        <aside className="rail">
          <div className="feed" aria-label="Council floor">
            <header>
              <h2>Floor</h2>
              <span>{state.demo ? "Demo" : state.status}</span>
            </header>
            {state.turns.length === 0 ? (
              <p className="quiet">
                Open the floor to hear this scenario, or run Demo Mode for the Indore monsoon.
              </p>
            ) : (
              <ol>
                {state.turns.map((turn) => {
                  const agent = getAgent(turn.agent);
                  return (
                    <li key={turn.id} className={turn.agent === "adversary" ? "is-adversary" : ""}>
                      <span style={{ color: agent.color }}>
                        {agent.name}
                        <em>{TONE[turn.tone]}</em>
                      </span>
                      <p>{turn.text}</p>
                    </li>
                  );
                })}
                <li className="feed-end" ref={feedEnd} />
              </ol>
            )}
          </div>
          <DissentLog notes={state.dissent} />
          <DualBrief
            mode={state.briefMode}
            operator={state.operatorBrief}
            citizen={state.citizenBrief}
            onChange={room.setBriefMode}
          />
        </aside>
      </div>
      {state.error ? <p className="war-error">{state.error}</p> : null}
      <ForkSimulator
        forks={state.forks}
        armed={state.armedFork}
        locked={state.lockedFork}
        choosable={state.status === "gate"}
        onLock={room.lockFork}
      />
      {state.showSeal && state.capsule ? (
        <CapsuleSeal
          capsule={state.capsule}
          onClose={room.dismissSeal}
          onReplay={room.startDemo}
        />
      ) : null}
    </main>
  );
}
