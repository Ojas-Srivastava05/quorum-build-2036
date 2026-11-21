import { sealCapsule } from "@/lib/capsule/seal";
import { beat } from "@/lib/scenarios/beats";
import { sealBeats } from "@/lib/scenarios/close";
import type {
  CapsuleDraft,
  ForkId,
  ForkSnapshot,
  Scenario,
} from "@/lib/types";

const SEALED_AT = "2036-07-18T19:42:00+05:30";

const FORKS: ForkSnapshot[] = [
  {
    id: "A",
    name: "Evacuate-first",
    thesis: "Clear the bastis. Leave the pumps on a skeleton.",
    severeRisk: 420,
    costCr: 186,
    equity: 0.86,
    confidence: 0.64,
    spark: [48, 62, 58, 46, 40, 36, 34, 33, 32, 31, 30, 29],
  },
  {
    id: "B",
    name: "Protect-infrastructure",
    thesis: "Hold the pumps and substations. People wait.",
    severeRisk: 1640,
    costCr: 96,
    equity: 0.41,
    confidence: 0.48,
    spark: [32, 40, 54, 68, 78, 84, 80, 74, 70, 68, 66, 64],
  },
  {
    id: "C",
    name: "Hybrid",
    thesis: "Basti buses first. A skeleton stays on the pumps.",
    severeRisk: 610,
    costCr: 142,
    equity: 0.78,
    confidence: 0.74,
    spark: [40, 46, 42, 36, 32, 29, 27, 25, 24, 23, 22, 21],
  },
];

function forkById(id: ForkId) {
  const found = FORKS.find((item) => item.id === id);
  if (!found) throw new Error(`Missing flood fork ${id}`);
  return found;
}

