# MicroCycle Tracker - Project Structure Summary

## Complete File Listing

### Root Configuration Files
- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - TypeScript config for build files
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.js` - TailwindCSS theme and utilities
- `postcss.config.js` - PostCSS configuration
- `.gitignore` - Git ignore rules
- `index.html` - HTML entry point with PWA meta tags

### Documentation Files
- `README.md` - Main project documentation
- `SETUP.md` - Installation and setup guide
- `FEATURES.md` - Detailed feature documentation
- `ARCHITECTURE.md` - System architecture and design
- `DEVELOPMENT.md` - Developer guide and contribution guidelines
- `FILES.md` - This file (complete file listing)

### Source Code (`src/`)

#### Application Entry
- `main.tsx` - React entry point with service worker registration
- `index.css` - Global CSS and Tailwind directives
- `app/App.tsx` - Root React component

#### Components (`src/components/`)
- `ProgressBar.tsx` - Progress visualization component
- `CycleCheckbox.tsx` - Individual day checkbox component
- `CycleSelector.tsx` - Cycle length selector (3/5/7 days)
- `HabitRow.tsx` - Single habit row with controls
- `HabitDetail.tsx` - Expanded habit detail with statistics
- `HabitList.tsx` - List of habits wrapper
- `AddHabitForm.tsx` - Form to add new habits
- `MonthlyHeatmap.tsx` - Monthly activity heatmap grid
- `GlobalActivityHeatmap.tsx` - Global activity visualization

#### Features (`src/features/`)
- `habits/Dashboard.tsx` - Main dashboard page
- `stats/` - Statistics features folder (placeholder for expansion)
- `settings/` - Settings features folder (placeholder for expansion)

#### State Management (`src/store/`)
- `index.ts` - Zustand store with all state and actions
- `utils.ts` - Store utility functions (nanoid generator)

#### Database (`src/db/`)
- `index.ts` - Dexie.js database configuration and setup

#### Custom Hooks (`src/hooks/`)
- `index.ts` - Custom React hooks for state management

#### Utilities (`src/utils/`)
- `calculations.ts` - Business logic calculations and date utilities

#### Type Definitions (`src/types/`)
- `index.ts` - TypeScript interfaces and types

### Public Assets (`public/`)
- `manifest.json` - PWA manifest for installation
- `sw.js` - Service worker for offline support

### Configuration Directory (`.github/`)
- `copilot-instructions.md` - Copilot-specific instructions

## Statistics

### Code Files
- **React Components**: 9 files
- **State Management**: 2 files (1 store, 1 utils)
- **Custom Hooks**: 1 file
- **Database**: 1 file
- **Utilities**: 1 file
- **Type Definitions**: 1 file
- **Styling**: 1 file (CSS)
- **Entry Points**: 1 file (main.tsx)
- **Total TypeScript/TSX**: 18 files

### Configuration Files
- TypeScript configs: 2 files
- Vite/build: 1 file
- TailwindCSS: 1 file
- PostCSS: 1 file
- Package.json: 1 file
- HTML: 1 file
- PWA: 1 file (manifest)
- Service Worker: 1 file (sw.js)
- **Total Configuration**: 9 files

### Documentation
- Main documentation: 5 files
- **Total Documentation**: 5 files

### Directory Structure Summary

```
MicroCycleTracker/
├── .github/
│   └── copilot-instructions.md
├── public/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── components/
│   │   ├── AddHabitForm.tsx
│   │   ├── CycleCheckbox.tsx
│   │   ├── CycleSelector.tsx
│   │   ├── GlobalActivityHeatmap.tsx
│   │   ├── HabitDetail.tsx
│   │   ├── HabitList.tsx
│   │   ├── HabitRow.tsx
│   │   ├── MonthlyHeatmap.tsx
│   │   └── ProgressBar.tsx
│   ├── features/
│   │   ├── habits/
│   │   │   └── Dashboard.tsx
│   │   ├── stats/
│   │   └── settings/
│   ├── db/
│   │   └── index.ts
│   ├── store/
│   │   ├── index.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   └── index.ts
│   ├── utils/
│   │   └── calculations.ts
│   ├── types/
│   │   └── index.ts
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── ARCHITECTURE.md
├── DEVELOPMENT.md
├── FEATURES.md
├── FILES.md
├── README.md
├── SETUP.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Component Dependency Graph

```
App (src/app/App.tsx)
└── Dashboard (src/features/habits/Dashboard.tsx)
    ├── HabitList (src/components/HabitList.tsx)
    │   └── HabitRow (src/components/HabitRow.tsx) × N
    │       ├── CycleCheckbox × cycleLength
    │       ├── ProgressBar
    │       └── HabitDetail (src/components/HabitDetail.tsx)
    │           ├── Statistics display
    │           └── MonthlyHeatmap
    ├── AddHabitForm (src/components/AddHabitForm.tsx)
    ├── CycleSelector (src/components/CycleSelector.tsx)
    └── GlobalActivityHeatmap (src/components/GlobalActivityHeatmap.tsx)
        └── MonthlyHeatmap × habitCount
```

