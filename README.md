# IHM Prototype — Rennes Live Music Discovery & Agenda

An interactive Human-Computer Interaction (IHM / HCI) prototype designed for exploring and managing live music events, concerts, and festivals in Rennes, France. Built with React 19, Vite, and Tailwind CSS v4.

---

## 📌 Project Overview

This prototype explores UX/UI patterns for local cultural event discovery, combining map-based spatial navigation with schedule-based temporal planning. Users can browse upcoming concerts across genres (Rock, Electro, Jazz, Pop, Reggae), view venues and event details, and submit community events.

### 🎯 Key Interactive Screens & Features

The interface includes a bottom navigation switcher allowing rapid exploration of the 5 prototype screens:

- **Écran 1 — Interactive Map View (`MapView`)**:
  - Vector-based styled map of central Rennes (Place Sainte-Anne, République, Thabor, Les Lices, La Vilaine, Gare).
  - Categorized map pins color-coded by musical genre and multi-event venue indicators.
  - Interactive event popup card with quick navigation to event details.
  - Day navigation selector.

- **Écran 2 — Weekly Calendar & Agenda View**:
  - Horizontal multi-day timeline with hourly schedule slots (10h00 to 02h00).
  - Event cards mapped directly to time slots with genre color themes.
  - Genre subscription toggles (Rock, Electro, Jazz, Pop, Reggae) to filter displayed events.

- **Écran 3 — Search & Discovery Carousel**:
  - Search input with tag filtering.
  - Horizontal event card carousel featuring event imagery, time, genre tag, and favorite toggle.

- **Écran 4 — Event Details View**:
  - Dedicated rich detail view for events (e.g., *Festival Bars 'n Breizh* at L'Étage).
  - Schedule breakdown, venue details, ticketing links, and external links.
  - Direct shortcut to locate the event on the map.

- **Écran 5 — Participatory Event Submission Modal (`EventFormModal`)**:
  - Form dialog for community event submission.
  - Event metadata inputs: Title, Primary Genre radio picker, secondary tags, date & time range.
  - Address input with Rennes venue helper.
  - Poster/artwork upload mockup drop zone and event description.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Server**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Code Formatting**: [oxfmt](https://oxc.rs/)

---

## 📂 Project Structure

```text
├── .figma/               # Figma Make configuration and tooling scripts
├── public/               # Static assets & icons
├── src/
│   ├── App.tsx           # Main application prototype with views & interactive state
│   ├── index.css         # Global stylesheet & Tailwind CSS v4 imports
│   ├── main.tsx          # React application entrypoint
│   └── vite-env.d.ts     # Vite TypeScript type declarations
├── index.html            # Vite HTML document template
├── package.json          # Project manifest and scripts
├── pnpm-lock.yaml        # Deterministic package dependency lockfile
├── tsconfig.json         # TypeScript compiler configuration
└── vite.config.ts        # Vite build configuration & plugins
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (or `npm` / `yarn`)

### Installation

1. Clone the repository and switch to the development branch:
   ```bash
   git clone https://github.com/anne7076/ihm-prototype.git
   cd ihm-prototype
   git checkout dev
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```
   Open the local server URL provided in the console to view the prototype.

### Build for Production

To create an optimized production build:
```bash
pnpm run build
```

To preview the production build locally:
```bash
pnpm run preview
```

---

## 🌿 Git Branching Strategy

This project adheres to standard industry Git flow:

- **`main`**: Production-ready, stable releases.
- **`dev`**: Active development branch where features and updates are integrated before release.

---

## 📄 License

Private / Academic project — INSA Rennes IHM Course.