function draft(fork: ForkId): CapsuleDraft {
  const chosen = forkById(fork);
  const shared = {
    id: `indore-flood-${fork.toLowerCase()}`,
    scenarioId: "indore-flood" as const,
    scenarioTitle: "Indore monsoon flood",
    city: "Indore",
    clock: "18 July 2036 · 19:42 IST",
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
          title: "Buses 1–40 lock to the basti sequence",
          detail: "Sirpur drain, Panchsheel, night shelters, then apartment clusters.",
          owner: "Transport cell",
        },
        {
          rank: 2,
          title: "Open all 14 shelters now",
          detail: "Publish the list on ward speakers in Hindi before the next bus wave.",
          owner: "Relief",
        },
        {
          rank: 3,
          title: "Skeleton only on the pumps",
          detail: "Six crews stay. Everyone else moves people.",
          owner: "Drainage",
        },
        {
          rank: 4,
          title: "Close the airport-road underpass to private traffic",
          detail: "Keep one lane for ambulances off the AB Road spur.",
          owner: "Traffic",
        },
      ],
      tradeoffs: [
        "Severe risk falls fastest. The reserve is spent, and substations are thinly held.",
        "Apartment clusters wait. That is the equity choice, and it will be loud.",
        "If the cell breaks early, the city will have over-mobilized.",
      ],
      dissent: [
        {
          agent: "adversary",
          text: "Evacuate-first treats the pumps as a leftover. If two stations fail while the buses are committed, hour-30 harm meets the infrastructure curve. That risk is unpriced.",
        },
      ],
      operatorBrief:
        "LOCK Evacuate-first. Bus order is Sirpur, Panchsheel, night shelters, apartments. All 14 shelters open. Pump crews drop to six. Airport underpass closed to private vehicles. Do not brief this as a balanced plan. It spends the city to move the lowest houses first, and the pump skeleton can fail.",
      citizenBrief:
        "The city is clearing the lowest houses first and opening every shelter it has. Buses go to Sirpur and Panchsheel before apartment clusters. Pumping stations keep only a small crew, so the water may rise while people are moved. If your street is told to wait behind a poorer basti, that is the order the city sealed.",
    };
  }

  if (fork === "B") {
    return {
      ...shared,
      rankedActions: [
        {
          rank: 1,
          title: "Lock crews to six pumping stations and two substations",
          detail: "Generator kits move before any evacuation wave.",
          owner: "Drainage",
        },
        {
          rank: 2,
          title: "Keep MR-10 for plant access",
          detail: "It is not an evacuation spine tonight.",
          owner: "Traffic",
        },
        {
          rank: 3,
          title: "Open only the high shelters",
          detail: "Kanadia ridge school and Scheme 78 ground. The rest stay dark.",
          owner: "Relief",
        },
        {
          rank: 4,
          title: "Two-hour warning for Sirpur and Panchsheel",
          detail: "Boat notice, not the first buses.",
          owner: "Ward officers",
        },
      ],
      tradeoffs: [
        "The plant is more likely to survive the night. Thousands of people are not.",
        "The purse and the reserve stay intact. Equity does not.",
        "A photograph of a running pump is not a successful evacuation.",
      ],
      dissent: [
        {
          agent: "equity",
          text: "This fork writes the bastis as a residual. I do not consent to sealing a plan that warns Sirpur and then sends the buses elsewhere.",
        },
        {
          agent: "adversary",
          text: "Protecting the plant on a single corridor, MR-10, repeats the culvert failure. You may lose the pumps and the people.",
        },
      ],
      operatorBrief:
        "LOCK Protect-infrastructure. Generators and crews to six pumping stations and two substations before any basti run. MR-10 is plant access only. Shelters open only at Kanadia ridge and Scheme 78. Sirpur and Panchsheel get a two-hour warning, not buses 1–22. Equity has dissented. Do not describe this lock as shared sacrifice. The sacrifice has an address.",
      citizenBrief:
        "The city has chosen to keep the pumping stations running before it moves the bastis. Sirpur and Panchsheel will get a warning, not the first buses. Only the high shelters, at Kanadia and Scheme 78, are opening. This choice protects machines first. The equity seat has refused to consent, and that refusal is part of the sealed record.",
    };
  }

  return {
    ...shared,
    rankedActions: [
      {
        rank: 1,
        title: "Freeze buses 1–22 to the basti order",
        detail: "Sirpur drain, then Panchsheel, then night shelters, then apartments.",
        owner: "Transport cell",
      },
      {
        rank: 2,
        title: "Spine is AB Road, not MR-10",
        detail: "Elevated run to Dewas Naka. Pump kits staged at the Pipliyahana culvert. MR-10 is overflow only.",
        owner: "Traffic",
      },
      {
        rank: 3,
        title: "Skeleton crews and generators on six pumping stations",
        detail: "Pre-position in the first hour, before the apartment runs.",
        owner: "Drainage",
      },
      {
        rank: 4,
        title: "Open shelters in a written order",
        detail: "Parade ground, exhibition field, Scheme 78 college ground, Kanadia ridge school.",
        owner: "Relief",
      },
      {
        rank: 5,
        title: "Protect MY Hospital as a spur, not a public corridor",
        detail: "Access comes off AB Road. Re-check the Krishnapura gauge every 20 minutes.",
        owner: "Health",
      },
    ],
    tradeoffs: [
      "People at severe risk stay lower than a plant-first plan, at a higher cost.",
      "The hybrid still assumes the culvert pumps start. If they do not, the harm curve bends toward the worse fork.",
      "Apartment clusters wait. The wait is now a written rule, not a preference.",
    ],
    dissent: [
      {
        agent: "adversary",
        text: "Hybrid still assumes the culvert pumps start. If they do not, severe risk converges on the infrastructure-first harm curve by hour 30. I do not consent to sealing that assumption as a fact. Record it as a condition.",
      },
    ],
    operatorBrief:
      "LOCK Hybrid. Bus order: Sirpur, Panchsheel, night shelters, apartment clusters. Buses 1–22 are frozen to that order. Spine is AB Road elevated to Dewas Naka. MR-10 is overflow only, with pump kits at the Pipliyahana culvert. Eastern bypass lifts toward Kanadia. Generator kits pre-position at six pumping stations in the first hour. Shelter order: parade ground, exhibition field, Scheme 78 college ground, Kanadia ridge school. MY Hospital access is a spur off AB Road. Re-check Krishnapura every 20 minutes. If the culvert pumps have not started by hour 2, the hybrid is void: shift remaining buses to evacuate-first and say so.",
    citizenBrief:
      "The city is moving the lowest houses first. Buses 1 to 22 go to Sirpur drain and Panchsheel before any apartment cluster. Shelters open at the parade ground, the exhibition field, Scheme 78 college ground, and the Kanadia ridge school. The main bus road is AB Road. MR-10 is only a backup, because its culvert often clogs. Crews stay on six pumping stations so the water has somewhere to go. If you are told to wait while a richer street is cleared, that order breaks this capsule. The red-team note is part of the record: this plan still depends on the culvert pumps starting. If they do not, the city has to say the plan changed.",
  };
}

