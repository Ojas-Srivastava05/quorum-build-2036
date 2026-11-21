import { sealCapsule } from "@/lib/capsule/seal";
import { beat } from "@/lib/scenarios/beats";
import { sealBeats } from "@/lib/scenarios/close";
import type { CapsuleDraft, ForkId, ForkSnapshot, Scenario } from "@/lib/types";

const SEALED_AT = "2036-08-02T11:05:00+05:30";

const FORKS: ForkSnapshot[] = [
  {
    id: "A",
    name: "Visible ward works",
    thesis: "Resurface what photographs. Leave the plant thin.",
    severeRisk: 2380,
    costCr: 128,
    equity: 0.34,
    confidence: 0.41,
    spark: [40, 48, 58, 66, 72, 76, 74, 73, 72, 71, 70, 70],
  },
  {
    id: "B",
    name: "Quiet critical plant",
    thesis: "Buy the substations. Defer the basti drains.",
    severeRisk: 980,
    costCr: 146,
    equity: 0.57,
    confidence: 0.6,
    spark: [36, 40, 44, 42, 38, 36, 35, 34, 34, 33, 33, 32],
  },
  {
    id: "C",
    name: "Pumps, then bastis",
    thesis: "Plant first, Sirpur drains second, a capped road line.",
    severeRisk: 540,
    costCr: 198,
    equity: 0.81,
    confidence: 0.77,
    spark: [38, 36, 32, 28, 26, 24, 23, 22, 21, 21, 20, 20],
  },
];

function forkById(id: ForkId) {
  const found = FORKS.find((item) => item.id === id);
  if (!found) throw new Error(`Missing budget fork ${id}`);
  return found;
}

function draft(fork: ForkId): CapsuleDraft {
  const chosen = forkById(fork);
  const shared = {
    id: `budget-triage-${fork.toLowerCase()}`,
    scenarioId: "budget-triage" as const,
    scenarioTitle: "Indore recovery purse",
    city: "Indore",
    clock: "2 August 2036 · 11:05 IST",
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
          title: "Resurface six wards",
          detail: "₹128 crore on carriageway the public can see.",
          owner: "Works",
        },
        {
          rank: 2,
          title: "Hold the plant for a later file",
          detail: "Scheme 78 substation and Palasia drainage stay on patch maintenance.",
          owner: "Drainage",
        },
      ],
      tradeoffs: [
        "The photograph is ready this month. The next storm is not.",
        "Sirpur still floods in an ordinary rain.",
      ],
      dissent: [
        {
          agent: "equity",
          text: "Resurfacing AB Road before the Sirpur drain tells poor wards the water was their weather.",
        },
        {
          agent: "adversary",
          text: "Visible works are how the purse gets captured. There is no cap, so there is no seal that survives September.",
        },
      ],
      operatorBrief:
        "LOCK Visible works. ₹128 crore carriageway across six wards. Plant stays on patch maintenance. Equity and Adversary both dissent. Do not brief this as resilience.",
      citizenBrief:
        "The city is spending the recovery money on roads you can see. The pumping plant and the basti drains stay weak. Two seats on the council refused this choice. Their refusal is part of the sealed record.",
    };
  }

  if (fork === "B") {
    return {
      ...shared,
      rankedActions: [
        {
          rank: 1,
          title: "Rebuild two substations and the Palasia plant",
          detail: "₹146 crore. No ribbon-cutting.",
          owner: "Power and drainage",
        },
        {
          rank: 2,
          title: "Defer Sirpur and Panchsheel drains",
          detail: "They wait for a supplementary purse.",
          owner: "Works",
        },
      ],
      tradeoffs: [
        "The next cell is less likely to kill the plant. The bastis still hold water after ordinary rain.",
        "Quiet spending is easier to raid because nobody can see it.",
      ],
      dissent: [
        {
          agent: "adversary",
          text: "A quiet plant budget with no public item list will be nibbled into resurfacing by October. Itemize it or lose it.",
        },
      ],
      operatorBrief:
        "LOCK Critical plant. ₹146 crore, itemized, for two substations and the Palasia drainage plant. Basti drains deferred. Publish the item list with the seal or the quiet budget will be raided.",
      citizenBrief:
        "The city is spending on the substations and the drainage plant, not on new road surfaces. Drains in Sirpur and Panchsheel wait. The red team warns that a quiet budget is easy to divert unless every item stays public. Those items are in this capsule.",
    };
  }

  return {
    ...shared,
    rankedActions: [
      {
        rank: 1,
        title: "Plant and substations, itemized",
        detail: "Palasia drainage plant plus two Scheme 78 substations, published line by line.",
        owner: "Power and drainage",
      },
      {
        rank: 2,
        title: "Sirpur, Panchsheel, and the underpass next",
        detail: "The drains that failed in July, before any beautification.",
        owner: "Works",
      },
      {
        rank: 3,
        title: "Cap the visible road line at ₹22 crore",
        detail: "Only carriageway that is structurally failed. Beautification voids the seal.",
        owner: "Finance",
      },
      {
        rank: 4,
        title: "Hold ₹16 crore inside the ₹214 crore purse",
        detail: "Unspent is a reserve, not a slush line.",
        owner: "Finance",
      },
    ],
    tradeoffs: [
      "The purse is nearly fully committed. There is little left for a surprise.",
      "The road cap will disappoint anyone who wanted a photograph. That is the point.",
    ],
    dissent: [
      {
        agent: "adversary",
        text: "₹22 crore is still how a photograph sneaks back in. If any line item says beautification, streetscape, or façade, this seal is breached and the drains have lost.",
      },
    ],
    operatorBrief:
      "LOCK Pumps-then-bastis. Itemized plant and two substations first. Then Sirpur, Panchsheel, and the airport underpass. Visible carriageway capped at ₹22 crore and only where the structure has failed. ₹16 crore stays unspent inside the ₹214 crore purse. Any line called beautification voids the seal. Publish the items with the hash.",
    citizenBrief:
      "Recovery money goes to the pumps and substations first, then to the drains in Sirpur and Panchsheel that flooded in July. Road spending is capped, and it cannot be used to decorate a street. If a project in this purse is described as beautification, the city has broken the sealed decision. The item list is public on purpose.",
  };
}

