import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      <div className="rain rain-a" aria-hidden="true" />
      <div className="rain rain-b" aria-hidden="true" />
      <div className="rain rain-c" aria-hidden="true" />
      <div className="pulse-grid" aria-hidden="true" />
      <div className="horizon" aria-hidden="true" />
      <svg className="skyline" viewBox="0 0 1440 280" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="#07141a"
          d="M0 280 V150 H70 V90 H110 V150 H160 V40 H210 V150 H250 V110 H310 V170 H360 V60 H410 V170 H470 V100 H530 V180 H600 V70 H660 V180 H720 V120 H790 V190 H860 V50 H920 V190 H990 V130 H1060 V200 H1120 V80 H1180 V200 H1260 V140 H1320 V200 H1440 V280 Z"
        />
      </svg>
      <div className="wet-street" aria-hidden="true" />
      <p className="landing-mark">Build 2036 · Frontier 01</p>
      <section className="landing-copy">
        <p className="wordmark">QUORUM</p>
        <h1>Cities don’t need another dashboard. They need a quorum that can think under fire.</h1>
        <Link className="war-cta" href="/war-room">
          Open the War Room
          <span aria-hidden="true">→</span>
        </Link>
      </section>
      <p className="landing-foot">Indore · 18 July 2036 · monsoon cell holding</p>
    </main>
  );
}
