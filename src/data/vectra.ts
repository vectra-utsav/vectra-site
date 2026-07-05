/* ---------- Chapter 01 — Opening ---------- */

export const openingLines = [
  "Every city is having the same argument with itself.",
  "Millions of people.",
  "Millions of decisions.",
  "Every second."
];

/* ---------- Chapter 02 — The Problem ---------- */

export const problemLabel = "I — The Problem";

export const problemLead =
  "A city is not short of roads, or drivers, or cars.";

export const problemBody = [
  "It is short of agreement — about who goes where, in what order, at what price, for whom.",
  "Every trip is a negotiation between a thousand invisible variables: where you are, where they are, what the road is doing, what everyone else just decided a moment ago.",
  "None of it is dramatic. It happens quietly, constantly, in the background of ordinary life — which is exactly why nobody notices when it's handled badly.",
  "You just notice that you waited."
];

export const problemClose =
  "Cities don't have a transportation problem. They have a coordination problem.";

/* ---------- Chapter 03 — The Idea ---------- */

export const ideaLabel = "II — The Idea";

export const ideaLead = "So we stopped designing an app.";

export const ideaBody = [
  "An app is a window. It shows you a map and a button and hopes the right thing happens on the other side of the request.",
  "We're building the other side. The part that actually makes the decision — who moves whom, in what order, with what guarantee — and can explain itself afterward.",
  "Not a feature. A nervous system. Something that senses, decides, and remembers, thousands of times a second, for a city that never stops moving."
];

export const ideaClose = "Think of it less as an app, and more as an operating system for how a city moves.";

/* ---------- Chapter 04 — The Philosophy ---------- */

export const philosophyLabel = "III — The Philosophy";

export const philosophyLead = "None of this matters if it isn't trustworthy.";

export type PhilosophyPrinciple = {
  index: string;
  title: string;
  copy: string;
};

export const philosophyPrinciples: PhilosophyPrinciple[] = [
  {
    index: "01",
    title: "Reliability",
    copy: "A system that works most of the time is a system you can't plan a city around. Ours is built to keep its promises, especially on the day something fails."
  },
  {
    index: "02",
    title: "Correctness",
    copy: "A ride is not just a ride. It's a state machine, a ledger entry, a driver's income, a rider's evening. Every one of those has to agree with every other, always."
  },
  {
    index: "03",
    title: "Observability",
    copy: "If we can't see it happening, we don't get to say we built it well. The system watches itself as closely as it watches the road."
  },
  {
    index: "04",
    title: "Trust",
    copy: "Not the marketing kind. The kind that's earned one uneventful, unremarkable, on-time trip at a time."
  }
];

/* ---------- Chapter 05 — Engineering ---------- */

export const engineeringLabel = "IV — Engineering";

export const engineeringLead =
  "This is not a request and a response.";

export const engineeringIntro =
  "It's a living system — services that don't trust each other blindly, requests that leave a trail, failures that get noticed and survived, quietly, before anyone has to ask what happened.";

export type SystemNode = {
  id: string;
  name: string;
  role: string;
};

export const systemNodes: SystemNode[] = [
  { id: "gateway", name: "Gateway", role: "Every request enters here first." },
  { id: "auth", name: "Authentication", role: "Identity, verified once, trusted everywhere." },
  { id: "users", name: "Users", role: "Who is riding. Who is driving." },
  { id: "ride", name: "Ride", role: "The state machine of a single trip." },
  { id: "dispatch", name: "Dispatch", role: "Who moves whom, decided in milliseconds." },
  { id: "payment", name: "Payment", role: "The ledger. It never disagrees with itself." },
  { id: "notification", name: "Notification", role: "The moment something changes, someone knows." },
  { id: "observability", name: "Observability", role: "Every trace, metric, and log, correlated." }
];

export const engineeringFailureNote =
  "Watch what happens when one part of it fails.";

export const engineeringRecoveryNote =
  "It notices. It retries. It routes around the damage. Nobody has to page anyone.";

export const engineeringClose =
  "Distributed systems are usually hidden because they're ugly. We think ours is the most honest part of the whole company.";

/* ---------- Reveal ---------- */

export const revealName = "VECTRA";
export const revealTagline = "The next movement in urban mobility.";

/* ---------- Chapter 06 — Scale ---------- */

export const scaleLabel = "V — Scale";

export const scaleStatement = "We are designing for millions. Engineering for one.";

export const scaleBody = [
  "Not one user. One trip — the specific one happening right now, for a specific rider, on a specific street, that has no idea it's one of millions.",
  "Scale is not a milestone we're waiting to hit. It's a constraint we're building against today, in every service, in every schema, in every decision about where data lives and how far a request has to travel to get an answer.",
  "We're not interested in impressive numbers we can't stand behind. We're interested in a platform that behaves the same on trip one and trip one billion."
];

/* ---------- Chapter 07 — Roadmap ---------- */

export const roadmapLabel = "VI — Roadmap";

export const roadmapLead = "We don't say \"coming soon.\"";

export type RoadmapStage = {
  label: string;
  detail: string;
  state: "done" | "active" | "queued";
};

export const roadmapStages: RoadmapStage[] = [
  { label: "Building", detail: "Eight services, independently scoped, independently owned.", state: "done" },
  { label: "Testing", detail: "Failure injected on purpose, before the world does it for free.", state: "active" },
  { label: "Breaking", detail: "On our terms, in a room we control, long before launch day.", state: "active" },
  { label: "Learning", detail: "Every incident becomes an invariant the system now enforces.", state: "queued" },
  { label: "Improving", detail: "Nothing ships and stays still. It ships and keeps moving.", state: "queued" },
  { label: "Launching", detail: "When the system earns it. Not a day before.", state: "queued" }
];

/* ---------- Final ---------- */

export const finalLine = "A city is just a lot of people trying to be somewhere else. We intend to be very good at that.";

export const founderNote = "Designed and engineered by Utsav Kaushik.";
