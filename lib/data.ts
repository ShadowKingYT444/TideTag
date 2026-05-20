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

const BASE_SEED: Seed[] = [
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

type CoastAnchor = {
  name: string;
  lat: number;
  lng: number;
  region: string;
};

const COASTAL_ROUTES: CoastAnchor[][] = [
  [
    { name: 'Cape Cod Bay, MA', lat: 41.9305, lng: -70.3093, region: 'Northeast' },
    { name: 'Boston Harbor, MA', lat: 42.3521, lng: -70.9853, region: 'Northeast' },
    { name: 'Narragansett Bay, RI', lat: 41.5801, lng: -71.3264, region: 'Northeast' },
    { name: 'Long Island Sound, CT', lat: 41.2542, lng: -72.7801, region: 'Northeast' },
    { name: 'Jamaica Bay, NY', lat: 40.6017, lng: -73.8204, region: 'Northeast' },
    { name: 'Sandy Hook, NJ', lat: 40.4668, lng: -74.0094, region: 'Northeast' },
    { name: 'Barnegat Bay, NJ', lat: 39.7647, lng: -74.1353, region: 'Mid-Atlantic' },
    { name: 'Delaware Bay, DE', lat: 39.1205, lng: -75.2559, region: 'Mid-Atlantic' },
    { name: 'Chesapeake Bay mouth, VA', lat: 36.9573, lng: -76.0217, region: 'Mid-Atlantic' },
    { name: 'Outer Banks, NC', lat: 35.5585, lng: -75.4665, region: 'Southeast' },
    { name: 'Cape Fear, NC', lat: 33.8922, lng: -77.9534, region: 'Southeast' },
    { name: 'Charleston Harbor, SC', lat: 32.7664, lng: -79.8813, region: 'Southeast' },
    { name: 'Savannah River mouth, GA', lat: 32.0343, lng: -80.8804, region: 'Southeast' },
    { name: 'Jacksonville Beaches, FL', lat: 30.2866, lng: -81.3915, region: 'Florida Atlantic' },
    { name: 'Cape Canaveral, FL', lat: 28.3922, lng: -80.6077, region: 'Florida Atlantic' },
    { name: 'Biscayne Bay, FL', lat: 25.6218, lng: -80.2264, region: 'Florida Atlantic' },
    { name: 'Florida Keys, FL', lat: 24.6699, lng: -81.4176, region: 'Florida Keys' },
  ],
  [
    { name: 'Florida Keys, FL', lat: 24.6699, lng: -81.4176, region: 'Florida Keys' },
    { name: 'Charlotte Harbor, FL', lat: 26.8588, lng: -82.1661, region: 'Gulf Coast' },
    { name: 'Tampa Bay, FL', lat: 27.6942, lng: -82.6034, region: 'Gulf Coast' },
    { name: 'Apalachicola Bay, FL', lat: 29.6784, lng: -84.9101, region: 'Gulf Coast' },
    { name: 'Mobile Bay, AL', lat: 30.3716, lng: -88.0819, region: 'Gulf Coast' },
    { name: 'Mississippi Sound, MS', lat: 30.2823, lng: -89.2481, region: 'Gulf Coast' },
    { name: 'Barataria Bay, LA', lat: 29.2942, lng: -90.0502, region: 'Louisiana Delta' },
    { name: 'Galveston Bay, TX', lat: 29.3476, lng: -94.7853, region: 'Texas Coast' },
    { name: 'Matagorda Bay, TX', lat: 28.5868, lng: -96.1532, region: 'Texas Coast' },
    { name: 'Corpus Christi Bay, TX', lat: 27.6996, lng: -97.2528, region: 'Texas Coast' },
    { name: 'Laguna Madre, TX', lat: 26.3973, lng: -97.3146, region: 'Texas Coast' },
  ],
  [
    { name: 'San Diego Bay, CA', lat: 32.6849, lng: -117.1697, region: 'Southern California' },
    { name: 'Los Angeles Harbor, CA', lat: 33.7288, lng: -118.262, region: 'Southern California' },
    { name: 'Santa Barbara Channel, CA', lat: 34.3864, lng: -119.7772, region: 'Central California' },
    { name: 'Monterey Bay, CA', lat: 36.8007, lng: -121.9016, region: 'Central California' },
    { name: 'San Francisco Bay, CA', lat: 37.806, lng: -122.4376, region: 'Northern California' },
    { name: 'Humboldt Bay, CA', lat: 40.766, lng: -124.2169, region: 'Northern California' },
    { name: 'Coos Bay, OR', lat: 43.3506, lng: -124.322, region: 'Oregon Coast' },
    { name: 'Yaquina Bay, OR', lat: 44.6217, lng: -124.0528, region: 'Oregon Coast' },
    { name: 'Columbia River mouth, WA', lat: 46.2448, lng: -124.0567, region: 'Pacific Northwest' },
    { name: 'Willapa Bay, WA', lat: 46.571, lng: -123.97, region: 'Pacific Northwest' },
    { name: 'Puget Sound, WA', lat: 47.6068, lng: -122.4359, region: 'Pacific Northwest' },
    { name: 'Strait of Juan de Fuca, WA', lat: 48.1451, lng: -123.4275, region: 'Pacific Northwest' },
  ],
];

const CATEGORIES_BY_WEIGHT: Array<[Seed['category'], number]> = [
  ['water-quality', 34],
  ['wildlife', 21],
  ['intertidal', 18],
  ['sediment', 15],
  ['pollution', 12],
];

const OBSERVERS = [
  'NOAA Shoreline Partner',
  'Coastal Stewardship Network',
  'Harbor Watch Volunteer',
  'Community Science Team',
  'University Field Lab',
  'TideTag Mobile Scout',
  'Estuary Monitoring Crew',
  'Local Waterkeeper',
  'Beach Conditions Team',
  'Marine Field Station',
];

function createExpandedSeed(count: number): Seed[] {
  const observations: Seed[] = [];
  const random = mulberry32(0x71de7a9);
  const routes = COASTAL_ROUTES.flatMap((route) =>
    route.slice(0, -1).map((start, index) => ({ start, end: route[index + 1] })),
  );

  for (let i = 0; i < count; i += 1) {
    const segment = routes[Math.floor(random() * routes.length)];
    const t = random();
    const category = weightedCategory(random);
    const region = random() < 0.5 ? segment.start.region : segment.end.region;
    const nearest = t < 0.5 ? segment.start : segment.end;
    const lat = lerp(segment.start.lat, segment.end.lat, t) + (random() - 0.5) * 0.22;
    const lng = lerp(segment.start.lng, segment.end.lng, t) + (random() - 0.5) * 0.28;
    const daysAgo = Math.floor(random() * 120);
    const hour = Math.floor(random() * 24);
    const minute = Math.floor(random() * 60);
    const createdAt = new Date(Date.UTC(2026, 4, 18 - daysAgo, hour, minute, 0)).toISOString();
    const measurements = makeMeasurements(category, lat, random);
    const description = makeDescription(category, measurements, random);

    observations.push({
      id: `source_${String(i + 1).padStart(5, '0')}`,
      createdAt,
      observer: `${OBSERVERS[Math.floor(random() * OBSERVERS.length)]} ${String(Math.floor(random() * 96) + 1).padStart(2, '0')}`,
      lat: round(lat, 5),
      lng: round(lng, 5),
      locationName: `${nearest.name} ${region} transect ${Math.floor(random() * 40) + 1}`,
      category,
      description,
      measurements,
    });
  }

  return observations;
}

function makeMeasurements(category: Seed['category'], lat: number, random: () => number) {
  const seasonalTemp = Math.max(8, Math.min(31, 31 - Math.abs(lat - 25) * 0.45));
  const turbidityBase = category === 'pollution' ? 12 : category === 'sediment' ? 9 : 4;
  const oxygenBase = category === 'pollution' ? 5.2 : 7.3;
  return {
    turbidityNTU: round(turbidityBase + random() * (category === 'pollution' ? 30 : 12), 1),
    pH: round(7.15 + random() * 1.25, 1),
    waterTempC: round(seasonalTemp + (random() - 0.5) * 4, 1),
    salinityPPT: round(22 + random() * 13, 1),
    dissolvedO2: round(Math.max(2.4, oxygenBase + (random() - 0.5) * 3.6), 1),
  };
}

function makeDescription(category: Seed['category'], measurements: NonNullable<Seed['measurements']>, random: () => number) {
  if (category === 'pollution') {
    const options = [
      'Reported plastic debris in the wrack line with patchy foam near the drain outlet.',
      'Visible sheen observed beside the marina slips after the morning tide turn.',
      'Cloudy discharge plume noted near an outfall; team marked the edge for follow-up sampling.',
      'Trash accumulation and strong odor recorded along the high-tide line.',
    ];
    return options[Math.floor(random() * options.length)];
  }
  if (category === 'sediment') {
    return measurements.turbidityNTU && measurements.turbidityNTU > 14
      ? 'Elevated turbidity and fresh dune scarping observed after recent surf.'
      : 'Routine sediment check with minor berm changes and stable beach profile.';
  }
  if (category === 'wildlife') {
    return random() > 0.18
      ? 'Wildlife activity documented near the intertidal edge; no distress observed.'
      : 'Small fish die-off reported in the wrack line; sample flagged for review.';
  }
  if (category === 'intertidal') {
    return 'Intertidal survey logged mussel beds, crab burrows, algae cover, and exposed substrate condition.';
  }
  return measurements.dissolvedO2 && measurements.dissolvedO2 < 5
    ? 'Water quality sample shows low dissolved oxygen with mild algae bloom conditions.'
    : 'Routine water quality sample collected with clear conditions and light surface chop.';
}

function weightedCategory(random: () => number): Seed['category'] {
  const total = CATEGORIES_BY_WEIGHT.reduce((sum, [, weight]) => sum + weight, 0);
  let pick = random() * total;
  for (const [category, weight] of CATEGORIES_BY_WEIGHT) {
    pick -= weight;
    if (pick <= 0) return category;
  }
  return 'water-quality';
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function round(value: number, places: number) {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED: Seed[] = [...BASE_SEED, ...createExpandedSeed(5200)];
