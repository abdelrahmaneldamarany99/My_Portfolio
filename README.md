# Abdelrahman Eldamarany — Portfolio & Engineering Console

A production-grade personal portfolio and interactive engineering console for
Abdelrahman Eldamarany, a Senior React / Next.js / MERN full-stack developer based in
Cairo, Egypt.

The site is a single-page application backed by a small Express API. Alongside
the classic portfolio sections (hero, projects, experience, skills, education)
it ships an interactive "engineering console" that exposes the same data the
site runs on: sprint tickets, commit audit, architecture docs, a live test
runner, and an AI assistant (text chat + real-time voice).

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Three.js, Recharts
- **Backend:** Node.js, Express 4, `ws` WebSocket bridge
- **Data:** In-memory document collections (`server/db/mongo.ts`) seeded with
  portfolio content — no external database required to run
- **AI:** Google Gemini (`@google/genai`) for chat and live voice; graceful
  local fallbacks when `GEMINI_API_KEY` is not set

## Getting started

```bash
npm install
cp .env.example .env   # optional, only needed for AI features
npm run dev            # starts API + Vite dev server on :3000
```

Open http://localhost:3000.

### Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Dev server (Express + Vite middleware)   |
| `npm start`        | Same as `dev` (used in production mode)  |
| `npm run build`    | Production build into `dist/`            |
| `npm run preview`  | Preview the production build             |
| `npm test`         | Run the Vitest suite                     |
| `npm run lint`     | Type-check with `tsc --noEmit`           |

### Production

```bash
npm run build
NODE_ENV=production npm start
```

Express serves the static `dist/` bundle and the `/api/*` routes from the same
port.

## Environment variables

See `.env.example`. `GEMINI_API_KEY` enables the AI assistant and live voice;
without it the app still works using built-in fallback responses.

## Project structure

```
server.ts               Express app, static hosting, /api/live WebSocket
server/
  db/mongo.ts           In-memory collections + seeded portfolio data
  routes/api.ts         REST endpoints + Gemini chat fallback logic
src/
  App.tsx               View router, theme/language state, data loading
  components/           UI sections (hero, projects, console, modals...)
  services/api.ts       Typed fetch wrappers for the REST API
  data/                 Client-side fallbacks and UI translations
  types/index.ts        Shared domain types
public/assets/          CV PDF and profile photo
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the pieces fit together
- API endpoints are self-describing under `/api/*` (see `server/routes/api.ts`)

## License

Private project — all rights reserved.
