# TideTag

**AI-powered coastal monitoring platform.** TideTag turns geotagged student and
community observations into near-real-time signals for water quality, sediment
dynamics, intertidal ecosystem health, and pollution events.

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS, with Leaflet maps
and a deterministic anomaly-scoring heuristic that stands in for the project's
CV + geospatial model pipeline. Ready to deploy to Vercel with zero config.

## Features

- 🌊 Submit geotagged observations with structured measurements (pH, turbidity, DO, temp, salinity)
- 🗺️ Live Leaflet map of observations, colored by severity
- 📊 Dashboard with contributor, observation, and alert counts
- 🤖 `POST /api/analyze` — heuristic anomaly scoring + severity
- 🌀 `GET /api/tides` — live tide predictions from the nearest NOAA CO-OPS station
- 🏫 Programs page covering the 5 school- and community-based initiatives
- 📱 Mobile-first submission form with "Use my location"

See [SPEC.md](./SPEC.md) for the full product spec and data model.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel — no environment variables required.
3. Vercel auto-detects Next.js and builds with `next build`.

`vercel.json` pins the framework and commands explicitly for reproducibility.

## API

| Method | Path                      | Description                           |
|--------|---------------------------|---------------------------------------|
| GET    | `/api/observations`       | List observations (category/severity) |
| POST   | `/api/observations`       | Create an observation                 |
| GET    | `/api/observations/:id`   | Fetch a single observation            |
| GET    | `/api/stats`              | Dashboard aggregates                  |
| POST   | `/api/analyze`            | Run anomaly heuristics                |
| GET    | `/api/tides?lat=&lng=`    | Nearest NOAA station + tide forecast  |

Example:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H 'content-type: application/json' \
  -d '{
    "category": "pollution",
    "description": "Oil sheen near the outfall pipe after heavy rain",
    "measurements": { "turbidityNTU": 30, "pH": 6.8, "dissolvedO2": 3.8 }
  }'
```

## Storage

The initial implementation uses an in-memory store seeded with 12 observations
along the U.S. east coast (see `lib/data.ts`). New submissions persist for the
life of a warm serverless instance. To persist across cold starts, swap the
store in `lib/data.ts` for Vercel KV, Postgres, or any other backend — the API
routes don't need to change.
