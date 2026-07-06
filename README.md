# Shuttle ETA 🚌

**Real-time shuttle arrival predictions for UNILAG students — no GPS, no app download, no cost to the school.**

Built for the **PESSA Innovation Challenge 2026** at the University of Lagos.

---

## The problem

You're at Jaja Gate at 7:40 am. Is the shuttle 2 minutes away or 40? There's no sign. No GPS tracker. You either risk missing your lab or you leave and miss the bus entirely.

**Shuttle ETA solves this with students themselves as the tracking network.**

---

## How it works

1. **QR code at each stop** — scan it, the ETA page opens instantly in your browser. No download, no login required to view.
2. **Tap when you board** — one button: "I'm on Shuttle A". Tap again when you get off.
3. **System learns** — a rolling average across student taps builds a real travel-time model. Every ride sharpens the next prediction.

---

## Demo

| Role | Credentials | Lands on |
|------|-------------|----------|
| Student | Any `@unilag.edu.ng` email + any password | `/ride` — rider view |
| PESSA Admin | Same email + admin passcode **`PESSA2026`** | `/dashboard` — ops console |

The admin passcode gate prevents students from accessing the operations dashboard.

---

## Features

### Landing page (`/`)
- Water-ripple hero animation (canvas, 60fps, pauses off-screen)
- Scroll-reveal animations on all sections
- Problem → How It Works → Live Demo → Why It Works → Roadmap

### Rider view (`/ride`)
- Stop selector — tap which stop you're currently at
- Live ETA counter — updates every 4 seconds
- Full stop-by-stop arrival list with "You are here" indicator
- Board flow — tap "I'm on Shuttle A" → live trip timer → tap "I'm getting off" → trip recorded

### PESSA Admin dashboard (`/dashboard`)
- KPI cards — active shuttles, riders on board, ETA accuracy, trips today
- **Live map** — real OpenStreetMap tile layer at actual UNILAG coordinates, animated shuttle marker, real stop pins
- Heatmap — peak hours across the last 7 days
- Demand chart — riders per stop
- Trips table — every completed trip log
- Live check-in feed — real-time student tap stream
- Analytics page — 14-day trips + ETA accuracy trend
- Riders page — top contributing students
- Settings — poll interval, auto-checkout threshold, notification toggles

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TanStack Start (SSR, file-based routing) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Build tool | Vite 8 |
| Language | TypeScript |
| Map | Leaflet + OpenStreetMap |
| Charts | Recharts |
| Package manager | pnpm |

---

## Getting started

**Prerequisites:** Node.js 20+, pnpm

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server
pnpm dev
# → http://localhost:3000

# 3. Production build
pnpm build

# 4. Preview the production build
pnpm preview
```

---

## Project structure

```
src/
├── components/
│   ├── auth/          # AuthModal with student/admin gate
│   ├── dashboard/     # Widgets (KPI cards, map, charts, feed)
│   ├── landing/       # Hero, Nav, Sections, WaterRipple canvas
│   └── ui/            # shadcn/ui primitives
├── hooks/             # useAuthModal
├── lib/
│   ├── mock-auth.ts   # Demo auth (localStorage), ADMIN_CODE
│   └── mock-data.ts   # Seeded trip data, stops, heatmap
└── routes/
    ├── index.tsx      # Landing page
    ├── ride.tsx        # Student rider view
    └── dashboard/     # Admin ops console + sub-pages
```

---

## Deployment

The app is a TanStack Start SSR app with a Nitro server output. It can be deployed to any Node.js host:

```bash
pnpm build
node .output/server/index.mjs
```

Or deploy the `.output/` directory to **Railway**, **Render**, **Fly.io**, or **Vercel** (with the Nitro adapter).

---

## Why this works

- **No GPS hardware** — students are the sensor network
- **Web-only** — QR → browser, no App Store friction
- **Improves automatically** — every tap feeds the rolling average
- **Free to run** — static frontend + any free-tier backend
- **Portable** — the same model works at FUTA, OAU, ABU, UI

---

## Roadmap

| Timeline | Milestone |
|----------|-----------|
| MVP (48h) ✓ | Gate → Faculty → PESSA, live ETA, admin dashboard |
| Week 2 | All UNILAG routes and stops |
| Month 1 | Live map view in the rider app |
| Month 2 | PESSA admin peak-hour alerts, demand heatmap |
| Semester | Port to other Nigerian universities |

---

## Acknowledgements

Built at the **PESSA Innovation Challenge 2026**, University of Lagos.  
Map data © [OpenStreetMap](https://openstreetmap.org) contributors.
