# MicroCycle Tracker - Architecture Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser User                         │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│           React Application (UI Layer)                  │
├──────────────────────────────────────────────────────────┤
│ App.tsx                                                  │
│ └─ Dashboard (features/habits/Dashboard.tsx)            │
│    ├─ HabitList (components/HabitList.tsx)             │
│    │  ├─ HabitRow                                       │
│    │  ├─ HabitDetail                                    │
│    │  └─ MonthlyHeatmap                                 │
│    ├─ AddHabitForm                                      │
│    ├─ CycleSelector                                     │
│    └─ GlobalActivityHeatmap                            │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│         State Management (Zustand Store)                │
│              store/index.ts                             │
├──────────────────────────────────────────────────────────┤
│ ├─ habits[]                                              │
│ ├─ entries[]                                             │
│ ├─ settings { cycleLength }                             │
│ ├─ selectedHabitId                                      │
│ │                                                        │
│ └─ Actions:                                              │
│    ├─ loadData()        → Load from DB                  │
│    ├─ addHabit()        → Create new habit              │
│    ├─ deleteHabit()     → Delete habit                  │
│    ├─ toggleEntry()     → Update completion             │
│    ├─ updateCycleLength() → Change cycle               │
│    └─ setSelectedHabit()                                │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│            Business Logic (Hooks & Utils)               │
├──────────────────────────────────────────────────────────┤
│ hooks/index.ts:                                          │
│ ├─ useCycleProgress()  → Calculate progress %          │
│ ├─ useHabitStats()     → Calculate statistics          │
│ ├─ useCycleDates()     → Get cycle day dates           │
│ └─ useHabitEntries()   → Get habit entries             │
│                                                          │
│ utils/calculations.ts:                                   │
│ ├─ getTodayString()                                     │
│ ├─ getCycleDates()                                      │
│ ├─ getMonthDates()                                      │
│ ├─ calculateCycleProgress()                             │
│ ├─ calculateStats()                                     │
│ └─ getHeatmapData()                                     │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│         Database Layer (Dexie.js + IndexedDB)           │
│              db/index.ts                                │
├──────────────────────────────────────────────────────────┤
│ MicroCycleDB (extends Dexie)                             │
│ ├─ habits table                                          │
│ │  └─ Storage: habit definitions & metadata             │
│ ├─ entries table                                         │
│ │  └─ Storage: daily completion data                    │
│ └─ settings table                                        │
│    └─ Storage: user preferences                         │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│          Browser Storage (IndexedDB & Cache)            │
├──────────────────────────────────────────────────────────┤
│ IndexedDB:                                               │
│ └─ MicroCycleTrackerDB                                  │
│    ├─ habits (indexed: id, createdAt)                  │
│    ├─ entries (indexed: id, habitId, date)             │
│    └─ settings                                          │
│                                                          │
│ Service Worker Cache:                                    │
│ └─ microcycle-v1                                        │
│    ├─ index.html                                        │
│    ├─ CSS & JS bundles                                  │
│    └─ Assets                                            │
└───────────────────────────────────────────────────────────┘
```

## Data Flow

### Adding a Habit (Write Flow)

```
User clicks "Add Habit"
    ↓
AddHabitForm component opens
    ↓
User enters name & type, clicks "Create"
    ↓
AddHabitForm calls useHabitStore.addHabit()
    ↓
Store creates habit object with nanoid()
    ↓
Store calls db.habits.add(habit)
    ↓
Dexie saves to IndexedDB
    ↓
Store loads fresh habits list from DB
    ↓
Zustand updates state (triggers React re-render)
    ↓
HabitList component re-renders with new habit ✓
```

### Tracking a Day (Update Flow)

```
User clicks checkbox for a day
    ↓
CycleCheckbox.onChange() fires
    ↓
HabitRow calls useHabitStore.toggleEntry()
    ↓
Store checks if entry exists
    ├─ If exists: update or delete based on value
    └─ If new: create entry with nanoid()
    ↓
Store calls db.entries.update() or db.entries.add()
    ↓
Dexie saves to IndexedDB
    ↓
Store loads fresh entries from DB
    ↓
Zustand updates state
    ↓
Hook useCycleProgress() recalculates
    ↓
ProgressBar and CycleCheckbox components re-render ✓
```

### Reading Data (Query Flow)

```
Component mounts or dependency changes
    ↓
useHabitStats(habitId) or useCycleProgress() hook
    ↓
Hook reads from Zustand store (in-memory)
    ↓
Hook calls calculation function from utils
    ↓
Calculation processes entries data
    ↓
Hook returns memoized result
    ↓
Component uses result to render ✓
```

## Component Hierarchy

```
Dashboard
├── Header (Title & description)
├── Controls
│   ├── CycleSelector (3/5/7 days)
│   └── AddHabitForm
├── HabitList
│   └── (for each habit)
│       ├── HabitRow
│       │   ├── Habit name
│       │   ├── CycleCheckbox[] (for each cycle day)
│       │   ├── ProgressBar
│       │   └── ChevronDown icon
│       └── HabitDetail (collapsed until clicked)
│           ├── Statistics cards
│           │   ├── Total sessions
│           │   ├── Completed
│           │   ├── Best streak
│           │   └── Completion rate
│           ├── Streak achievement message (if active)
│           └── MonthlyHeatmap
└── GlobalActivityHeatmap
    └── (for each habit)
        ├── Habit name
        └── MonthlyHeatmap
