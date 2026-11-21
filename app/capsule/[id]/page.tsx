import { DownloadCapsule } from "@/components/DownloadCapsule";
import { SealMedallion } from "@/components/SealMedallion";
import { allCapsuleIds, getCapsule } from "@/lib/capsule/store";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

export default function CapsulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<CapsuleFallback />}>
      <CapsuleDocument params={params} />
    </Suspense>
  );
}

function CapsuleFallback() {
  return (
    <main className="capsule-page">
      <article className="capsule-wrap">
        <p className="quiet">Opening the seal.</p>
      </article>
    </main>
  );
}

async function CapsuleDocument({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const capsule = getCapsule(id);
  if (!capsule) notFound();

  return (
    <main className="capsule-page">
      <div className="capsule-sky" aria-hidden="true">
        <div className="rain rain-a" />
        <div className="grain" />
      </div>
      <article className="capsule-wrap">
        <header className="capsule-mast">
          <Link href="/" className="capsule-brand">
            QUORUM
          </Link>
          <SealMedallion
            hash={capsule.seal.hash}
            sealedAt={capsule.seal.sealedAt}
            algorithm={capsule.seal.algorithm}
          />
          <h1>Sealed</h1>
          <p className="lead">
            {capsule.city} · {capsule.scenarioTitle}
          </p>
          <p className="clock">{capsule.clock}</p>
          <p className="meta">
            Fork {capsule.fork} · {capsule.forkName} · confidence {capsule.confidence.toFixed(2)}
          </p>
        </header>

        <h2>Citizen brief</h2>
        <div className="brief-block">
          <p>{capsule.citizenBrief}</p>
        </div>
        <h2>Ranked actions</h2>
        <ol className="actions">
          {capsule.rankedActions.map((action) => (
            <li key={action.rank}>
              <span>{String(action.rank).padStart(2, "0")}</span>
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
