# MicroCycle Tracker - Development Guide

## For Developers

This guide helps you understand how to extend and modify MicroCycle Tracker.

## Getting Started with Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Git
- VS Code (recommended)

### Initial Setup

```bash
# Navigate to project directory
cd MicroCycleTracker

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Project Structure Quick Reference

```
src/
├── app/App.tsx                 # Entry React component
├── components/                 # Reusable UI components
│   └── *.tsx                   # Each component is a file
├── features/habits/Dashboard.tsx # Main dashboard page
├── db/index.ts                 # Dexie database setup
├── store/index.ts              # Zustand state management
├── hooks/index.ts              # Custom React hooks
├── utils/calculations.ts       # Business logic
├── types/index.ts              # TypeScript definitions
├── main.tsx                    # React entry point
└── index.css                   # Global styles
```

## How to Add a New Feature

### Example: Adding a "Delete Habit" Feature

#### 1. Add Action to Store

In `src/store/index.ts`, the deleteHabit action already exists:

```typescript
deleteHabit: async (id: string) => {
  try {
    await db.habits.delete(id)
    await db.entries.where('habitId').equals(id).delete()
    // ... refresh lists
  }
}
```

#### 2. Create UI Component

Create `src/components/DeleteHabitButton.tsx`:

```typescript
import React from 'react'
import { Trash2 } from 'lucide-react'
import { useHabitStore } from '@/store'

interface DeleteHabitButtonProps {
  habitId: string
}

