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

  const latestId = last?.id;

  return (
    <main
      className={`war ${state.hit ? "was-struck" : ""} ${busy ? "is-live" : ""} is-${state.status}`}
      aria-busy={busy}
    >
      <div className="war-rain" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      {state.hit > 0 ? <div key={state.hit} className="strike-flash" /> : null}
      <header className="war-command">
        <div className="war-id">
          <Link href="/" className="war-mark">
            QUORUM
          </Link>
          <div className="war-place">
            <strong>{meta.place}</strong>
            <span>{meta.clock}</span>
          </div>
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
          <button type="button" className="text-action" disabled={busy} onClick={room.startFloor}>
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
      <div className="war-compose">
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
            struck={state.hit}
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
              <span className={state.demo ? "is-demo" : ""}>
                {state.demo ? "Demo" : state.status}
              </span>
            </header>
            {state.turns.length === 0 ? (
              <p className={`quiet ${busy ? "is-waiting" : ""}`}>
                {busy ? "Opening the floor." : "No one has spoken."}
              </p>
            ) : (
              <ol>
                {state.turns.map((turn) => {
                  const agent = getAgent(turn.agent);
                  return (
                    <li
                      key={turn.id}
                      className={`${turn.agent === "adversary" ? "is-adversary" : ""} ${
                        turn.id === latestId ? "is-latest" : ""
                      }`}
                    >
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
      <footer className="war-deck">
        <ConfidenceRibbon
          value={state.confidence}
          reason={state.confidenceReason}
          hit={state.hit}
        />
        {state.error ? <p className="war-error">{state.error}</p> : null}
        <ForkSimulator
          forks={state.forks}
          armed={state.armedFork}
          locked={state.lockedFork}
          choosable={state.status === "gate"}
          onLock={room.lockFork}
        />
      </footer>
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
