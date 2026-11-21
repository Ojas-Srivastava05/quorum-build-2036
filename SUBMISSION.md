# Quorum — BUILD 2036 form copy

Paste the two sections below into the form. Demo video and solution deck are still TBD.

## Prototype Brief

Quorum is a 2036 civic war room. When a city crisis hits, six agents — Scout, Risk, Sim, Equity, Ops, and a dedicated Adversary — debate it in the open. The Adversary attacks weak plans until the confidence ribbon actually moves. Three strategy forks simulate the next 72 hours on a living Indore ward map. An operator locks a fork. Quorum seals a Decision Capsule: ranked actions, trade-offs, minority dissent, and a plain-language citizen brief, stamped with a SHA-256 seal. The hero case is an Indore monsoon flood. Demo Mode plays it through. Cities do not need another dashboard. They need a quorum that can think under fire.

## Tech Stack

Next.js 16 App Router and TypeScript. Tailwind CSS 4 and Framer Motion. Syne and Instrument Sans via next/font. An SVG City Pulse Map of stylized Indore wards. Deliberation streams as Server-Sent Events from /api/deliberate. A TypeScript orchestrator runs six agents through intake, adversarial challenge, 72-hour fork simulation, human fork lock, synthesis, and capsule seal. A mock streaming provider plays the dramatic script behind an LLMProvider seam; this build ships with no model API keys. Decision Capsules are deterministic JSON with SHA-256 seals at /capsule/[id]. Typed scenarios: Indore monsoon flood, heatwave, and budget triage. Demo Mode auto-plays the flood through to the seal.

## Links

- GitHub: https://github.com/Ojas-Srivastava05/quorum-build-2036
- Deployed link: https://quorum-build-2036.vercel.app
- Demo video: TBD
- Solution deck: TBD