```

## State Management Strategy

### Zustand Store Structure

```typescript
const HabitStore = {
  // State
  habits: Habit[]           // All habits
  entries: Entry[]          // All entries (all dates)
  settings: Settings        // User preferences
  selectedHabitId: string   // For filtering detail view
  
  // Actions
  async loadData()          // Initial load from IndexedDB
  async addHabit()          // Create new habit
  async deleteHabit()       // Remove habit & entries
  async toggleEntry()       // Create/update/delete entry
  async updateCycleLength() // Change cycle setting
  setSelectedHabit()        // UI state (expanded/collapsed)
}
```

### Why Zustand?

- ✅ Simple and lightweight
- ✅ No providers needed (can use directly)
- ✅ Automatic subscriptions
- ✅ Works great with custom hooks
- ✅ Minimal boilerplate

## Hook Architecture

### Custom Hooks Pattern

```typescript
// Derived state from store + memoization
export function useCycleProgress(habitId: string): number {
  const { entries, settings } = useHabitStore()
  return useMemo(() => 
    calculateCycleProgress(entries, settings.cycleLength, habitId),
    [entries, habitId, settings.cycleLength]
  )
}
```

Benefits:
- Separation of concerns
- Reusable logic
- Proper dependency tracking
- Performance optimization with useMemo

## Database Schema

### Habits Table
```typescript
{
  id: string              // Primary key
  name: string
  type: "binary" | "numeric"
  createdAt: Date
}
```

**Indexes**: id (primary), createdAt (range)

### Entries Table
```typescript
{
  id: string              // Primary key
  habitId: string         // Foreign key
  date: string            // YYYY-MM-DD
  value: boolean | number
}
```

**Indexes**: id (primary), habitId (range), date (range)

### Settings Table
```typescript
{
  cycleLength: 3 | 5 | 7
}
```

## TypeScript Architecture

### Type Hierarchy

```
types/index.ts
├── Core Models
│   ├── Habit
│   ├── Entry
│   ├── Settings
│   └── DailyStats
└── Used throughout codebase
```

Benefits:
- Type safety across entire app
- IDE autocompletion
- Compile-time error checking
- Self-documenting code

## Styling Strategy

### TailwindCSS System

```typescript
// config
theme: {
  colors: {
    bg: {
      primary: '#0f1115',   // Main background
      surface: '#1a1d23',   // Cards & surfaces
    },
    border: {
      subtle: '#2a2f37',    // Subtle lines
    },
    accent: {
      blue: '#2563eb',      // Interactive elements
    }
  }
}
```

### Component Styling Pattern

```typescript
// Utility-first approach
<div className={clsx(
  'px-4 py-2 rounded', // Base padding & shape
  'bg-accent-blue',    // Color from config
  'hover:opacity-90',  // Interactive state
  'transition-all'     // Smooth animation
)}>
```

## Performance Optimizations

### Component Level
```typescript
// Memoization for expensive renders
const CycleCheckbox = React.memo(({ checked, onChange }) => {
  // Only re-renders if props change
})
```

### Hook Level
```typescript
// useMemo to prevent recalculation
const progress = useMemo(
  () => calculateProgress(entries, cycleLength, habitId),
  [entries, cycleLength, habitId]
)
```

### Store Level
```typescript
// Zustand automatically optimizes subscriptions
// Components only re-render on values they use
const progress = useHabitStore(s => s.progress)
```

## Error Handling

### Database Errors
```typescript
try {
  await db.habits.add(habit)
} catch (error) {
  console.error('Failed to add habit:', error)
  // UI shows graceful degradation
}
```

### Service Worker
```typescript
navigator.serviceWorker
  .register('/sw.js')
  .catch(error => {
    console.log('SW registration failed:', error)
    // App works without SW (loaded from cache)
  })
```

## Offline Support

### Network Status
- App works completely offline
- No network calls required
- All data stored locally

### Cache Strategy
```typescript
// Network first, fallback to cache
fetch(request)
  .then(response => {
    // Cache successful responses
    cache.put(request, response.clone())
    return response
  })
  .catch(() => caches.match(request))
```

## Build & Deployment

### Vite Configuration
```typescript
// Fast HMR for development
server: { port: 3000, open: true }

// Optimized production build
build: { outDir: 'dist', sourcemap: false }
```

### Production Build Size
- React + DOM: ~40KB
- Vite/utils: ~10KB
- TailwindCSS: ~30KB
- Other deps: ~20KB
- **Total: ~100KB gzipped**

## Security Considerations

### Data Privacy
- ✅ All data stored locally
- ✅ No server communication
- ✅ No external API calls
- ✅ User controls all data

### Code Security
- ✅ TypeScript type checking
- ✅ Input sanitization (TailwindCSS classes)
- ✅ No eval() or innerHTML usage
- ✅ CSP-compatible

## Testing Architecture (Future)

```
__tests__/
├── store.test.ts          // Zustand store logic
├── calculations.test.ts   // Utility functions
├── hooks.test.ts          # Custom hooks
└── components.test.tsx    # React components
```

## Scalability Considerations

### Current Limits
- ~1000 habits before UI slowdown
- ~100K entries before DB slowdown
- Average user won't hit these

### If Needed to Scale
1. Implement pagination for HabitList
2. Add virtual scrolling for heatmaps
3. Implement entry archiving
4. Add query indexing strategies

## Future Architecture Improvements

- [ ] Context API for complex state needs
- [ ] Redux if app grows significantly
- [ ] GraphQL client for potential backend
- [ ] Monorepo structure if splitting features
- [ ] Storybook for component documentation
- [ ] E2E testing with Cypress/Playwright

---

This architecture balances simplicity with scalability, making it easy to understand and modify while remaining performant for typical usage patterns.
