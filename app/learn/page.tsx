import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import Link from 'next/link';

export const metadata = { title: 'Learn · TideTag' };

const videos = [
  {
    id: 'eJnQBXmZ7Ek',
    title: 'What Is Water Quality? — Crash Course Ecology',
    description:
      'An accessible introduction to water-quality parameters — turbidity, dissolved oxygen, pH, and salinity — and why they matter for ecosystems.',
    tag: 'Fundamentals',
  },
  {
    id: 'MEVaFshoGcI',
    title: 'Coastal Ecosystems and Intertidal Zones',
    description:
      'Explore how intertidal zones work, what species live there, and how human activity impacts them. Perfect background for field observations.',
    tag: 'Ecosystems',
  },
  {
    id: '7W2QIjj8Fco',
    title: 'Citizen Science: How You Can Help Protect the Ocean',
    description:
      'Learn how citizen-science programs like TideTag turn everyday observations into actionable conservation data.',
    tag: 'Citizen Science',
  },
  {
    id: 'HQTUWK7CM-Y',
    title: 'How to Use a Water Quality Testing Kit',
    description:
      'Step-by-step guide to using a field water-quality kit — measuring pH, turbidity, dissolved oxygen, and temperature in the field.',
    tag: 'Field Skills',
  },
];

const glossary: { term: string; definition: string; unit?: string }[] = [
  {
    term: 'Turbidity',
    definition:
      'A measure of water cloudiness caused by suspended particles. High turbidity can indicate runoff, algal blooms, or sediment disturbance.',
    unit: 'NTU (Nephelometric Turbidity Units)',
  },
  {
    term: 'pH',
    definition:
      'A scale from 0 to 14 measuring how acidic or basic water is. Healthy coastal water typically falls between 7.5 and 8.4. Extreme shifts harm marine life.',
    unit: 'pH units (0–14)',
  },
  {
    term: 'Dissolved Oxygen (DO)',
    definition:
      'The amount of oxygen gas dissolved in water. Aquatic organisms need at least 5 mg/L to thrive. Values below 4 mg/L are considered hypoxic.',
    unit: 'mg/L (milligrams per liter)',
  },
  {
    term: 'Salinity',
    definition:
      'The concentration of dissolved salts in water. Typical ocean salinity is 33–37 PPT. Freshwater inflow or evaporation shifts salinity and stress species.',
    unit: 'PPT (parts per thousand)',
  },
  {
    term: 'Water Temperature',
    definition:
      'Surface water temperature drives metabolic rates, dissolved oxygen levels, and species distribution. Temperatures above 28 °C can trigger thermal stress in many intertidal species.',
    unit: '°C (degrees Celsius)',
  },
  {
    term: 'Anomaly Score',
    definition:
      'A 0 – 1 score computed by TideTag\'s analysis engine. It combines measurement thresholds and keyword cues to flag observations that may indicate pollution, ecological stress, or unusual conditions.',
  },
  {
    term: 'Algal Bloom',
    definition:
      'A rapid increase in algae population, often triggered by nutrient runoff. Harmful algal blooms (HABs) can produce toxins that threaten wildlife and human health.',
  },
  {
    term: 'Intertidal Zone',
    definition:
      'The area of shore between the high-tide and low-tide marks. It hosts diverse organisms adapted to changing water levels, salinity, and wave exposure.',
  },
  {
    term: 'Sediment Transport',
    definition:
      'The movement of sand, silt, and organic material by waves, tides, and currents. Monitoring sediment patterns helps predict erosion and shoreline changes.',
  },
  {
    term: 'Marine Debris',
    definition:
      'Any persistent solid material manufactured or processed that enters the marine environment. Includes plastics, glass, metals, rubber, and textiles.',
  },
];

const fieldGuide = [
  {
    title: 'Before you go',
    items: [
      'Check the tide chart — low tide exposes more intertidal habitat.',
      'Charge your phone and enable GPS for accurate geotagging.',
      'Bring a water-quality test kit if you have one (pH strips, turbidity tube, thermometer).',
      'Wear closed-toe shoes and sun protection.',
    ],
  },
  {
    title: 'At the site',
    items: [
      'Note the general conditions: weather, wind, tide stage, water color.',
      'Look for indicators: foam, discoloration, sheen, odor, debris, dead organisms.',
      'Take measurements at knee-depth, facing the current, away from your shadow.',
      'Photograph anything unusual — include a reference object for scale.',
    ],
  },
  {
    title: 'Recording your observation',
    items: [
      'Tap "Use my location" on the submission form for GPS coordinates.',
      'Choose the category that best fits what you observed.',
      'Be specific in descriptions: mention colors, smells, sizes, and approximate quantities.',
      'Enter any measurements — even partial data is valuable.',
    ],
  },
  {
    title: 'After your visit',
    items: [
      'Review the severity and indicators assigned to your observation on the dashboard.',
      'Check the map to see if nearby observers are reporting similar conditions.',
      'If you received an "alert" severity, schedule a follow-up within 48 hours if safe.',
      'Share your observation with your class or community group.',
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="space-y-14">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Learn</h1>
        <p className="mt-1 max-w-2xl text-slate-600">
          Everything you need to understand coastal ecosystems, take accurate
          field measurements, and make the most of TideTag.
        </p>
      </header>

      {/* ── Video Library ────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Video guides</h2>
        <p className="mt-1 text-slate-600">
          Watch these short videos before your first field visit — or revisit
          them any time you need a refresher.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {videos.map((v) => (
            <article key={v.id} className="tide-card overflow-hidden">
              <YouTubeEmbed videoId={v.id} title={v.title} />
              <div className="p-4">
                <span className="pill bg-tide-100 text-tide-800 ring-1 ring-inset ring-tide-200">
                  {v.tag}
                </span>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{v.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Field Guide ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Field guide</h2>
        <p className="mt-1 text-slate-600">
          A quick checklist for planning a monitoring visit and submitting a
          high-quality observation.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {fieldGuide.map((section) => (
            <div key={section.title} className="tide-card p-5">
              <h3 className="text-base font-semibold text-slate-900">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tide-100 text-xs font-semibold text-tide-800">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Glossary ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">Glossary</h2>
        <p className="mt-1 text-slate-600">
          Key terms you&#39;ll encounter in TideTag observations and analyses.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {glossary.map((g) => (
            <div key={g.term} className="tide-card p-4">
              <dt className="text-base font-semibold text-slate-900">{g.term}</dt>
              {g.unit && (
                <span className="pill mt-1 bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">
                  {g.unit}
                </span>
              )}
              <dd className="mt-2 text-sm text-slate-600">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="tide-card flex flex-col items-start gap-4 bg-gradient-to-br from-tide-600 to-kelp-600 p-8 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Ready to try it?</h2>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            Use the inline Analyze tool to test sample data, then submit your
            first real observation from the field.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/analyze"
            className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
          >
            Try the analyzer
          </Link>
          <Link
            href="/observations/new"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-tide-700 shadow-sm hover:bg-tide-50"
          >
            Submit an observation
          </Link>
        </div>
      </section>
    </div>
  );
}
