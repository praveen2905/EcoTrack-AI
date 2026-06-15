# EcoTrack AI — Next.js (JavaScript)

A JavaScript-only Next.js recreation of the [EcoTrack AI](https://attached-assets--praveeng0929.replit.app/) carbon footprint tracker.

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **JavaScript only** — no TypeScript source files
- Lucide icons, Recharts, React Query, React Hook Form, Zod

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (hero, features, journey, testimonials, CTA, footer) |
| `/dashboard` | Carbon metrics, charts, category breakdown |
| `/assess` | Multi-step carbon assessment wizard |
| `/results` | Assessment results with pie chart |
| `/recommendations` | AI-powered sustainability insights |
| `/challenges` | Weekly eco challenges with gamification |
| `/leaderboard` | Community rankings |
| `/profile` | User profile, XP, badges |

## Getting started

```bash
cd ecotrack-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## API routes

Built-in mock API routes under `/api/*` power the dashboard, assessments, challenges, and leaderboard — no external database required for local development.