const lines = {
  A: {
    reason: "Visible works locked. Both dissent seats refuse.",
    ops: "Lock is Visible ward works. ₹128 crore on carriageway. The plant waits. I will not dress this as safety.",
    equity: "I refuse. The citizen brief has to say the bastis were postponed for a road.",
    adversary: "Minority report: there is no cap. By September this purse is a photograph. The seal should say so.",
    dissent: "Visible works have no cap. Equity and Adversary both refuse.",
  },
  B: {
    reason: "Plant locked. The quiet budget can still be raided.",
    ops: "Lock is the critical plant. ₹146 crore, itemized, for substations and Palasia drainage. Basti drains wait.",
    equity: "Citizen line: the machines that failed are funded. The drains outside poor houses are not, and that delay is explicit.",
    adversary: "Minority report: itemize in public or this quiet file gets eaten by resurfacing. The condition is the published list.",
    dissent: "Plant spending is only real if the item list stays public.",
  },
  C: {
    reason: "Pumps then bastis, with a hard cap on the photograph.",
    ops: "Lock is pumps, then the bastis. Plant and substations first, Sirpur and Panchsheel next, road line capped at ₹22 crore. Beautification voids the seal.",
    equity: "Citizen line: the drains that flooded poor wards are in the purse, ahead of any street the city wants to admire.",
    adversary: "Minority report: ₹22 crore is the door a photograph walks through. Beautification, streetscape, or façade breaches this seal.",
    dissent: "Any beautification line item breaches the pumps-then-bastis seal.",
  },
} satisfies Record<ForkId, { reason: string; ops: string; equity: string; adversary: string; dissent: string }>;

