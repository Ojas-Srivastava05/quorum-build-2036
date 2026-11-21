export function DualBrief({
  mode,
  operator,
  citizen,
  onChange,
}: {
  mode: "operator" | "citizen";
  operator: string;
  citizen: string;
  onChange: (mode: "operator" | "citizen") => void;
}) {
  const text =
    mode === "operator" ? operator : citizen;
  return (
    <section className="brief" aria-label="Dual brief">
      <div className="brief-toggle" role="group" aria-label="Brief mode">
        <button
          type="button"
          aria-pressed={mode === "operator"}
          onClick={() => onChange("operator")}
        >
          Operator
        </button>
        <button
          type="button"
          aria-pressed={mode === "citizen"}
          onClick={() => onChange("citizen")}
        >
          Citizen
        </button>
      </div>
      <p>{text || "The brief is still on the floor."}</p>
    </section>
  );
}
