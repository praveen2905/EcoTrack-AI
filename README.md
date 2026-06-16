# 🏆 EcoTrack AI — Premium Carbon Footprint Tracker

EcoTrack AI is a state-of-the-art Next.js web application designed to empower individuals and businesses with carbon footprint measurement, custom AI insights, gamified challenges, and community leaderboards.

---

## 🚀 Key Features

- **Multi-Step Carbon Assessment Wizard**: An accessible form wizard tracking commuter mileage, flights, cooling, utilities, diets, and package deliveries.
- **Dynamic Dashboard**: Full analytics suite containing weekly progress line charts, category breakdowns, and annual comparative bar charts.
- **AI Insights & Assistant**: Interactive, simulated AI sustainability chat advisor tailored to your exact carbon metrics.
- **Gamified Eco-Roadmap**: Unlocking levels, XP points, and high-quality badges for completing weekly eco-challenges.
- **Global Leaderboard**: Competitive community engagement displaying streak days and badges.

---

## 🛠 Tech Stack & Architecture

- **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [@tanstack/react-query (v5)](https://tanstack.com/query) for client-side API caching
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for single-source-of-truth validation
- **Visualization**: [Recharts](https://recharts.org/) (fully responsive and accessible SVG charts)
- **Unit & Integration Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [jsdom](https://github.com/jsdom/jsdom)

---

## 🛡 Security & Reliability Enhancements

1. **Strict Input Validation**: Shared Zod schemas (`lib/validations.js`) enforce value limits and check NaN/injection risks on both forms and REST endpoints.
2. **Safe API Error Handling**: Client-side fetch utility (`lib/api.js`) wraps native fetch with automatic request timeouts (10s), network/abort detection, and server error sanitization.
3. **Advanced Security Headers**: Next configuration implements Content-Security-Policy (CSP), strict Frame-Options (anti-clickjacking), XSS block Mode, and HSTS.
4. **Rate Limiting Middleware**: Edge-based API rate limiting (`middleware.js`) restricts client requests to 100 requests per minute to prevent Denial-of-Service spamming.
5. **Robust Error Boundaries**: Custom React boundary wraps the view tree to capture runtime rendering errors gracefully with a user-friendly retry button.

---

## ♿ Accessibility (a11y) Features

- **Skip Navigation Link**: Hidden keyboard focusable link allows skipping navigation directly to `#main-content`.
- **Landmarks & Semantics**: Proper HTML5 tags (`<main>`, `<header>`, `<footer>`, `<section>`) with strict heading hierarchies.
- **Accessible Graphs**: Interactive SVG charts are labeled with detailed `aria-label` tags and text-equivalent summaries.
- **Form Association**: Custom inputs are linked with descriptive labels, validation errors, and hints using Radix UI/React Hook Form primitives.
- **Motion Reduction**: Media query styles automatically disable/reduce transitions for visitors with `prefers-reduced-motion`.

---

## 🧪 Testing Guide

We utilize **Vitest** for fast, local unit and integration testing.

Run all tests:
```bash
npm run test
```

Watch mode:
```bash
npm run test:watch
```

Tests cover:
- Carbon calculations (`__tests__/emission-calculator.test.js`)
- Global store HMR-safe state transitions (`__tests__/store.test.js`)
- Custom UI utilities (`__tests__/utils.test.js`)
- REST handler requests, validations, and responses (`__tests__/api-routes.test.js`)

---

## 💻 Getting Started

### Development Mode

```bash
cd ecotrack-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```
