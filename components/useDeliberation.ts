"use client";

import { WARDS } from "@/lib/city/indore";
import type { WardVisual } from "@/components/CityPulseMap";
import type {
  AgentId,
  DecisionCapsule,
  DissentNote,
  ForkId,
  ForkSnapshot,
  Phase,
  ScenarioId,
  StreamEvent,
  TurnTone,
} from "@/lib/types";
import { useEffect, useReducer, useRef } from "react";

export interface TurnView {
  id: number;
  agent: AgentId;
  text: string;
  tone: TurnTone;
}

export interface ArcView {
  id: number;
  from: AgentId;
  to: AgentId;
  kind: "strike" | "consensus";
}

export interface DeliberationState {
  status: "idle" | "live" | "gate" | "sealing" | "sealed" | "error";
  demo: boolean;
  scenarioId: ScenarioId;
  phase: Phase | null;
  phaseLabel: string;
  legend: string;
  turns: TurnView[];
  activeAgent: AgentId | null;
  arc: ArcView | null;
  confidence: number | null;
  confidenceReason: string;
  hit: number;
  wards: Record<string, WardVisual>;
  shelters: string[];
  corridors: string[];
  feeds: string[];
  forks: ForkSnapshot[];
  armedFork: ForkId | null;
  lockedFork: ForkId | null;
  dissent: DissentNote[];
  operatorBrief: string;
  citizenBrief: string;
  briefMode: "operator" | "citizen";
  capsule: DecisionCapsule | null;
  showSeal: boolean;
  error: string | null;
  turnSeq: number;
  arcSeq: number;
}

type Action =
  | { type: "select"; scenarioId: ScenarioId }
  | { type: "begin"; scenarioId: ScenarioId; demo: boolean }
  | { type: "sealing"; fork: ForkId }
  | { type: "arm"; fork: ForkId }
  | { type: "brief-mode"; mode: "operator" | "citizen" }
  | { type: "hide-seal" }
  | { type: "fail"; message: string }
  | { type: "stream"; event: StreamEvent };

function baseline(): Record<string, WardVisual> {
  return Object.fromEntries(
    WARDS.map((ward) => [ward.id, { severity: 0.05, hazard: 0, equity: 0 }]),
  );
}

function fresh(scenarioId: ScenarioId, demo = false): DeliberationState {
  return {
    status: "idle",
    demo,
    scenarioId,
    phase: null,
    phaseLabel: "Floor dark",
    legend: "Ward pulse",
    turns: [],
    activeAgent: null,
    arc: null,
    confidence: null,
    confidenceReason: "Waiting for the floor.",
    hit: 0,
    wards: baseline(),
    shelters: [],
    corridors: [],
    feeds: [],
    forks: [],
    armedFork: null,
    lockedFork: null,
    dissent: [],
    operatorBrief: "",
    citizenBrief: "",
    briefMode: "operator",
    capsule: null,
    showSeal: false,
    error: null,
    turnSeq: 0,
    arcSeq: 0,
  };
}

function withList(list: string[], id: string, on: boolean) {
  const next = list.filter((item) => item !== id);
  return on ? [...next, id] : next;
}

function applyStream(state: DeliberationState, event: StreamEvent): DeliberationState {
  switch (event.type) {
    case "phase":
      return {
        ...state,
        phase: event.phase,
        phaseLabel: event.label,
        legend: event.legend ?? state.legend,
      };
    case "turn":
      return {
        ...state,
        activeAgent: event.agent,
        turnSeq: state.turnSeq + 1,
        turns: [
          ...state.turns,
          {
            id: state.turnSeq + 1,
            agent: event.agent,
            text: event.text,
            tone: event.tone,
          },
        ],
      };
    case "map": {
      const wards = { ...state.wards };
      for (const patch of event.delta.wards ?? []) {
        const prev = wards[patch.id] ?? { severity: 0, hazard: 0, equity: 0 };
        wards[patch.id] = {
          severity: patch.severity ?? prev.severity,
          hazard: patch.hazard ?? prev.hazard,
          equity: patch.equity ?? prev.equity,
        };
      }
      let shelters = state.shelters;
      let corridors = state.corridors;
      let feeds = state.feeds;
      for (const shelter of event.delta.shelters ?? []) {
        shelters = withList(shelters, shelter.id, shelter.open);
      }
      for (const corridor of event.delta.corridors ?? []) {
        corridors = withList(corridors, corridor.id, corridor.active);
      }
      for (const feed of event.delta.feeds ?? []) {
        feeds = withList(feeds, feed.id, feed.on);
      }
      return { ...state, wards, shelters, corridors, feeds };
    }
    case "confidence": {
      const dropped =
        state.confidence !== null && event.value < state.confidence - 0.05;
      return {
        ...state,
        confidence: event.value,
        confidenceReason: event.reason,
        hit: dropped ? state.hit + 1 : state.hit,
      };
    }
    case "arc":
      return {
        ...state,
        arcSeq: state.arcSeq + 1,
        arc: {
          id: state.arcSeq + 1,
          from: event.from,
          to: event.to,
          kind: event.kind,
        },
      };
    case "forks":
      return { ...state, forks: event.forks };
    case "fork_gate":
      return { ...state, status: "gate" };
    case "lock":
      return { ...state, lockedFork: event.fork, armedFork: event.fork };
    case "dissent":
      if (state.dissent.some((note) => note.text === event.text)) return state;
      return {
        ...state,
        dissent: [...state.dissent, { agent: event.agent, text: event.text }],
      };
    case "brief":
      return {
        ...state,
        operatorBrief: event.operator,
        citizenBrief: event.citizen,
      };
    case "seal":
      return {
        ...state,
        status: "sealed",
        capsule: event.capsule,
        showSeal: true,
        confidence: event.capsule.confidence,
      };
    case "error":
      return { ...state, status: "error", error: event.message };
    case "done":
      return state;
    default:
      return state;
  }
}

