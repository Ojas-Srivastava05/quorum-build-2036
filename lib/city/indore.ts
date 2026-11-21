export interface WardGeometry {
  id: string;
  name: string;
  d: string;
  cx: number;
  cy: number;
}

export interface PointMark {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface CorridorGeometry {
  id: string;
  name: string;
  d: string;
}

/** Stylized Indore wards for the war-room table. Not a survey map. */
export const WARDS: WardGeometry[] = [
  { id: "sirpur", name: "Sirpur", d: "M58,44 L228,34 L246,168 L70,178 Z", cx: 152, cy: 106 },
  { id: "rajwada", name: "Rajwada", d: "M258,38 L438,30 L456,164 L250,156 Z", cx: 350, cy: 98 },
  { id: "panchsheel", name: "Panchsheel", d: "M470,36 L662,28 L674,160 L462,170 Z", cx: 568, cy: 100 },
  { id: "bengali-square", name: "Bengali Sq", d: "M690,32 L928,24 L940,156 L680,166 Z", cx: 810, cy: 96 },
  { id: "sukhliya", name: "Sukhliya", d: "M50,196 L236,184 L220,338 L42,350 Z", cx: 138, cy: 268 },
  { id: "palasia", name: "Palasia", d: "M252,176 L454,168 L468,342 L232,334 Z", cx: 352, cy: 256 },
  { id: "juni-indore", name: "Juni Indore", d: "M484,180 L676,168 L690,340 L470,350 Z", cx: 580, cy: 260 },
  { id: "scheme-78", name: "Scheme 78", d: "M708,174 L944,162 L956,336 L694,348 Z", cx: 826, cy: 256 },
  { id: "vijay-nagar", name: "Vijay Nagar", d: "M44,368 L214,354 L232,528 L36,542 Z", cx: 132, cy: 448 },
  { id: "bhawarkuan", name: "Bhawarkuan", d: "M248,356 L466,346 L482,534 L234,548 Z", cx: 358, cy: 446 },
  { id: "airport-road", name: "Airport Rd", d: "M498,360 L692,348 L708,540 L484,554 Z", cx: 596, cy: 450 },
  { id: "kanadia", name: "Kanadia", d: "M724,352 L958,338 L972,546 L710,558 Z", cx: 842, cy: 448 },
];

export const SHELTERS: PointMark[] = [
  { id: "parade", name: "Parade ground", x: 360, y: 118 },
  { id: "exhibition", name: "Exhibition field", x: 330, y: 248 },
  { id: "college", name: "Scheme 78 ground", x: 820, y: 236 },
  { id: "ridge", name: "Kanadia ridge school", x: 860, y: 430 },
  { id: "university", name: "University ground", x: 140, y: 460 },
];

export const CORRIDORS: CorridorGeometry[] = [
  {
    id: "mr10",
    name: "MR-10 overflow",
    d: "M70,372 C220,348 380,368 540,404 C690,436 820,424 940,400",
  },
  {
    id: "ab-road",
    name: "AB Road spine",
    d: "M310,48 C328,150 292,250 334,360 C368,470 352,540 386,610",
  },
  {
    id: "east-bypass",
    name: "Eastern bypass",
    d: "M870,48 C918,150 888,280 914,400 C934,490 900,540 868,610",
  },
];

export const FEEDS: PointMark[] = [
  { id: "krishnapura", name: "Krishnapura gauge", x: 458, y: 186 },
  { id: "underpass", name: "Airport underpass", x: 590, y: 500 },
  { id: "myh", name: "MY Hospital access", x: 400, y: 210 },
];

export const RIVER =
  "M452,16 C478,78 418,132 456,198 C502,268 424,332 462,408 C508,486 430,540 468,630";
