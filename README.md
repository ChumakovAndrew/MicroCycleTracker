# MicroCycle Tracker

A minimal Progressive Web App for habit tracking focused on short productivity cycles.

## Features

- **Short Cycles**: Track habits in 3, 5, or 7-day cycles instead of traditional 30-day habits
- **Offline First**: Fully functional offline with local-first architecture using IndexedDB
- **Minimal UI**: Clean, minimalist interface inspired by Linear and Notion
- **Dark Mode**: Beautiful dark theme optimized for focus
- **Real-time Progress**: Visual progress indicators and cycle checkboxes
- **Local Storage**: All data persisted locally using Dexie.js

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Dexie.js** - IndexedDB wrapper
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icons
- **date-fns** - Date utilities

## Project Structure

```
src/
├── app/                 # App component
├── components/          # Reusable UI components
├── features/           
│   ├── habits/         # Habit tracking features
│   ├── stats/          # Statistics and analytics
│   └── settings/       # User settings
├── db/                 # Dexie database setup
├── store/              # Zustand store
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open at http://localhost:3000

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` directory.

## Core Data Models

### Habit
```typescript
{
  id: string;
  name: string;
  type: "binary" | "numeric";
  createdAt: Date;
}
```

### Entry
```typescript
{
  id: string;
  habitId: string;
  date: string;  // YYYY-MM-DD format
  value: boolean | number;
}
```

### Settings
```typescript
{
  cycleLength: 3 | 5 | 7;
}
```

## Usage

### Adding a Habit
Click the "Add Habit" button and fill in the habit name. Choose between:
- **Binary**: Simple yes/no tracking
- **Numeric**: Track quantities

### Tracking Progress
Click the checkboxes in the cycle grid to mark days as completed. Progress percentage updates automatically.

### Changing Cycle Length
Use the cycle selector in the header (3d, 5d, or 7d) to switch between different cycle lengths.

### Viewing Details
Click on a habit row to expand and see detailed statistics.

## Color Palette

- **Background**: #0f1115
- **Surface**: #1a1d23
- **Border**: #2a2f37
- **Accent (Blue)**: #2563eb

## Features Implemented

- ✅ Habit creation
- ✅ Cycle checkbox grid
- ✅ Progress calculation
- ✅ Expandable habit details
- ✅ Cycle length selector
- ✅ Local storage persistence
- ⏳ Monthly activity heatmap (in progress)
- ⏳ Statistics display (in progress)

## Next Steps

1. Implement monthly activity heatmap using react-calendar-heatmap
2. Add habit statistics display (best streak, completion rate, etc.)
3. Add PWA manifest and service worker for offline support
4. Implement habit deletion and editing
5. Add data export/import

## License

MIT
