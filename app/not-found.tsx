import Link from "next/link";

export default function NotFound() {
  return (
    <main className="missing">
      <div>
        <p className="capsule-kicker">Quorum</p>
        <h1>No capsule under that seal.</h1>
        <Link className="war-cta" href="/war-room">
          Return to the war room
        </Link>
      </div>
    </main>
  );
}
