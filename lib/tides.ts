/**
 * NOAA CO-OPS tide integration.
 *
 * Uses two public NOAA endpoints (no API key required):
 *   - Predictions (hi/lo):
 *       https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
 *         ?product=predictions&interval=hilo&...
 *   - Water levels (observed, 6-min):
 *       https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
 *         ?product=water_level&...
 *
 * A curated list of U.S. Atlantic + Gulf + Pacific tide stations lets us
 * find the nearest station to any lat/lng without an extra network hop.
 */

export type TideStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
};

// Curated major NOAA tide stations (U.S. coasts). IDs are NOAA CO-OPS station IDs.
// Source: https://tidesandcurrents.noaa.gov/
export const TIDE_STATIONS: TideStation[] = [
  // Atlantic — Northeast
  { id: '8418150', name: 'Portland, ME', lat: 43.656, lng: -70.246, state: 'ME' },
  { id: '8443970', name: 'Boston, MA', lat: 42.354, lng: -71.050, state: 'MA' },
  { id: '8447930', name: 'Woods Hole, MA', lat: 41.524, lng: -70.671, state: 'MA' },
  { id: '8452660', name: 'Newport, RI', lat: 41.505, lng: -71.326, state: 'RI' },
  { id: '8454000', name: 'Providence, RI', lat: 41.807, lng: -71.401, state: 'RI' },
  { id: '8461490', name: 'New London, CT', lat: 41.361, lng: -72.090, state: 'CT' },
  { id: '8465705', name: 'New Haven, CT', lat: 41.283, lng: -72.908, state: 'CT' },
  { id: '8510560', name: 'Montauk, NY', lat: 41.048, lng: -71.959, state: 'NY' },
  { id: '8516945', name: 'Kings Point, NY', lat: 40.811, lng: -73.765, state: 'NY' },
  { id: '8518750', name: 'The Battery, NY', lat: 40.700, lng: -74.014, state: 'NY' },
  { id: '8531680', name: 'Sandy Hook, NJ', lat: 40.467, lng: -74.009, state: 'NJ' },
  { id: '8534720', name: 'Atlantic City, NJ', lat: 39.355, lng: -74.418, state: 'NJ' },
  { id: '8536110', name: 'Cape May, NJ', lat: 38.968, lng: -74.960, state: 'NJ' },
  { id: '8545240', name: 'Philadelphia, PA', lat: 39.933, lng: -75.142, state: 'PA' },
  { id: '8557380', name: 'Lewes, DE', lat: 38.782, lng: -75.119, state: 'DE' },
  { id: '8570283', name: 'Ocean City Inlet, MD', lat: 38.328, lng: -75.091, state: 'MD' },
  { id: '8574680', name: 'Baltimore, MD', lat: 39.266, lng: -76.578, state: 'MD' },
  { id: '8594900', name: 'Washington, DC', lat: 38.873, lng: -77.022, state: 'DC' },
  // Atlantic — Mid/South
  { id: '8631044', name: 'Wachapreague, VA', lat: 37.608, lng: -75.686, state: 'VA' },
  { id: '8638610', name: 'Sewells Point, VA', lat: 36.947, lng: -76.330, state: 'VA' },
  { id: '8638863', name: 'CBBT, Chesapeake Bay, VA', lat: 36.967, lng: -76.113, state: 'VA' },
  { id: '8651370', name: 'Duck, NC', lat: 36.183, lng: -75.747, state: 'NC' },
  { id: '8654467', name: 'USCG Station Hatteras, NC', lat: 35.209, lng: -75.704, state: 'NC' },
  { id: '8658120', name: 'Wilmington, NC', lat: 34.227, lng: -77.954, state: 'NC' },
  { id: '8665530', name: 'Charleston, SC', lat: 32.781, lng: -79.925, state: 'SC' },
  { id: '8670870', name: 'Fort Pulaski, GA', lat: 32.034, lng: -80.902, state: 'GA' },
  { id: '8720030', name: 'Fernandina Beach, FL', lat: 30.672, lng: -81.466, state: 'FL' },
  { id: '8720218', name: 'Mayport (Jacksonville), FL', lat: 30.396, lng: -81.428, state: 'FL' },
  { id: '8721604', name: 'Trident Pier, Port Canaveral, FL', lat: 28.416, lng: -80.593, state: 'FL' },
  { id: '8722670', name: 'Lake Worth Pier, FL', lat: 26.613, lng: -80.034, state: 'FL' },
  { id: '8723214', name: 'Virginia Key, Biscayne Bay, FL', lat: 25.732, lng: -80.162, state: 'FL' },
  { id: '8724580', name: 'Key West, FL', lat: 24.555, lng: -81.808, state: 'FL' },
  // Gulf
  { id: '8726430', name: 'St. Petersburg, FL', lat: 27.760, lng: -82.627, state: 'FL' },
  { id: '8729108', name: 'Panama City, FL', lat: 30.152, lng: -85.667, state: 'FL' },
  { id: '8735180', name: 'Dauphin Island, AL', lat: 30.250, lng: -88.075, state: 'AL' },
  { id: '8760922', name: 'Pilots Station East, SW Pass, LA', lat: 28.932, lng: -89.407, state: 'LA' },
  { id: '8771450', name: 'Galveston Pier 21, TX', lat: 29.310, lng: -94.793, state: 'TX' },
  { id: '8779770', name: 'Port Isabel, TX', lat: 26.061, lng: -97.216, state: 'TX' },
  // Pacific
  { id: '9410170', name: 'San Diego, CA', lat: 32.714, lng: -117.174, state: 'CA' },
  { id: '9410660', name: 'Los Angeles, CA', lat: 33.720, lng: -118.272, state: 'CA' },
  { id: '9410840', name: 'Santa Monica, CA', lat: 34.008, lng: -118.500, state: 'CA' },
  { id: '9414290', name: 'San Francisco, CA', lat: 37.806, lng: -122.465, state: 'CA' },
  { id: '9418767', name: 'North Spit, CA', lat: 40.767, lng: -124.217, state: 'CA' },
  { id: '9432780', name: 'Charleston, OR', lat: 43.345, lng: -124.322, state: 'OR' },
  { id: '9435380', name: 'South Beach, OR', lat: 44.625, lng: -124.045, state: 'OR' },
  { id: '9447130', name: 'Seattle, WA', lat: 47.603, lng: -122.339, state: 'WA' },
];