export const budgetTriage: Scenario = {
  id: "budget-triage",
  title: "Indore recovery purse",
  city: "Indore",
  clock: "2 August 2036 · 11:05 IST",
  sealedAt: SEALED_AT,
  legend: "Residual risk",
  forks: FORKS,
  draft,
  open: [
    beat(400, {
      type: "phase",
      phase: "intake",
      label: "Intake",
      legend: "Residual risk",
    }),
    beat(
      2200,
      {
        type: "turn",
        agent: "scout",
        tone: "report",
        text: "Two weeks after the July flood. Sirpur and Juni Indore still hold water after an ordinary rain. The airport underpass pumps short-cycle. The wards that photograph well are already dry.",
      },
      {
        type: "map",
        delta: {
          wards: [
            { id: "sirpur", severity: 0.72, equity: 0.8 },
            { id: "juni-indore", severity: 0.64 },
            { id: "airport-road", severity: 0.58, hazard: 0.4 },
          ],
          feeds: [{ id: "underpass", on: true }],
        },
      },
      { type: "confidence", value: 0.56, reason: "The dry streets are not the wet ones." },
    ),
    beat(300, { type: "phase", phase: "specialists", label: "Specialists" }),
    beat(
      2100,
      {
        type: "turn",
        agent: "risk",
        tone: "report",
        text: "Two substations at Scheme 78 and the Palasia drainage plant will not survive the next cell. They failed soft in July. The next failure is hard.",
      },
      {
        type: "map",
        delta: {
          wards: [
            { id: "scheme-78", severity: 0.55, hazard: 0.78 },
            { id: "palasia", severity: 0.5, hazard: 0.74 },
          ],
        },
      },
      { type: "confidence", value: 0.6, reason: "The next failure has an address." },
    ),
    beat(
      2100,
      {
        type: "turn",
        agent: "sim",
        tone: "report",
        text: "The recovery purse is ₹214 crore. Visible resurfacing across six wards prices at ₹128 crore and leaves the plant short. Plant, substations, and the basti drains do not all fit if the roads go first.",
      },
      { type: "confidence", value: 0.63, reason: "The purse has a ceiling." },
    ),
    beat(
      2200,
      {
        type: "turn",
        agent: "equity",
        tone: "report",
        text: "Resurfacing AB Road before the Sirpur drain is how a city tells poor wards the water was their weather.",
      },
      {
        type: "map",
        delta: {
          wards: [
            { id: "sirpur", equity: 0.93, severity: 0.76 },
            { id: "panchsheel", equity: 0.84, severity: 0.48 },
          ],
        },
      },
      { type: "confidence", value: 0.67, reason: "The unfair sequence is explicit." },
    ),
    beat(
      2200,
      {
        type: "turn",
        agent: "ops",
        tone: "report",
        text: "A split is possible: plant and substations first, then Sirpur, Panchsheel, and the underpass, and a thin visible package only where the road is actually broken.",
      },
      {
        type: "map",
        delta: { corridors: [{ id: "ab-road", active: true }, { id: "mr10", active: true }] },
      },
      {
        type: "brief",
        operator: "Draft split: plant, then basti drains, then a thin road package. Not locked.",
        citizen: "The council is dividing recovery money. The seal has not been struck.",
      },
      { type: "confidence", value: 0.7, reason: "A split exists. It has no cap yet." },
    ),
    beat(360, { type: "phase", phase: "adversarial", label: "Adversarial round" }),
    beat(
      2400,
      {
        type: "turn",
        agent: "adversary",
        tone: "challenge",
        text: "The thin visible package is how the photograph gets back in. Cap it in the capsule or it will eat the drains by September.",
      },
      { type: "arc", from: "adversary", to: "ops", kind: "strike" },
      { type: "dissent", agent: "adversary", text: "An uncapped 'thin' road line will eat the drains." },
      { type: "confidence", value: 0.44, reason: "Adversary hit: the photograph has no cap." },
    ),
    beat(
      2300,
      {
        type: "turn",
        agent: "equity",
        tone: "rebuttal",
        text: "Cap is written: ₹22 crore for carriageway that is structurally failed, itemized, and not a beautification line. Anything called beautification voids the seal.",
      },
      { type: "arc", from: "equity", to: "adversary", kind: "consensus" },
      { type: "confidence", value: 0.66, reason: "The cap is a number. It can still be broken later." },
    ),
    beat(320, { type: "phase", phase: "forks", label: "72-hour forks" }),
    beat(
      1900,
      {
        type: "turn",
        agent: "sim",
        tone: "report",
        text: "If the next cell hits this week: A photographs well and floods again. B saves the plant and leaves Sirpur wet. C funds the plant, then the basti drains, and caps the road. The purse is ₹214 crore. Lock one.",
      },
      { type: "forks", forks: FORKS },
    ),
    beat(480, { type: "fork_gate" }),
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