const open = [
  beat(500, {
    type: "phase",
    phase: "intake",
    label: "Intake",
    legend: "Standing water",
  }),
  beat(
    2600,
    {
      type: "turn",
      agent: "scout",
      tone: "report",
      text: "Monsoon cell has stalled over the Khan basin. Krishnapura gauge is 1.4 metres above the July mean and still climbing. Water is already in Rajwada, Juni Indore, and the airport-road underpass. This is not a forecast. It is standing water.",
    },
    {
      type: "map",
      delta: {
        wards: [
          { id: "rajwada", severity: 0.84, hazard: 0.25 },
          { id: "juni-indore", severity: 0.78, hazard: 0.3 },
          { id: "airport-road", severity: 0.72, hazard: 0.35 },
          { id: "sirpur", severity: 0.7, hazard: 0.2, equity: 0.55 },
        ],
        feeds: [
          { id: "krishnapura", on: true },
          { id: "underpass", on: true },
        ],
      },
    },
    {
      type: "confidence",
      value: 0.58,
      reason: "Scout has water on the ground. The plan does not exist yet.",
    },
  ),
  beat(400, { type: "phase", phase: "specialists", label: "Specialists" }),
  beat(
    2800,
    {
      type: "turn",
      agent: "risk",
      tone: "report",
      text: "If the cell holds another six hours, the Palasia drain backs into the hospital approach. A flooded road to MY Hospital is a cascade: ambulances, dialysis, the night shift. Treat the river and the hospital as one system.",
    },
    {
      type: "map",
      delta: {
        wards: [
          { id: "palasia", severity: 0.62, hazard: 0.7 },
          { id: "juni-indore", severity: 0.8, hazard: 0.55 },
        ],
        feeds: [{ id: "myh", on: true }],
      },
    },
    {
      type: "confidence",
      value: 0.63,
      reason: "The cascade is named. It is not yet answered.",
    },
  ),
  beat(
    2700,
    {
      type: "turn",
      agent: "sim",
      tone: "report",
      text: "Shelter stock covers 11,400 people. A hold-pattern storm asks for about 28,000 by hour 18. We have 64 buses. 19 are already on school dismissal. The gap is 16,600 people and a missing route, not a slogan.",
    },
    { type: "confidence", value: 0.66, reason: "The gap has a number. Numbers can still be used badly." },
  ),
  beat(
    3000,
    {
      type: "turn",
      agent: "equity",
      tone: "report",
      text: "The first water is in the bastis along Sirpur and Panchsheel drains. Night-shift households will not get a ward blast. If the bus sequence starts with apartment clusters because the turns are cleaner, the plan is already unjust.",
    },
    {
      type: "map",
      delta: {
        wards: [
          { id: "sirpur", severity: 0.8, equity: 0.92, hazard: 0.4 },
          { id: "panchsheel", severity: 0.66, equity: 0.88, hazard: 0.35 },
        ],
      },
    },
    { type: "confidence", value: 0.7, reason: "Equity has named who the clean math skips." },
  ),
  beat(
    3000,
    {
      type: "turn",
      agent: "ops",
      tone: "report",
      text: "I can open 14 shelters and paint two dry corridors: MR-10 toward Vijay Nagar, and the eastern bypass up to Kanadia ridge. Parade ground, the exhibition field, and Scheme 78 take the first wave. That is a plan. It is not yet a defensible one.",
    },
    {
      type: "map",
      delta: {
        shelters: [
          { id: "parade", open: true },
          { id: "exhibition", open: true },
          { id: "college", open: true },
          { id: "ridge", open: true },
        ],
        corridors: [
          { id: "mr10", active: true },
          { id: "east-bypass", active: true },
        ],
      },
    },
    {
      type: "brief",
      operator:
        "Working picture, not a lock. 14 shelters. Corridors on MR-10 and the eastern bypass. Hospital approach is flagged and not yet protected.",
      citizen:
        "The city is drawing shelter routes. Nothing is decided until the floor locks a 72-hour fork and seals it.",
    },
    { type: "confidence", value: 0.74, reason: "Ops has a map. The red team has not touched it." },
  ),
  beat(500, { type: "phase", phase: "adversarial", label: "Adversarial round" }),
  beat(
    3200,
    {
      type: "turn",
      agent: "adversary",
      tone: "challenge",
      text: "MR-10 dies when the Pipliyahana culvert clogs. It clogs every August. You have drawn one spine and called it a system. Fail that culvert and the evacuation becomes a traffic jam in rising water.",
    },
    { type: "arc", from: "adversary", to: "ops", kind: "strike" },
    {
      type: "dissent",
      agent: "adversary",
      text: "MR-10 is a single point of failure at the Pipliyahana culvert.",
    },
    { type: "confidence", value: 0.46, reason: "Adversary hit: one corridor is not a system." },
  ),
  beat(
    2800,
    {
      type: "turn",
      agent: "ops",
      tone: "rebuttal",
      text: "Second spine: AB Road, the elevated run to Dewas Naka, with pump kits staged at the culvert. MR-10 becomes overflow, not the only way out. If the culvert goes, the elevated road still moves buses.",
    },
    { type: "arc", from: "ops", to: "adversary", kind: "consensus" },
    { type: "map", delta: { corridors: [{ id: "ab-road", active: true }] } },
    { type: "confidence", value: 0.57, reason: "A second spine is on the map. Confidence climbs, it does not snap back." },
  ),
  beat(
    3200,
    {
      type: "turn",
      agent: "adversary",
      tone: "challenge",
      text: "Equity named the bastis. The bus board still wants towers first, because the turns are easier. Write the order in public or admit the blind spot you are about to seal.",
    },
    { type: "arc", from: "adversary", to: "equity", kind: "strike" },
    {
      type: "dissent",
      agent: "adversary",
      text: "The basti sequence is still a speech, not a bus order.",
    },
    { type: "confidence", value: 0.38, reason: "Adversary hit: equity has no sequence yet." },
  ),
  beat(
    2800,
    {
      type: "turn",
      agent: "equity",
      tone: "rebuttal",
      text: "Order is written. Sirpur drain, then Panchsheel, then night shelters, then apartment clusters. Buses 1 through 22 are locked to that sequence. Anyone who reorders it owes this floor a reason.",
    },
    { type: "arc", from: "equity", to: "adversary", kind: "consensus" },
    {
      type: "brief",
      operator:
        "Bus order if we lock people-first: Sirpur, Panchsheel, night shelters, apartments. Buses 1–22 frozen. AB Road added as the spine. MR-10 demoted to overflow.",
      citizen:
        "If the city locks the fairer plan, the first buses go to Sirpur and Panchsheel, not to apartment clusters. That sentence is now on the floor. It is not sealed yet.",
    },
    { type: "confidence", value: 0.55, reason: "The sequence is written. It can still be broken." },
  ),
  beat(
    3100,
    {
      type: "turn",
      agent: "adversary",
      tone: "challenge",
      text: "You modeled the river. You did not model a grid failure at the pumping stations. Indore’s near-miss was power, not rain. A perfect corridor is a ditch if the pumps go dark.",
    },
    { type: "arc", from: "adversary", to: "risk", kind: "strike" },
    {
      type: "dissent",
      agent: "adversary",
      text: "The model still ignores a grid failure at the pumping stations.",
    },
    { type: "confidence", value: 0.33, reason: "Adversary hit: power, not just water." },
  ),
  beat(
    2900,
    {
      type: "turn",
      agent: "risk",
      tone: "rebuttal",
      text: "Six pumping stations get generator kits in the first hour, before the apartment runs. If the grid drops we lose forty minutes, not the night. I am putting that hazard on the map so nobody can brief it away.",
    },
    { type: "arc", from: "risk", to: "adversary", kind: "consensus" },
    {
      type: "map",
      delta: {
        wards: [
          { id: "scheme-78", hazard: 0.62, severity: 0.4 },
          { id: "palasia", hazard: 0.8 },
        ],
      },
    },
    { type: "confidence", value: 0.6, reason: "Generators are named. The floor can see the condition." },
  ),
  beat(450, { type: "phase", phase: "forks", label: "72-hour forks" }),
  beat(
    2400,
    {
      type: "turn",
      agent: "sim",
      tone: "report",
      text: "Three forks for the next 72 hours. A clears people and spends the city. B saves the pumps and spends the bastis. C keeps a skeleton on the pumps and sends the first buses to Sirpur. The harm curves are on the table. The floor has to lock one.",
    },
    { type: "forks", forks: FORKS },
  ),
  beat(700, { type: "fork_gate" }),
];

