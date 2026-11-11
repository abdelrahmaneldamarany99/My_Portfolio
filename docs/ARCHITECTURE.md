# Architecture

## Overview

The app is a single Express process that serves both the API and the frontend:

- **Development:** Vite runs in middleware mode, so `/api/*` and the SPA share
  one origin and there is no CORS friction.
- **Production:** `vite build` emits `dist/`, which Express serves statically
  with an SPA fallback. `/api/*` routes are mounted before the static handler.

```
Browser ──► Express (:3000)
              ├── /api/*        → server/routes/api.ts (REST)
              ├── /api/live     → WebSocket upgrade → Gemini Live bridge
              └── /*            → Vite middleware (dev) or dist/ (prod)
```

## Layers

### Data layer — `server/db/mongo.ts`

Despite the name, this is not a real MongoDB driver. It is a small in-memory
`Collection<T>` class (Map-backed) that mimics the subset of the MongoDB
query API the app uses (`find`, `findOne`, `findById`, `insertOne`,
`insertMany`, `updateOne`, `deleteOne`, `countDocuments`).

`initialProfile`, `initialProjects`, `initialTickets`, `initialCommits`,
`initialDocs` and `initialContacts` are seeded at boot, so the portfolio has
realistic content without an external database. If a persistent store is ever
needed, this is the single seam to swap — every route goes through `db.*`.

### API layer — `server/routes/api.ts`

Thin REST handlers over the collections:

| Method | Path                  | Purpose                                  |
| ------ | --------------------- | ---------------------------------------- |
| GET    | `/api/profile`        | Static profile payload                   |
| GET    | `/api/projects`       | List projects (`?category`, `?search`)   |
| GET    | `/api/projects/:id`   | Single project by id or slug             |
| GET    | `/api/tickets`        | List sprint tickets                      |
| POST   | `/api/tickets`        | Create ticket (`ENG-###` key assigned)   |
| PATCH  | `/api/tickets/:id/status` | Transition ticket status             |
| GET    | `/api/commits`        | Commit audit feed                        |
| GET    | `/api/docs`           | Architecture documents                   |
| POST   | `/api/contact`        | Validate + store contact submissions     |
| POST   | `/api/tests/run`      | Run data-integrity checks, return results|
| GET    | `/api/health`         | Liveness probe                           |
| POST   | `/api/chat`           | Gemini chat with local fallback          |

Validation is kept at the edge (required fields, email regex, status enum)
which matches the small surface area of a portfolio backend.

### Realtime voice — `server.ts` + `LiveVoiceAgent.tsx`

`/api/live` upgrades to a WebSocket. When `GEMINI_API_KEY` is present the
server bridges the socket to the Gemini Live API (`gemini-live-2.5-flash-preview`),
translating between 16 kHz PCM16 mic audio and 24 kHz PCM16 playback audio.
Without a key it answers pings so the client can still render its UI states.

### Frontend — `src/`

- `App.tsx` is the view router. Navigation is hash-based (`#/projects`,
  `#/console`, …) so views are deep-linkable, and it owns the two persisted
  UI preferences: `language` (`en`/`ar`, drives `dir`/`lang` on `<html>`) and
  `theme` (`dark`/`light`).
- `services/api.ts` is the only module that talks HTTP; components never
  `fetch` directly. Every fetch has a graceful failure path — the app renders
  `data/fallback.ts` / empty states when the API is unreachable.
- `components/` is flat and section-based: each top-level view maps to one or
  two components (`Projects`, `Experience`, `Skills`, `Education`,
  `EngineeringRigor`). The console tabs live under `ConsoleSuite`, which
  composes `TicketsBoard`, `CommitsAudit`, `ArchitectureDocs` and `TestRunner`.
- `types/index.ts` is the shared contract between server and client — both
  sides import the same interfaces, which is what keeps the in-memory API
  honest.

## Design decisions

- **In-memory store over a real DB:** the content is static portfolio data, so
  an embedded collection keeps deployment to a single process with zero
  external dependencies. Mutations (ticket status, contact messages) persist
  for the lifetime of the process only.
- **Fallback-first AI:** every AI feature degrades gracefully. `/api/chat`
  falls back to `generateFallbackResponse`, the voice bridge to telemetry
  mode, so the site is fully usable with no API keys.
- **Hash routing:** avoids a router dependency for a five-view SPA while
  keeping URLs shareable.

## Testing

`npm test` runs Vitest against the data layer (`server/db/mongo.test.ts`) and
the chat fallback logic (`server/routes/api.test.ts`). The in-app
**Test Runner** console tab additionally exposes live data-integrity checks
through `POST /api/tests/run`.
