import { analyze } from './analyze';
import type { Observation, ObservationInput } from './types';

/**
 * In-memory data store. Seeded at module-load with a spread of observations
 * along the U.S. east coast so the map and dashboard look alive in a fresh
 * Vercel deployment.
 *
 * NOTE: Serverless functions on Vercel are stateless between cold starts,
 * so new observations persist only for the life of a warm instance. Swap
 * this file for a Vercel KV / Postgres client to persist data.
 */

type Store = {
  observations: Map<string, Observation>;
};

const globalForStore = globalThis as unknown as { __tidetag?: Store };

function createStore(): Store {
  const store: Store = { observations: new Map() };
  for (const seed of SEED) {
    const { severity, anomalyScore, indicators } = analyze({
      category: seed.category,
      description: seed.description,
      measurements: seed.measurements,
    });
    const id = seed.id;
    store.observations.set(id, {
      ...seed,
      severity,
      anomalyScore,
      indicators,
    });
  }
  return store;
}

function getStore(): Store {
  if (!globalForStore.__tidetag) {
    globalForStore.__tidetag = createStore();
  }
  return globalForStore.__tidetag;
}

export function listObservations(filter?: {
  category?: string;
  severity?: string;
}): Observation[] {
  const store = getStore();
  let items = Array.from(store.observations.values());
  if (filter?.category) items = items.filter((o) => o.category === filter.category);
  if (filter?.severity) items = items.filter((o) => o.severity === filter.severity);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getObservation(id: string): Observation | undefined {
  return getStore().observations.get(id);
}

export function createObservation(input: ObservationInput): Observation {
  const store = getStore();
  const id = `obs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const result = analyze({
    category: input.category,
    description: input.description,
    measurements: input.measurements,
  });
  const observation: Observation = {
    id,
    createdAt: new Date().toISOString(),
    ...input,
    severity: result.severity,
    anomalyScore: result.anomalyScore,
    indicators: result.indicators,
  };
  store.observations.set(id, observation);
  return observation;
}

export function getStats() {
  const items = listObservations();
  const byCategory: Record<string, number> = {};
  const bySeverity: Record<string, number> = { info: 0, watch: 0, alert: 0 };
  const contributors = new Set<string>();
  for (const o of items) {
    byCategory[o.category] = (byCategory[o.category] ?? 0) + 1;
    bySeverity[o.severity] = (bySeverity[o.severity] ?? 0) + 1;
    contributors.add(o.observer);
  }

  const headline = {
    totalObservations: items.length,
    contributors: contributors.size,
    milesOfCoastline: 127,
    activeAlerts: bySeverity.alert,
  };

  return {
    headline,
    byCategory,
    bySeverity,
    recent: items.slice(0, 6),
  };
}

// ---- Seed data -------------------------------------------------------------

type Seed = Omit<Observation, 'severity' | 'anomalyScore' | 'indicators'>;

const SEED: Seed[] = [
  {
    id: 'seed_01',
    createdAt: '2026-04-12T14:22:00.000Z',
    observer: 'Maya R. (Beachwood HS)',
    lat: 40.7259,
    lng: -74.0019,
    locationName: 'Battery Park seawall, NYC',
    category: 'water-quality',
    description: 'Routine sampling. Clear water, light breeze, no visible debris.',
    measurements: { turbidityNTU: 3.1, pH: 7.9, waterTempC: 14.2, salinityPPT: 30.1, dissolvedO2: 8.4 },
  },
  {
    id: 'seed_02',
    createdAt: '2026-04-12T16:05:00.000Z',
    observer: 'Jordan P.',
    lat: 40.5795,
    lng: -73.8350,
    locationName: 'Jamaica Bay outfall channel',
    category: 'pollution',
    description: 'Visible oil sheen spreading from the outfall pipe after last night’s rain. Strong odor.',
    measurements: { turbidityNTU: 18.5, pH: 7.2, waterTempC: 15.8, dissolvedO2: 5.1 },
  },
  {
    id: 'seed_03',
    createdAt: '2026-04-11T18:40:00.000Z',
    observer: 'Coastal Stewards Chapter 4',
    lat: 41.3100,
    lng: -72.9290,
    locationName: 'New Haven Harbor mudflat',
    category: 'intertidal',
    description: 'Healthy ribbed mussel population, active fiddler crab burrows, no dead shellfish.',
    measurements: { waterTempC: 13.0, salinityPPT: 28.7 },
  },
  {
    id: 'seed_04',
    createdAt: '2026-04-11T11:12:00.000Z',
    observer: 'Ava L. (Montauk MS)',
    lat: 41.0362,
    lng: -71.9545,
    locationName: 'Ditch Plains tide pools',
    category: 'wildlife',
    description: 'Found three horseshoe crabs spawning near the low-tide line. Photographed and released.',
    measurements: { waterTempC: 12.5, salinityPPT: 31.2 },
  },
  {
    id: 'seed_05',
    createdAt: '2026-04-10T21:30:00.000Z',
    observer: 'Rafael C.',
    lat: 39.3643,
    lng: -74.4229,
    locationName: 'Atlantic City boardwalk north end',
    category: 'pollution',
    description: 'Large volume of plastic debris and styrofoam washed up overnight. No visible sheen.',
    measurements: { turbidityNTU: 12.0 },
  },
  {
    id: 'seed_06',
    createdAt: '2026-04-10T08:48:00.000Z',
    observer: 'Sam T.',
    lat: 38.9733,
    lng: -74.8180,
    locationName: 'Cape May Point State Park',
    category: 'sediment',
    description: 'Noticeable erosion at dune toe — about 1.2m of cut since last visit two weeks ago.',
  },
  {
    id: 'seed_07',
    createdAt: '2026-04-09T15:05:00.000Z',
    observer: 'Priya N.',
    lat: 36.8508,
    lng: -75.9779,
    locationName: 'Virginia Beach pier',
    category: 'water-quality',
    description: 'Slight greenish tinge, surf looked foamy.',
    measurements: { turbidityNTU: 14.2, pH: 8.1, waterTempC: 19.4, dissolvedO2: 6.3 },
  },
  {
    id: 'seed_08',
    createdAt: '2026-04-09T19:26:00.000Z',
    observer: 'Outer Banks Community Watch',
    lat: 35.2271,
    lng: -75.6310,
    locationName: 'Cape Hatteras groin #3',
    category: 'intertidal',
    description: 'Dead fish observed in wrack line — approximately a dozen, mixed species. Sampling now.',
    measurements: { turbidityNTU: 28.0, dissolvedO2: 3.6, waterTempC: 22.1 },
  },
  {
    id: 'seed_09',
    createdAt: '2026-04-08T13:10:00.000Z',
    observer: 'Brenna H.',
    lat: 32.7839,
    lng: -79.9350,
    locationName: 'Charleston Harbor marina',
    category: 'water-quality',
    description: 'Heavy algae bloom along the marina wall, strong earthy smell.',
    measurements: { turbidityNTU: 22.5, pH: 8.4, waterTempC: 24.0, dissolvedO2: 4.8 },
  },
  {
    id: 'seed_10',
    createdAt: '2026-04-07T17:02:00.000Z',
    observer: 'Keoni M.',
    lat: 30.3322,
    lng: -81.4556,
    locationName: 'Jacksonville Beach',
    category: 'wildlife',
    description: 'Dolphin pod feeding just past the surf line. Pelicans working the same bait ball.',
    measurements: { waterTempC: 23.8 },
  },
  {
    id: 'seed_11',
    createdAt: '2026-04-06T10:40:00.000Z',
    observer: 'Diana E.',
    lat: 25.7907,
    lng: -80.1300,
    locationName: 'Miami Beach groin 12th St',
    category: 'sediment',
    description: 'Fresh renourishment sand visible. Some pooling at the berm crest.',
  },
  {
    id: 'seed_12',
    createdAt: '2026-04-05T14:55:00.000Z',
    observer: 'Luis F.',
    lat: 26.1224,
    lng: -80.1373,
    locationName: 'Fort Lauderdale outfall',
    category: 'pollution',
    description: 'Possible sewage discharge — cloudy plume with strong chemical odor extending ~30m offshore.',
    measurements: { turbidityNTU: 35.0, pH: 6.9, dissolvedO2: 3.2 },
  },
];
