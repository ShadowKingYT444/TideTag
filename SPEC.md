# TideTag — Specification

## Overview
TideTag is an AI-powered coastal monitoring platform that empowers students and
community scientists to contribute geotagged observations of coastal
ecosystems. It aggregates submissions, runs lightweight computer-vision and
geospatial heuristics on them, and surfaces near-real-time signals about water
quality, sediment dynamics, intertidal health, and pollution events.

## Vision
Provide schools, conservation groups, and local stewards with a consistent,
actionable feed of coastal data — bridging the gap between citizen-science
observation and professional environmental monitoring.

## Target Users
- **Student contributors** — submit observations from school field trips
- **Community scientists** — track changes along their local coastline
- **Conservation organizations** — aggregate signals to prioritize response
- **Researchers** — access an open dataset of geotagged coastal observations

## Core Features

### 1. Observation Submission
- Submit a geotagged observation from any device (mobile-first form)
- Capture: latitude/longitude, location name, timestamp, observer name,
  category (water-quality, sediment, intertidal, pollution, wildlife),
  description, optional photo URL, and structured measurements
  (turbidity, pH, water temp, salinity)
- Auto-classifies severity (info / watch / alert) using rule-based heuristics

### 2. Live Map
- Interactive Leaflet map showing all observations as colored markers
- Marker color follows severity; popups show full observation detail
- Filter by category and severity

### 3. Dashboard
- Headline stats (total observations, contributors, miles of coastline,
  active alerts) modeled on the founding metrics:
  - 200+ contributors, 5,000+ observations, 120+ miles of coastline
- Recent observations feed
- Category breakdown bar chart
- Severity distribution

### 4. AI Analysis Endpoint
- `POST /api/analyze` — accepts an observation payload and returns a
  structured assessment: severity, anomaly score, recommended action,
  matched indicators. Uses deterministic heuristics that mirror the
  ~25% improvement claim from the bio (e.g. flagging high turbidity
  + low pH + visible sheen as a likely pollution event).

### 5. Programs
- Static page describing the 5+ school and community monitoring
  initiatives, with sign-up CTA.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Mapping:** Leaflet + react-leaflet (dynamically imported, client-only)
- **Data:** In-memory store seeded at module load (suitable for demo /
  Vercel preview). Designed so swap-in to Postgres / Vercel KV is a
  single-file change in `lib/data.ts`.
- **Deployment:** Vercel (zero-config, `vercel.json` included)

## API Surface
| Method | Path                  | Purpose                                    |
|--------|-----------------------|--------------------------------------------|
| GET    | /api/observations     | List all observations (supports filters)   |
| POST   | /api/observations     | Create a new observation                   |
| GET    | /api/observations/:id | Fetch a single observation                 |
| GET    | /api/stats            | Aggregate dashboard stats                  |
| POST   | /api/analyze          | Run anomaly heuristics on a payload        |

## Data Model
```ts
type Observation = {
  id: string;
  createdAt: string;        // ISO timestamp
  observer: string;
  lat: number;
  lng: number;
  locationName: string;
  category: 'water-quality' | 'sediment' | 'intertidal' | 'pollution' | 'wildlife';
  description: string;
  photoUrl?: string;
  measurements?: {
    turbidityNTU?: number;
    pH?: number;
    waterTempC?: number;
    salinityPPT?: number;
    dissolvedO2?: number;
  };
  severity: 'info' | 'watch' | 'alert';
  anomalyScore: number;     // 0-1
  indicators: string[];     // e.g. ['high-turbidity', 'low-pH']
};
```

## Severity Heuristics
- `alert` if any of: pH < 6.5 or > 8.6, turbidity > 25 NTU,
  category === 'pollution', dissolved O2 < 4 mg/L
- `watch` if any of: pH < 7.0 or > 8.3, turbidity > 10 NTU,
  water temp > 28C, description contains keyword (algae, sheen, debris)
- `info` otherwise

## Vercel Deployment
- Standard Next.js project — `vercel deploy` works out of the box
- No database required for the initial demo
- All routes are stateless except the in-memory store, which resets
  per cold start (acceptable for the demo; documented in README)

## Out of Scope (v1)
- Real authentication / user accounts
- File uploads (photos referenced by URL only)
- Persistent database (designed for easy upgrade)
- Real ML model inference (heuristics stand in)
