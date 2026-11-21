import { sealCapsule } from "@/lib/capsule/seal";
import { beat } from "@/lib/scenarios/beats";
import { sealBeats } from "@/lib/scenarios/close";
import type { CapsuleDraft, ForkId, ForkSnapshot, Scenario } from "@/lib/types";

const SEALED_AT = "2036-05-12T15:10:00+05:30";

const FORKS: ForkSnapshot[] = [
  {
    id: "A",
    name: "Cooling centers",
    thesis: "Open the cool rooms. Leave the grid to luck.",
    severeRisk: 780,
    costCr: 18,
    equity: 0.84,
    confidence: 0.66,
    spark: [30, 36, 40, 44, 42, 38, 36, 35, 34, 34, 33, 32],
  },
  {
    id: "B",
    name: "Hold the grid",
    thesis: "Shed load. Tell outdoor workers to cope.",
    severeRisk: 1510,
    costCr: 11,
    equity: 0.4,
    confidence: 0.5,
    spark: [28, 34, 46, 58, 66, 70, 68, 64, 62, 60, 59, 58],
  },
  {
    id: "C",
    name: "Workers first",
    thesis: "Centers in worker wards. Shed the commercial chillers.",
    severeRisk: 640,
    costCr: 16,
    equity: 0.8,
    confidence: 0.75,
    spark: [32, 36, 34, 30, 28, 26, 25, 24, 23, 22, 22, 21],
  },
];

function forkById(id: ForkId) {
  const found = FORKS.find((item) => item.id === id);
  if (!found) throw new Error(`Missing heat fork ${id}`);
  return found;
}

function draft(fork: ForkId): CapsuleDraft {
  const chosen = forkById(fork);
  const shared = {
    id: `heatwave-${fork.toLowerCase()}`,
    scenarioId: "heatwave" as const,
    scenarioTitle: "Indore heatwave",
    city: "Indore",
    clock: "12 May 2036 · 15:10 IST",
    fork,
    forkName: chosen.name,
    confidence: chosen.confidence,
  };

  if (fork === "A") {
    return {
      ...shared,
      rankedActions: [
        {
          rank: 1,
          title: "Open eight cooling centers before 16:00",
          detail: "University ground, parade ground, exhibition field, Scheme 78, and four ward halls.",
          owner: "Relief",
        },
        {
          rank: 2,
          title: "Stop heavy outdoor work",
          detail: "Scaffolding and road crews stand down. Enforcement rides with ward officers.",
          owner: "Labour",
        },
        {
          rank: 3,
          title: "Tankers to centers and the wholesale yard",
          detail: "Water is the service, not a side note.",
          owner: "Water",
        },
      ],
      tradeoffs: [
        "Workers get a room. The Scheme 78 transformer is still one hot hour from a trip.",
        "If the grid fails, the centers become crowded shade.",
      ],
      dissent: [
        {
          agent: "adversary",
          text: "Centers without a shed order are waiting rooms. The transformer is still the single point of failure.",
        },
      ],
      operatorBrief:
        "LOCK Cooling-centers. Eight rooms open by 16:00. Heavy outdoor work stands down with ward enforcement. Tankers to centers and the Choithram yard. No commercial shed is in this lock. Say that the grid risk remains.",
      citizenBrief:
        "Cooling centers are opening, and heavy outdoor work is supposed to stop. The city has not yet cut commercial air-conditioning, so a transformer failure can still knock the centers out. The red team recorded that risk.",
    };
  }

  if (fork === "B") {
    return {
      ...shared,
      rankedActions: [
        {
          rank: 1,
          title: "Shed commercial HVAC on AB Road",
          detail: "Malls and office chillers drop first. Hospitals, pumps, and water stay.",
          owner: "Power",
        },
        {
          rank: 2,
          title: "Hold Scheme 78 transformer under 90%",
          detail: "Fifteen-minute thermal reads until 20:00.",
          owner: "Power",
        },
        {
          rank: 3,
          title: "Pamphlet the yard",
          detail: "No dedicated centers beyond hospitals.",
          owner: "Comms",
        },
      ],
      tradeoffs: [
        "The grid is likelier to hold. Outdoor workers are the cooling plan.",
        "Equity does not consent.",
      ],
      dissent: [
        {
          agent: "equity",
          text: "A pamphlet is not shade. I refuse a lock that saves chillers' cousins and leaves the carts.",
        },
      ],
      operatorBrief:
        "LOCK Hold-the-grid. Commercial HVAC on AB Road sheds. Scheme 78 stays under 90% thermal. No new cooling centers. Equity refuses. Do not call a pamphlet outreach.",
      citizenBrief:
        "The city is cutting power to large commercial air-conditioning to keep the grid up. It is not opening a real cooling network for people who work outside. The equity seat has refused this choice, and the refusal is sealed with it.",
    };
  }

  return {
    ...shared,
    rankedActions: [
      {
        rank: 1,
        title: "Centers where the work is",
        detail: "Wholesale yard, Vijay Nagar sites, Rajwada carts, plus the hospital shadow.",
        owner: "Relief",
      },
      {
        rank: 2,
        title: "Shed commercial HVAC, not the pumps",
        detail: "AB Road malls and office chillers. Hospitals, water, and centers stay on generator priority.",
        owner: "Power",
      },
      {
        rank: 3,
        title: "Stop-work with inspectors, not a press note",
        detail: "Contractors who pay by the slab get a recorded stand-down after 13:00.",
        owner: "Labour",
      },
      {
        rank: 4,
        title: "Tankers paired to every open center",
        detail: "A center without water does not count as open.",
        owner: "Water",
      },
    ],
    tradeoffs: [
      "Severe risk drops without pretending the grid is someone else's problem.",
      "Shops on AB Road will call this hostile. The alternative is a dark hospital.",
    ],
    dissent: [
      {
        agent: "adversary",
        text: "The stop-work order still depends on inspectors arriving. If they do not, the centers fill with people who were never released from the slab. Record the enforcement as a condition, not a fact.",
      },
    ],
    operatorBrief:
      "LOCK Workers-first. Centers at the wholesale yard, Vijay Nagar sites, Rajwada, and the hospital shadow. Commercial HVAC on AB Road sheds. Pumps, water, hospitals, and centers are generator priority. Heavy work stands down after 13:00 with labour inspectors beside ward officers. A center without a tanker is closed. If inspectors have not reached the big sites by 16:30, say the enforcement condition failed.",
    citizenBrief:
      "Cooling centers are opening where people are actually working: the wholesale yard, the building sites, and the Rajwada carts. Big commercial air-conditioning is being cut so the grid can keep water and hospitals on. Heavy outdoor work is ordered to stop, and that order only counts if inspectors show up. The red team has sealed that condition in writing.",
  };
}