const lines: Record<
  ForkId,
  { ops: string; equity: string; adversary: string; dissent: string; reason: string }
> = {
  A: {
    reason: "Evacuate-first locked. The pump skeleton is the open risk.",
    ops: "Lock is Evacuate-first. Buses 1 to 40 take Sirpur, then Panchsheel, then night shelters, then apartments. All 14 shelters open. Pump crews drop to six. I am not calling this balanced.",
    equity:
      "Citizen line: the lowest houses move first, and richer streets wait. That wait is the plan, not a mistake. If a ward officer quietly reorders it, the capsule is already breached.",
    adversary:
      "Minority report: you priced the people and left the pumps as a hope. Two dark stations and this lock meets the worse curve by hour 30. Keep that on the seal.",
    dissent:
      "Evacuate-first leaves the pumps as an unpriced failure. Hour 30 can still meet the worse curve.",
  },
  B: {
    reason: "Infrastructure lock. Equity has refused consent.",
    ops: "Lock is Protect-infrastructure. Generators and crews take six pumping stations and two substations before any basti wave. MR-10 stays a plant road. Only Kanadia ridge and Scheme 78 open.",
    equity:
      "I do not consent. Sirpur gets a warning and not a bus. Put that sentence in the citizen brief without softening it.",
    adversary:
      "Minority report: the plant you are saving still depends on MR-10. The culvert takes the pumps and the people in the same hour. This lock can fail twice.",
    dissent:
      "Plant-first still rides MR-10, and Equity refuses the basti residual.",
  },
  C: {
    reason: "Hybrid locked, conditional on the culvert pumps starting.",
    ops: "Lock is Hybrid. First buses to Sirpur and Panchsheel. Skeleton crews and generator kits hold six pumping stations. AB Road is the spine. MR-10 is overflow. Eastern bypass takes Kanadia. Shelters open parade ground, exhibition field, Scheme 78, Kanadia ridge school.",
    equity:
      "Citizen line: the city moves the lowest houses first. If you are told to wait while a richer ward is cleared, that order is a breach, and it will be in the capsule.",
    adversary:
      "Minority report: Hybrid still assumes the culvert pumps start. If they do not, severe risk converges on the plant-first curve by hour 30. I do not consent to sealing that assumption as a fact. Record it as a condition.",
    dissent:
      "Hybrid is conditional: if the culvert pumps have not started by hour 2, the lock is void.",
  },
};

export const indoreFlood: Scenario = {
  id: "indore-flood",
  title: "Indore monsoon flood",
  city: "Indore",
  clock: "18 July 2036 · 19:42 IST",
  sealedAt: SEALED_AT,
  legend: "Standing water",
  forks: FORKS,
  open,
  draft,
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
