import { formatConfidence } from "@/lib/format";

export function ConfidenceRibbon({
  value,
  reason,
  hit,
}: {
  value: number | null;
  reason: string;
  hit: number;
}) {
  const width = value === null ? 0 : Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="ribbon" data-hit={hit}>
      <p>
        Confidence{" "}
        <strong key={hit} className={hit > 0 ? "is-hit" : undefined}>
          {formatConfidence(value)}
        </strong>
      </p>
      <div className="ribbon-track" aria-hidden="true">
        <div className="ribbon-fill" style={{ width: `${width}%` }} />
      </div>
      <p className="ribbon-reason">{reason}</p>
    </div>
  );
}
