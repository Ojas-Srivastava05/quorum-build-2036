import Link from "next/link";

export default function NotFound() {
  return (
    <main className="missing">
      <div className="grain" aria-hidden="true" />
      <div className="missing-copy">
        <p className="wordmark wordmark-small">QUORUM</p>
        <h1>No capsule under that seal.</h1>
        <Link className="war-cta" href="/war-room">
          Return to the war room
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