const lines = {
  A: {
    reason: "Centers locked. Grid trip remains live.",
    ops: "Lock is Cooling-centers. Eight rooms by 16:00, tankers to the yard, heavy work stood down. I am not claiming the transformer is safe.",
    equity: "Citizen line: shade is opening for workers. The grid is still a gamble, and the city has to say so.",
    adversary: "Minority report: without a shed, these rooms die with the transformer. Do not seal them as a completed system.",
    dissent: "Cooling centers remain a single-grid failure.",
  },
  B: {
    reason: "Grid lock. Equity refuses.",
    ops: "Lock is Hold-the-grid. Commercial HVAC sheds. No new centers. Thermal watch on Scheme 78.",
    equity: "I do not consent. Outdoor workers are not a residual weather problem.",
    adversary: "Minority report: a shed that skips enforcement will be reversed by the first mall call. Write the political risk down.",
    dissent: "Grid-first leaves outdoor workers without shade, and the shed can be walked back.",
  },
  C: {
    reason: "Workers-first locked, conditional on inspectors.",
    ops: "Lock is Workers-first. Centers at the yard, the sites, and Rajwada. Commercial chillers shed. Generators protect water, hospitals, and the centers. Inspectors carry the stop-work order.",
    equity: "Citizen line: the cool rooms are for the people who cannot go home. A center without water is not a center.",
    adversary: "Minority report: if inspectors do not reach the slab sites, the centers fill with workers who were never released. That is a condition, not a footnote.",
    dissent: "Workers-first is void as a claim if site inspectors have not arrived by 16:30.",
  },
} satisfies Record<ForkId, { reason: string; ops: string; equity: string; adversary: string; dissent: string }>;