export type TideExtreme = {
  time: string; // ISO
  height: number; // feet, MLLW
  type: 'H' | 'L';
};

export type TideSnapshot = {
  station: TideStation;
  distanceKm: number;
  current?: {
    time: string;
    heightFt: number;
  };
  extremes: TideExtreme[]; // next ~24 hours of high/low predictions
  phase: 'rising' | 'falling' | 'unknown';
  source: {
    predictionsUrl: string;
    waterLevelUrl: string;
    attribution: string;
  };
};

export function findNearestStation(lat: number, lng: number): {
  station: TideStation;
  distanceKm: number;
} {
  let best = TIDE_STATIONS[0];
  let bestDist = haversineKm(lat, lng, best.lat, best.lng);
  for (let i = 1; i < TIDE_STATIONS.length; i++) {
    const s = TIDE_STATIONS[i];
    const d = haversineKm(lat, lng, s.lat, s.lng);
    if (d < bestDist) {
      best = s;
      bestDist = d;
    }
  }
  return { station: best, distanceKm: bestDist };
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

function fmtNOAADate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function parseNOAATime(raw: string): string {
  // NOAA returns "YYYY-MM-DD HH:mm" in GMT. Convert to ISO Z.
  const iso = raw.replace(' ', 'T') + ':00Z';
  return iso;
}

export async function fetchTideSnapshot(
  lat: number,
  lng: number,
): Promise<TideSnapshot> {
  const { station, distanceKm } = findNearestStation(lat, lng);
  const now = new Date();
  const begin = fmtNOAADate(now);
  const endDate = new Date(now.getTime() + 36 * 3600 * 1000);
  const end = fmtNOAADate(endDate);

  const base = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
  const common = `application=TideTag&time_zone=gmt&units=english&format=json&datum=MLLW&station=${station.id}`;

  const predictionsUrl = `${base}?product=predictions&interval=hilo&begin_date=${begin}&end_date=${end}&${common}`;
  const waterLevelUrl = `${base}?product=water_level&date=latest&${common}`;

  const [predRes, levelRes] = await Promise.all([
    fetch(predictionsUrl, { next: { revalidate: 600 } }).catch(() => null),
    fetch(waterLevelUrl, { next: { revalidate: 300 } }).catch(() => null),
  ]);

  const extremes: TideExtreme[] = [];
  if (predRes?.ok) {
    const data = (await predRes.json()) as {
      predictions?: { t: string; v: string; type: 'H' | 'L' }[];
    };
    for (const p of data.predictions ?? []) {
      extremes.push({
        time: parseNOAATime(p.t),
        height: Number(p.v),
        type: p.type,
      });
    }
  }

  let current: TideSnapshot['current'];
  if (levelRes?.ok) {
    const data = (await levelRes.json()) as {
      data?: { t: string; v: string }[];
    };
    const latest = data.data?.[data.data.length - 1];
    if (latest) {
      current = {
        time: parseNOAATime(latest.t),
        heightFt: Number(latest.v),
      };
    }
  }

  // Determine phase: compare current height to the next extreme.
  let phase: TideSnapshot['phase'] = 'unknown';
  const nextExtreme = extremes.find(
    (e) => new Date(e.time).getTime() > now.getTime(),
  );
  if (nextExtreme) {
    phase = nextExtreme.type === 'H' ? 'rising' : 'falling';
  }

  return {
    station,
    distanceKm,
    current,
    extremes,
    phase,
    source: {
      predictionsUrl,
      waterLevelUrl,
      attribution: 'NOAA CO-OPS',
    },
  };
}