export const DeleteHabitButton: React.FC<DeleteHabitButtonProps> = ({ habitId }) => {
  const { deleteHabit } = useHabitStore()
  
  const handleDelete = async () => {
    if (window.confirm('Delete this habit and all its data?')) {
      await deleteHabit(habitId)
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded transition-colors"
      title="Delete habit"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}
```

#### 3. Add to UI

In `src/components/HabitRow.tsx`, add the button:

```typescript
<DeleteHabitButton habitId={habit.id} />
```

#### 4. Test

Visit http://localhost:3000/dev-tools in your browser, or use:
- DevTools → Application → IndexedDB to verify deletion

### Example: Adding a New Calculation Hook

#### 1. Create Utility Function

In `src/utils/calculations.ts`:

```typescript
export function calculateWeeklyAverage(entries: Entry[], habitId: string): number {
  // Calculate average completions per week
  const habitEntries = entries.filter(e => e.habitId === habitId)
  const weeks = new Set<string>()
  
  habitEntries.forEach(entry => {
    const date = new Date(entry.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    weeks.add(weekStart.toISOString().split('T')[0])
  })
  
  return Math.round(habitEntries.length / Math.max(weeks.size, 1))
}
```

#### 2. Create Custom Hook

In `src/hooks/index.ts`:

```typescript
export function useWeeklyAverage(habitId: string) {
  const { entries } = useHabitStore()
  
  return useMemo(() => {
    return calculateWeeklyAverage(entries, habitId)
  }, [entries, habitId])
}
```

#### 3. Use in Component

```typescript
const weeklyAvg = useWeeklyAverage(habit.id)

return (
  <div>
    <span>Weekly average: {weeklyAvg} days</span>
  </div>
)
```

## Modifying the Database Schema

### Adding a New Table

In `src/db/index.ts`:

```typescript
export class MicroCycleDB extends Dexie {
  habits!: Table<Habit>
  entries!: Table<Entry>
  settings!: Table<Settings>
  notes!: Table<Note>  // NEW

  constructor() {
    super('MicroCycleTrackerDB')
    this.version(1).stores({
      habits: '&id, createdAt',
      entries: '&id, habitId, date',
      settings: '&id',
      notes: '&id, habitId, date'  // NEW
    })
  }
}
```

Then add the type in `src/types/index.ts`:

```typescript
export interface Note {
  id: string
  habitId: string
  date: string
  content: string
}
```

### Handling Migrations

When changing the schema version:

```typescript
this.version(2).stores({
  // Updated schema
}).upgrade(tx => {
  // Migration logic
})
```

## Working with Zustand State

### Accessing State

In components:
```typescript
const habits = useHabitStore(state => state.habits)
```

In custom hooks:
```typescript
const { entries, settings } = useHabitStore()
```

### Adding New State

In `src/store/index.ts`:

```typescript
interface HabitStore {
  // ... existing state
  filterText: string
  
  // ... existing actions
  setFilterText: (text: string) => void
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  // ... existing state
  filterText: '',
  
  // ... existing actions
  setFilterText: (text: string) => set({ filterText: text })
}))
```

## Styling Components

### Using TailwindCSS

```typescript
<div className="px-4 py-2 bg-surface rounded border border-border-subtle">
  Content
</div>
```

### Theme Colors

```typescript
// Dark mode (only mode available currently)
--bg-primary: #0f1115
--bg-surface: #1a1d23
--border-subtle: #2a2f37
--accent-blue: #2563eb
```

### Adding Transitions

```typescript
<button className="transition-colors hover:bg-accent-blue">
  Hover me
</button>
```

### Responsive Design

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet (md): 2 columns, Desktop (lg): 3 columns */}
</div>
```

## Working with TypeScript

### Defining Types

```typescript
// src/types/index.ts
export interface MyNewType {
  id: string
  name: string
  value: number
  createdAt: Date
}
```

### Using Types Everywhere

```typescript
interface MyComponentProps {
  habit: Habit
  onSelect: (habitId: string) => void
}

const MyComponent: React.FC<MyComponentProps> = ({ habit, onSelect }) => {
  // ...
}
```

### Type Guards

```typescript
function isNumericHabit(habit: Habit): habit is Habit & { type: 'numeric' } {
  return habit.type === 'numeric'
}

if (isNumericHabit(habit)) {
  // habit.type is narrowed to 'numeric'
}
```

## Testing Strategy

### Manual Testing Checklist

- [ ] Add new habit
- [ ] Toggle checkboxes
- [ ] Change cycle length
- [ ] Expand habit details
- [ ] Verify statistics are correct
- [ ] Check heatmap displays correctly
- [ ] Close and reopen app - data persists
- [ ] Open DevTools, disable network, check offline works

### Browser DevTools Debugging

#### Inspect State
```javascript
// In console
useHabitStore.getState().habits
useHabitStore.getState().entries
```

#### Watch Store Changes
```javascript
useHabitStore.subscribe(
  state => state.habits,
  habits => console.log('Habits updated:', habits)
)
```

#### Clear All Data
```javascript
// In console
const db = useHabitStore.getState().db
await Promise.all([
  db.habits.clear(),
  db.entries.clear(),
  db.settings.clear()
])
```

## Performance Tips

### Optimize Re-renders

Use React.memo for expensive components:
```typescript
export const ExpensiveComponent = React.memo(({ prop }: Props) => {
  // Only re-renders when prop changes
})
```

Use useMemo for expensive calculations:
```typescript
const result = useMemo(() => expensiveCalculation(), [dependency])
```

Use useCallback for callbacks:
```typescript
const handleClick = useCallback(() => {
  // Does something
}, [dependency])
```

### Check Performance

In Chrome DevTools:
1. Performance tab → Record
2. Interact with app
3. Stop recording
4. Look for "long tasks" (>50ms)
5. Optimize if needed

## Debugging Tips

### Console Logging

```typescript
import { useHabitStore } from '@/store'

const { entries } = useHabitStore()
console.log('Current entries:', entries)
```

### React DevTools

Install React DevTools extension:
- Inspect component props
- Track render counts
- Inspect hooks

### IndexedDB Inspector

In Chrome DevTools:
1. Application tab
2. IndexedDB → MicroCycleTrackerDB
3. View/edit data directly

### Service Worker Debugging

In Chrome DevTools:
1. Application tab
2. Service Workers
3. Check status, unregister, update

## Common Tasks

### Add a New Component

1. Create file: `src/components/MyComponent.tsx`
2. Export from component
3. Import and use in parent

```typescript
// src/components/MyComponent.tsx
import React from 'react'

export const MyComponent: React.FC = () => {
  return <div>My Component</div>
}
```

### Add a New Page/Feature

1. Create folder: `src/features/myfeature/`
2. Create main component: `src/features/myfeature/MyFeaturePage.tsx`
3. Add route (currently single-page only, but structure is ready)

### Add a New Utility Function

1. Create/edit: `src/utils/functionName.ts`
2. Export function
3. Import and use

```typescript
// src/utils/myUtil.ts
export function myFunction(input: string): string {
  return input.toUpperCase()
}

// In component
import { myFunction } from '@/utils/myUtil'
```

### Work with Dates

Use `date-fns` library:

```typescript
import { formatISO, startOfDay, subDays } from 'date-fns'

const today = startOfDay(new Date())
const yesterday = subDays(today, 1)
const dateString = formatISO(today, { representation: 'date' })
```

## Code Organization Best Practices

### File Naming
- Components: `PascalCase.tsx`
- Utils/hooks: `camelCase.ts`
- Types: `index.ts` in folder

### Import/Export
```typescript
// Prefer named exports
export const MyComponent = () => {}

// Avoid default exports (easier refactoring)
import { MyComponent } from '@/components/MyComponent'
```

### Component Structure
```typescript
// 1. Imports
import React, { useEffect } from 'react'

// 2. Types/Interfaces
interface MyComponentProps {
  // ...
}

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = (props) => {
  // 4. Hooks
  const data = useCustomHook()
  
  // 5. Event handlers
  const handleClick = () => {}
  
  // 6. Render
  return <div onClick={handleClick}>{data}</div>
}
```

## Building for Production

```bash
npm run build
```

This creates optimized build in `dist/` folder:
- Minified JavaScript
- Optimized CSS
- Asset compression
- Source maps removed

### Deployment Checklist

- [ ] Run `npm run build`
- [ ] Verify `dist/` folder created
- [ ] Test production build locally: `npm run preview`
- [ ] Check IndexedDB data persists
- [ ] Check service worker works offline
- [ ] Upload to hosting service

## Troubleshooting Development

### Hot Module Replacement (HMR) Not Working
- Check Vite dev server is running
- Refresh page manually
- Restart dev server

### Module Not Found Errors
- Check file exists
- Verify import path (case-sensitive on Linux)
- Clear node_modules: `rm -rf node_modules && npm install`

### TypeScript Errors
- Run: `npm run build` to see all errors
- Check `tsconfig.json` settings
- Use `any` temporarily, then fix properly

### IndexedDB Errors
- Check DevTools → Application → IndexedDB
- Clear database if schema changed: `db.delete(); new DB().open()`
- Check quota: usually 50MB+ available

### Service Worker Issues
- Unregister old SW: DevTools → Application → Service Workers
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check browser console for errors

## Resources

### Documentation Links
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Dexie.js Docs](https://dexie.org)
- [date-fns Docs](https://date-fns.org)

### Tools
- [VS Code](https://code.visualstudio.com)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools Extension](https://react-devtools-tutorial.vercel.app/)

## Contributing Guidelines

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test thoroughly (manual testing checklist)
4. Create descriptive PR with screenshots
5. Code review before merge

## Future Development Ideas

- [ ] Habit notes on specific days
- [ ] Habit categories/tags
- [ ] Weekly/monthly summaries
- [ ] Notifications/reminders
- [ ] Data export (CSV, JSON)
- [ ] Habit templates
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Sync across devices (with backend)
- [ ] AI-powered insights

---

Happy coding! If you have questions, check the ARCHITECTURE.md and FEATURES.md files for more details.