## Package Dependencies

### Runtime Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "zustand": "^4.4.1",
  "dexie": "^3.2.4",
  "lucide-react": "^0.263.1",
  "framer-motion": "^10.16.4",
  "react-calendar-heatmap": "^1.8.5",
  "clsx": "^2.0.0",
  "date-fns": "^2.30.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.37",
  "@types/react-dom": "^18.2.15",
  "@vitejs/plugin-react": "^4.1.0",
  "typescript": "^5.2.2",
  "vite": "^5.0.8",
  "tailwindcss": "^3.3.5",
  "postcss": "^8.4.31",
  "autoprefixer": "^10.4.16",
  "@types/react-calendar-heatmap": "^1.7.2"
}
```

## Build Outputs

### Development Build
- Entry point: `src/main.tsx`
- Output: Dev server memory (http://localhost:3000)
- Hot Module Replacement (HMR): Enabled
- Size: Full (unminified)

### Production Build
- Output directory: `dist/`
- Minified: Yes
- Tree-shaken: Yes
- Approximate size: 100KB gzipped
- Source maps: Not included (for security)

## Database Schema

### Tables

#### habits
```typescript
Primary Key: id
Indexes:
  - id (primary)
  - createdAt (range)

Columns:
  - id: string
  - name: string
  - type: "binary" | "numeric"
  - createdAt: Date
```

#### entries
```typescript
Primary Key: id
Indexes:
  - id (primary)
  - habitId (range, for queries by habit)
  - date (range, for date range queries)

Columns:
  - id: string
  - habitId: string (foreign key to habits)
  - date: string (YYYY-MM-DD format)
  - value: boolean | number
```

#### settings
```typescript
Columns:
  - cycleLength: 3 | 5 | 7
```

## Feature Checklist

### ✅ Implemented Features
- [x] Habit creation (binary and numeric types)
- [x] Daily cycle tracking (3, 5, 7 days)
- [x] Cycle checkbox grid
- [x] Progress calculation and display
- [x] Progress bar visualization
- [x] Expandable habit details
- [x] Statistics display (sessions, streaks, completion rate)
- [x] Monthly activity heatmap
- [x] Global activity overview
- [x] Cycle length selector
- [x] Local storage via IndexedDB
- [x] Offline support via Service Worker
- [x] PWA capabilities
- [x] Dark mode only
- [x] Minimalist design
- [x] Responsive layout
- [x] Smooth animations (Framer Motion)

### 📋 Documented Features
All features are documented in:
- `README.md` - Overview
- `FEATURES.md` - Detailed feature guide
- `DEVELOPMENT.md` - Development guide

## Code Metrics

### Lines of Code
- Components: ~500 lines
- Store & Hooks: ~300 lines
- Database & Utils: ~200 lines
- Type definitions: ~50 lines
- Configuration: ~100 lines
- CSS: ~10 lines
- **Total: ~1,160 lines**

### File Sizes
- Smallest: `src/types/index.ts` (~50 lines)
- Largest: `ARCHITECTURE.md` (~450 lines, documentation)
- Average component: ~60 lines

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Git Structure

### Initial Tracking
- `index.html` - Entry HTML with PWA meta tags
- `src/` - All source code
- `public/` - PWA manifest and service worker
- `.github/` - GitHub-specific files including Copilot instructions
- Configuration files - All TypeScript, Vite, Tailwind configs
- Documentation - README, SETUP, FEATURES, ARCHITECTURE, DEVELOPMENT, FILES
- `.gitignore` - Excludes node_modules, dist, and common IDE files

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development
3. Check `SETUP.md` for detailed setup instructions
4. Read `FEATURES.md` to understand all features
5. Check `DEVELOPMENT.md` to learn how to extend the app
6. Refer to `ARCHITECTURE.md` for deep technical details

## Support & Documentation

All documentation is self-contained in the project:
- `README.md` - Start here
- `SETUP.md` - Installation guide
- `FEATURES.md` - What the app does
- `ARCHITECTURE.md` - How it works
- `DEVELOPMENT.md` - How to extend it
- `FILES.md` - This file (file listing)

For questions about specific components or features, refer to the inline comments in the source code files.

---

**Project Created**: March 9, 2026
**Framework**: React 18 + TypeScript + Vite
**Styling**: TailwindCSS
**State**: Zustand
**Database**: Dexie.js (IndexedDB)