export const heatwave: Scenario = {
  id: "heatwave",
  title: "Indore heatwave",
  city: "Indore",
  clock: "12 May 2036 · 15:10 IST",
  sealedAt: SEALED_AT,
  legend: "Heat stress",
  forks: FORKS,
  draft,
  open: [
    beat(400, { type: "phase", phase: "intake", label: "Intake", legend: "Heat stress" }),
    beat(
      2200,
      {
        type: "turn",
        agent: "scout",
        tone: "report",
        text: "12 May, 15:10. Palasia street sensors read 46.8°C. Wet-bulb at the wholesale yard is 31.2 and rising. Outdoor work is now a medical event, not a hot afternoon.",
      },
      {
        type: "map",
        delta: {
          wards: [
            { id: "palasia", severity: 0.86, hazard: 0.4 },
            { id: "rajwada", severity: 0.8, hazard: 0.35 },
            { id: "sukhliya", severity: 0.62, equity: 0.7 },
          ],
          feeds: [{ id: "myh", on: true }],
        },
      },
      { type: "confidence", value: 0.57, reason: "The heat is measured. The response is not." },
    ),
    beat(300, { type: "phase", phase: "specialists", label: "Specialists" }),
    beat(
      2200,
      {
        type: "turn",
        agent: "risk",
        tone: "report",
        text: "Scheme 78 transformer bank is at 96% of thermal rating. Lose it by 17:00 and water pressure goes with it. Heat plus a dry tap is the cascade.",
      },
      {
        type: "map",
        delta: { wards: [{ id: "scheme-78", severity: 0.74, hazard: 0.86 }] },
      },
      { type: "confidence", value: 0.61, reason: "Grid cascade is on the map." },
    ),
    beat(
      2100,
      {
        type: "turn",
        agent: "sim",
        tone: "report",
        text: "Cooling centers are staffed for 6,200. Outdoor workers still on sites and carts are about 19,000 inside the ring road. A center without water is a queue.",
      },
      { type: "confidence", value: 0.64, reason: "Capacity gap is quantified." },
    ),
    beat(
      2300,
      {
        type: "turn",
        agent: "equity",
        tone: "report",
        text: "The people who cannot go indoors are on scaffolding at Vijay Nagar and on carts at Rajwada and the yard. A plan that protects offices and pamphlets the workers is a class plan.",
      },
      {
        type: "map",
        delta: {
          wards: [
            { id: "vijay-nagar", severity: 0.7, equity: 0.9 },
            { id: "rajwada", equity: 0.84 },
          ],
        },
      },
      { type: "confidence", value: 0.68, reason: "The missed population has worksites." },
    ),
    beat(
      2300,
      {
        type: "turn",
        agent: "ops",
        tone: "report",
        text: "I can open eight centers, stand down heavy work after 13:00, and run tankers to the yard. I do not yet have a grid order that survives contact with commercial air-conditioning.",
      },
      {
        type: "map",
        delta: {
          shelters: [
            { id: "university", open: true },
            { id: "parade", open: true },
            { id: "exhibition", open: true },
            { id: "college", open: true },
          ],
        },
      },
      {
        type: "brief",
        operator: "Draft only: eight centers, tankers, stand-down. No grid order yet.",
        citizen: "Cooling rooms are being discussed. Nothing is sealed.",
      },
      { type: "confidence", value: 0.71, reason: "Ops has rooms. The red team has the transformer." },
    ),
    beat(360, { type: "phase", phase: "adversarial", label: "Adversarial round" }),
    beat(
      2500,
      {
        type: "turn",
        agent: "adversary",
        tone: "challenge",
        text: "Your centers are waiting rooms if Scheme 78 trips. And your stop-work order has no inspector on the contractors who pay by the slab. Name the shed, or you are writing a wish.",
      },
      { type: "arc", from: "adversary", to: "ops", kind: "strike" },
      { type: "dissent", agent: "adversary", text: "No shed order, no inspector. The centers are a wish." },
      { type: "confidence", value: 0.42, reason: "Adversary hit: shade without power or enforcement." },
    ),
    beat(
      2400,
      {
        type: "turn",
        agent: "risk",
        tone: "rebuttal",
        text: "Targeted shed: commercial HVAC on AB Road and the mall cluster. Not the pumps, not the centers, not the hospitals. Inspectors go with the ward officers. Centers and the yard join the generator list.",
      },
      { type: "arc", from: "risk", to: "adversary", kind: "consensus" },
      {
        type: "map",
        delta: {
          corridors: [{ id: "ab-road", active: true }],
          feeds: [{ id: "krishnapura", on: true }],
        },
      },
      { type: "confidence", value: 0.63, reason: "The shed has a boundary. Enforcement is still a condition." },
    ),
    beat(360, { type: "phase", phase: "forks", label: "72-hour forks" }),
    beat(
      2000,
      {
        type: "turn",
        agent: "sim",
        tone: "report",
        text: "A opens rooms and gambles the transformer. B saves the grid and spends the workers. C puts rooms on the worksites and sheds the commercial chillers. Lock one.",
      },
      { type: "forks", forks: FORKS },
    ),
    beat(500, { type: "fork_gate" }),
  ],
  close(fork) {
    const chosen = forkById(fork);
    const capsule = sealCapsule(draft(fork), SEALED_AT);
    const line = lines[fork];
    return sealBeats({
      fork,
      confidence: chosen.confidence,
      confidenceReason: line.reason,
      ops: line.ops,
      equity: line.equity,
      adversary: line.adversary,
      dissent: line.dissent,
      operator: capsule.operatorBrief,
      citizen: capsule.citizenBrief,
      capsule,
    });
  },
};
