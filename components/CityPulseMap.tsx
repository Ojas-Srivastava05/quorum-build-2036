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
  const red = Math.round(22 + t * 206);
  const green = Math.round(118 - t * 48);
  const blue = Math.round(112 - t * 62);
  const alpha = 0.2 + t * 0.62;
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
      <defs>
        <radialGradient id="ground" cx="42%" cy="40%" r="78%">
          <stop offset="0%" stopColor="#142430" />
          <stop offset="68%" stopColor="#0c161d" />
          <stop offset="100%" stopColor="#070e13" />
        </radialGradient>
        <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a4e4a" />
          <stop offset="50%" stopColor="#2f8f86" />
          <stop offset="100%" stopColor="#143834" />
        </linearGradient>
        <pattern id="mesh" width="46" height="46" patternUnits="userSpaceOnUse">
          <path d="M46 0H0V46" fill="none" stroke="rgba(150,196,190,0.07)" strokeWidth="1" />
        </pattern>
        <radialGradient id="map-vignette" cx="50%" cy="42%" r="68%">
          <stop offset="58%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
        </radialGradient>
      </defs>
      <rect width="1000" height="640" fill="url(#ground)" />
      <rect width="1000" height="640" fill="url(#mesh)" />
      <path d={RIVER} fill="none" stroke="url(#river)" strokeWidth="18" strokeLinecap="round" />
      <path className="river-sheen" d={RIVER} fill="none" stroke="#d8fff8" strokeWidth="1.4" strokeLinecap="round" />
      <path
        className="river-flow"
        d={RIVER}
        fill="none"
        stroke="#7ee0d6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="12 18"
      />
      {WARDS.map((ward) => {
        const visual = wards[ward.id] ?? { severity: 0.05, hazard: 0, equity: 0 };
        return (
          <g key={ward.id}>
            <path d={ward.d} fill="#121c24" stroke="rgba(186,214,210,0.24)" strokeWidth="1.5" />
            <path d={ward.d} fill={floodColor(visual.severity)} />
            {visual.hazard > 0.15 ? (
              <circle
                className="hazard-ring"
                cx={ward.cx}
                cy={ward.cy}
                r={26 + visual.hazard * 34}
                fill="none"
                stroke="#e25b3c"
                strokeOpacity={0.4 + visual.hazard * 0.45}
                strokeWidth="1.6"
                strokeDasharray="4 7"
              />
            ) : null}
            <text
              x={ward.cx}
              y={ward.cy}
              textAnchor="middle"
              fill={visual.severity > 0.55 ? "#f6ddb0" : "#d5e6e3"}
              fontSize="14"
              letterSpacing="0.4"
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
            className={active ? "corridor-live" : undefined}
            d={corridor.d}
            fill="none"
            stroke={active ? "#f5a524" : "rgba(186,214,210,0.2)"}
            strokeWidth={active ? 4.5 : 1.6}
            strokeDasharray={active ? undefined : "7 9"}
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
              r={open ? 8 : 3.5}
              fill={open ? "#f5a524" : "none"}
              stroke="#f5a524"
              strokeOpacity={open ? 1 : 0.4}
              strokeWidth="1.6"
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
              className={on ? "feed-live" : undefined}
              cx={feed.x}
              cy={feed.y}
              r={on ? 5.5 : 2.6}
              fill={on ? "#9ff3ea" : "#163034"}
              stroke="#7ee0d6"
              strokeOpacity={on ? 0.95 : 0.35}
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
      <text className="map-legend" x="28" y="34" fill="#8ea3a8" fontSize="13" letterSpacing="1.6">
        {legend}
      </text>
      <rect width="1000" height="640" fill="url(#map-vignette)" pointerEvents="none" />
    </svg>
  );
}
