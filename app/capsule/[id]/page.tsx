import { DownloadCapsule } from "@/components/DownloadCapsule";
import { allCapsuleIds, getCapsule } from "@/lib/capsule/store";
import { formatHash } from "@/lib/format";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allCapsuleIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const capsule = getCapsule(id);
  if (!capsule) return { title: "Capsule" };
  return { title: `Capsule ${capsule.seal.hash.slice(0, 8)}` };
}

export default async function CapsulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const capsule = getCapsule(id);
  if (!capsule) notFound();

  return (
    <main className="capsule-page">
      <article className="capsule-wrap">
        <p className="capsule-kicker">Quorum · Decision Capsule</p>
        <h1>Sealed</h1>
        <p className="lead">
          {capsule.city} · {capsule.scenarioTitle} · {capsule.clock}
        </p>
        <div className="capsule-seal">
          <span>{capsule.seal.algorithm}</span>
          <strong>{formatHash(capsule.seal.hash)}</strong>
          <em>{capsule.seal.sealedAt}</em>
        </div>
        <p className="meta">
          Fork {capsule.fork} · {capsule.forkName} · confidence {capsule.confidence.toFixed(2)}
        </p>
        <h2>Citizen brief</h2>
        <div className="brief-block">
          <p>{capsule.citizenBrief}</p>
        </div>
        <h2>Ranked actions</h2>
        <ol className="actions">
          {capsule.rankedActions.map((action) => (
            <li key={action.rank}>
              <span>{action.rank}</span>
              <div>
                <strong>{action.title}</strong>
                <p>
                  {action.detail} <em>{action.owner}</em>
                </p>
              </div>
            </li>
          ))}
        </ol>
        <h2>Trade-offs</h2>
        <ul className="tradeoffs">
          {capsule.tradeoffs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>Minority dissent</h2>
        {capsule.dissent.map((note) => (
          <blockquote key={note.text}>
            <span>Kept in the seal · {note.agent}</span>
            {note.text}
          </blockquote>
        ))}
        <h2>Operator brief</h2>
        <div className="brief-block">
          <p>{capsule.operatorBrief}</p>
        </div>
        <div className="capsule-actions">
          <DownloadCapsule capsule={capsule} />
          <Link className="quiet-link" href="/war-room">
            Return to the war room
          </Link>
          <Link className="quiet-link" href="/">
            Quorum
          </Link>
        </div>
      </article>
    </main>
  );
}