function reducer(state: DeliberationState, action: Action): DeliberationState {
  switch (action.type) {
    case "select":
      return fresh(action.scenarioId, false);
    case "begin":
      return { ...fresh(action.scenarioId, action.demo), status: "live" };
    case "sealing":
      return {
        ...state,
        status: "sealing",
        lockedFork: action.fork,
        armedFork: action.fork,
        error: null,
      };
    case "arm":
      return { ...state, armedFork: action.fork };
    case "brief-mode":
      return { ...state, briefMode: action.mode };
    case "hide-seal":
      return { ...state, showSeal: false };
    case "fail":
      return { ...state, status: "error", error: action.message };
    case "stream":
      return applyStream(state, action.event);
    default:
      return state;
  }
}

async function readStream(
  response: Response,
  onEvent: (event: StreamEvent) => void,
) {
  if (!response.ok || !response.body) {
    throw new Error("The floor could not be opened.");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const line = part.split("\n").find((item) => item.startsWith("data:"));
      if (!line) continue;
      onEvent(JSON.parse(line.slice(5).trim()) as StreamEvent);
    }
  }
}

export function useDeliberation() {
  const [state, dispatch] = useReducer(reducer, "indore-flood", (id: ScenarioId) =>
    fresh(id),
  );
  const abortRef = useRef<AbortController | null>(null);
  const timers = useRef<number[]>([]);
  const demoRef = useRef(false);
  const scenarioRef = useRef<ScenarioId>("indore-flood");
  const sealStarted = useRef(false);

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  };

  useEffect(() => {
    const abort = abortRef;
    const pending = timers;
    return () => {
      for (const id of pending.current) window.clearTimeout(id);
      abort.current?.abort();
    };
  }, []);

  async function run(stage: "open" | "seal", fork?: ForkId) {
    if (stage === "seal" && sealStarted.current) return;
    if (stage === "seal") sealStarted.current = true;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    if (stage === "open") {
      sealStarted.current = false;
      dispatch({
        type: "begin",
        scenarioId: scenarioRef.current,
        demo: demoRef.current,
      });
    } else {
      dispatch({ type: "sealing", fork: fork ?? "C" });
    }

    const params = new URLSearchParams({
      scenario: scenarioRef.current,
      stage,
    });
    if (fork) params.set("fork", fork);

    try {
      const response = await fetch(`/api/deliberate?${params.toString()}`, {
        signal: controller.signal,
        cache: "no-store",
        headers: { Accept: "text/event-stream" },
      });
      await readStream(response, (event) => {
        if (controller.signal.aborted) return;
        dispatch({ type: "stream", event });
        if (event.type === "fork_gate" && demoRef.current) {
          clearTimers();
          timers.current.push(
            window.setTimeout(() => dispatch({ type: "arm", fork: "C" }), 800),
          );
          timers.current.push(
            window.setTimeout(() => {
              void run("seal", "C");
            }, 2300),
          );
        }
        if (event.type === "error") {
          sealStarted.current = false;
          dispatch({ type: "fail", message: event.message });
        }
      });
    } catch (error) {
      if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
        return;
      }
      sealStarted.current = false;
      dispatch({
        type: "fail",
        message: error instanceof Error ? error.message : "The floor lost the stream.",
      });
    }
  }

  return {
    state,
    startDemo() {
      clearTimers();
      abortRef.current?.abort();
      sealStarted.current = false;
      demoRef.current = true;
      scenarioRef.current = "indore-flood";
      void run("open");
    },
    startFloor() {
      clearTimers();
      abortRef.current?.abort();
      sealStarted.current = false;
      demoRef.current = false;
      void run("open");
    },
    lockFork(fork: ForkId) {
      clearTimers();
      void run("seal", fork);
    },
    selectScenario(id: ScenarioId) {
      clearTimers();
      abortRef.current?.abort();
      sealStarted.current = false;
      demoRef.current = false;
      scenarioRef.current = id;
      dispatch({ type: "select", scenarioId: id });
    },
    setBriefMode(mode: "operator" | "citizen") {
      dispatch({ type: "brief-mode", mode });
    },
    dismissSeal() {
      dispatch({ type: "hide-seal" });
    },
  };
}
