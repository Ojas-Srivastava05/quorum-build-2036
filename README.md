# Quorum

Quorum is a civic war room for BUILD 2036. Six agents — Scout, Risk, Sim, Equity, Ops, and a dedicated Adversary — debate a city crisis in the open, simulate three forks of the next 72 hours, and seal a Decision Capsule.

There is no live model and no API key. Deliberation is a timed mock stream behind an `LLMProvider` seam.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/` cinematic landing
- `/war-room` council, city map, forks, and capsule ceremony
- `/capsule/[id]` sealed Decision Capsule

Production build:

```bash
npm run build
npm start
```

## Demo Mode

In the war room, click **Demo Mode**. It plays the Indore monsoon flood straight through: intake, specialist reports, adversary strikes, 72-hour forks, an automatic lock on Hybrid, and the capsule seal. The run is about a minute. Use **Open the floor** to run flood, heatwave, or budget triage and lock a fork yourself.

The confidence ribbon is meant to fall when the Adversary lands a hit and recover only when another seat answers. The seal hash is SHA-256 over the canonical capsule JSON.

## Scenarios

- Indore monsoon flood (18 July 2036)
- Heatwave (12 May 2036)
- Recovery budget triage (2 August 2036)
