## Execution Guidelines

Work through the following checklist systematically:

- [ ] Review the project structure created in `/src`
- [ ] Install dependencies with `npm install`
- [ ] Start development server with `npm run dev` 
- [ ] Test the app in the browser
- [ ] Build for production with `npm run build`

## Project Overview

**MicroCycle Tracker** is a minimal habit tracker PWA with:

- React 18 + TypeScript + Vite
- TailwindCSS for styling
- Zustand for state management
- Dexie.js for IndexedDB storage
- Framer Motion for animations
- Offline-first architecture

## Key Components

- `Dashboard` - Main habit tracking interface
- `HabitList` - Displays habits with cycle checkboxes
- `HabitRow` - Individual habit with progress bar
- `CycleCheckbox` - Day selector in cycle grid
- `ProgressBar` - Progress visualization
- `CycleSelector` - Change cycle length (3/5/7 days)

## State Management

Uses Zustand store at `src/store/index.ts` to manage:
- Habits list
- Entries (daily completions)
- Settings (cycle length)
- Selected habit

Data persists to IndexedDB via Dexie.js.

## Building & Running

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

The app is fully functional offline and stores all data locally.
