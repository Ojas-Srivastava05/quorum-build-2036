import {
  CORRIDORS,
  FEEDS,
  RIVER,
  SHELTERS,
  WARDS,
} from "@/lib/city/indore";

export interface WardVisual {
  severity: number;
  hazard: number;
  equity: number;
}

function floodColor(severity: number) {
  const t = Math.max(0, Math.min(1, severity));
  const red = Math.round(32 + t * 168);
  const green = Math.round(104 - t * 36);
  const blue = Math.round(102 - t * 40);
  const alpha = 0.16 + t * 0.74;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function CityPulseMap({
  wards,
  shelters,
  corridors,
  feeds,
  legend,
}: {
  wards: Record<string, WardVisual>;
  shelters: string[];
  corridors: string[];
  feeds: string[];
  legend: string;
}) {
  return (
    <svg
      className="city-map"
      viewBox="0 0 1000 640"
      role="img"
      aria-label="Stylized Indore ward map"
    >
      <rect width="1000" height="640" fill="#0b141b" />
      <path d={RIVER} fill="none" stroke="#1e4c4a" strokeWidth="16" strokeLinecap="round" />
      <path d={RIVER} fill="none" stroke="#3dbeb6" strokeWidth="2.5" strokeOpacity="0.8" />
      {WARDS.map((ward) => {
        const visual = wards[ward.id] ?? { severity: 0.05, hazard: 0, equity: 0 };
        return (
          <g key={ward.id}>
            <path d={ward.d} fill="#142028" stroke="rgba(186,214,210,0.28)" strokeWidth="2" />
            <path d={ward.d} fill={floodColor(visual.severity)} />
            {visual.hazard > 0.15 ? (
              <circle
                cx={ward.cx}
                cy={ward.cy}
                r={26 + visual.hazard * 34}
                fill="none"
                stroke="#d4654a"
                strokeOpacity={0.35 + visual.hazard * 0.5}
                strokeWidth="2"
                strokeDasharray="5 6"
              />
            ) : null}
            <text
              x={ward.cx}
              y={ward.cy}
              textAnchor="middle"
              fill={visual.severity > 0.55 ? "#f3d7a1" : "#d5e6e3"}
              fontSize="15"
              fontFamily="var(--font-instrument), sans-serif"
            >
              {ward.name}
            </text>
            {visual.equity > 0.45 ? (
              <circle cx={ward.cx} cy={ward.cy + 16} r="3.5" fill="#f0a202" />
            ) : null}
          </g>
        );
      })}
      {CORRIDORS.map((corridor) => {
        const active = corridors.includes(corridor.id);
        return (
          <path
            key={corridor.id}
            d={corridor.d}
            fill="none"
            stroke={active ? "#f0a202" : "rgba(186,214,210,0.18)"}
            strokeWidth={active ? 5 : 2}
            strokeDasharray={active ? "0" : "7 8"}
            strokeLinecap="round"
          />
        );
      })}
      {SHELTERS.map((shelter) => {
        const open = shelters.includes(shelter.id);
        return (
          <g key={shelter.id} className={open ? "shelter-open" : undefined}>
            <circle
              cx={shelter.x}
              cy={shelter.y}
              r={open ? 9 : 4}
              fill={open ? "#f0a202" : "none"}
              stroke="#f0a202"
              strokeOpacity={open ? 1 : 0.35}
              strokeWidth="2"
            />
            {open ? (
              <text
                x={shelter.x + 14}
                y={shelter.y + 4}
                fill="#f6e2b0"
                fontSize="13"
                fontFamily="var(--font-instrument), sans-serif"
              >
                {shelter.name}
              </text>
            ) : null}
          </g>
        );
      })}
      {FEEDS.map((feed) => {
        const on = feeds.includes(feed.id);
        return (
          <g key={feed.id}>
            <circle
              cx={feed.x}
              cy={feed.y}
              r={on ? 6 : 3}
              fill={on ? "#7ee0d6" : "#1d3336"}
              stroke="#7ee0d6"
              strokeOpacity={on ? 0.9 : 0.3}
            />
            {on ? (
              <text
                x={feed.x + 10}
                y={feed.y - 8}
                fill="#b7ebe4"
                fontSize="12"
                fontFamily="var(--font-instrument), sans-serif"
              >
                {feed.name}
              </text>
            ) : null}
          </g>
        );
      })}
      <text x="36" y="612" fill="#9eb0b6" fontSize="13" fontFamily="var(--font-instrument), sans-serif">
        {legend} · stylized wards, not a survey
      </text>
    </svg>
  );
}
