# Calendera

A class-level academic coordination calendar. Students can add and update academic events while clearly showing how trustworthy each update is.

## Run locally

Prerequisite: Node.js 20 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

The React app runs on port 5173 and the API runs on port 4000. Event data is written to `apps/api/data/events.json` automatically the first time the API starts.

## Project structure

```
Calendera/
├── apps/
│   ├── web/          # React + Vite calendar UI
│   └── api/          # Express REST API and local data store
├── docs/             # Product and API decisions
└── package.json      # Workspace scripts
```

## Current prototype identity

The UI currently uses a development identity (`Aman Reddy · CS-A · 23CSE101`). Replace this with real authentication in the next backend phase. The API already records the creator/updater supplied by the client so the event-history model is in place.

## API

- `GET /api/events` — all events for the class
- `POST /api/events` — create an event
- `PATCH /api/events/:id` — update an event, including date/status history
- `DELETE /api/events/:id` — remove an event
- `GET /api/health` — API health check
