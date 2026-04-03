# 🚀 MicroCycle Tracker

> A lightweight, offline-first Progressive Web App for tracking habits with short productivity cycles (3, 5, or 7 days).

[![React](https://img.shields.io/badge/React-18-%2361DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-%23646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-%2306B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Enabled-%2341B883?logo=pwa)](https://web.dev/progressive-web-apps)

## 📋 Overview

**MicroCycle Tracker** reimagines habit tracking around short, achievable cycles rather than traditional 30-day commitments. This approach:

- ✅ **Reduces commitment barrier** - Smaller goals feel more attainable
- ✅ **Provides frequent wins** - Complete cycles multiple times per month
- ✅ **Builds momentum** - Regular success boosts motivation
- ✅ **Flexible tracking** - Binary (yes/no) or numeric (quantity) habits

Perfect for tracking:
- 💪 Workouts
- 🧘 Meditation
- 📚 Reading
- ✍️ Writing
- 💧 Hydration
- ...and any habit you want to master!

---

## ✨ Key Features

### 📊 **Short Cycle Options**
Choose from **3**, **5**, or **7-day cycles** - change anytime without losing history.

### 🪶 **Binary & Numeric Tracking**
- **Binary Habits**: Simple ✓/☐ completion tracking
- **Numeric Habits**: Track quantities (pages, minutes, glasses of water, etc.)

### 📈 **Visual Progress**
- Real-time progress bars with percentage
- Cycle grid showing daily completion status
- Smooth animations for instant feedback
- Color-coded status indicators

### 📅 **Detailed Statistics**
Click any habit to view:
- 📊 Total tracked sessions
- ✅ Completed sessions count
- 🔥 Best streak (longest consecutive completion)
- 📍 Current streak
- 📌 Overall completion rate percentage

### 🔥 **Activity Heatmaps**
- **Global Activity View** - See all habit activity patterns
- **Monthly Heatmap** - Track habit completion by date
- Identify trends and patterns in your behavior

### 📴 **100% Offline First**
- Works perfectly without internet
- All data stored locally in IndexedDB
- Service Worker enabled
- Progressive Web App (PWA) installable

### 🎨 **Beautiful Dark UI**
- Minimalist design inspired by Linear and Notion
- Optimized for focus and productivity
- Smooth transitions and animations
- Responsive design (desktop & mobile)

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 18.2 |
| **TypeScript** | Type Safety | 5.2 |
| **Vite** | Build Tool (5x faster than Webpack) | 5.0 |
| **TailwindCSS** | Utility-first Styling | 3.3 |
| **Zustand** | Global State Management | 4.4 |
| **Dexie.js** | IndexedDB Abstraction | 3.2 |
| **Framer Motion** | Animations | 10.16 |
| **Lucide Icons** | Beautifully Crafted Icons | 0.263 |
| **date-fns** | Date Utilities | 2.30 |
| **React Calendar Heatmap** | Heatmap Visualization | 1.8 |

---

## 📁 Project Structure

```
MicroCycleTracker/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── app/
│   │   └── App.tsx            # Root component
│   ├── components/            # 9 reusable components
│   │   ├── Dashboard.tsx
│   │   ├── HabitList.tsx
│   │   ├── HabitRow.tsx
│   │   ├── HabitDetail.tsx
│   │   ├── AddHabitForm.tsx
│   │   ├── CycleCheckbox.tsx
│   │   ├── CycleSelector.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── MonthlyHeatmap.tsx
│   │   └── GlobalActivityHeatmap.tsx
│   ├── features/
│   │   ├── habits/            # Habit tracking logic
│   │   ├── stats/             # Analytics (expandable)
│   │   └── settings/          # User settings (expandable)
│   ├── db/
│   │   └── index.ts           # Dexie.js database
│   ├── store/
│   │   ├── index.ts           # Zustand state & actions
│   │   └── utils.ts           # ID generation
│   ├── hooks/
│   │   └── index.ts           # Custom React hooks
│   ├── utils/
│   │   └── calculations.ts    # Business logic
│   ├── types/
│   │   └── index.ts           # TypeScript definitions
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
├── vite.config.ts             # Build configuration
├── tailwind.config.js         # Styling config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **npm** (or yarn)

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/yourusername/MicroCycleTracker.git
cd MicroCycleTracker

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

Your app will automatically reload on code changes!

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The optimized build is created in the `dist/` directory and ready to deploy.

### Linting

```bash
# Check code quality
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

---

## 💾 Data Models

### Habit
```typescript
interface Habit {
  id: string;
  name: string;
  type: "binary" | "numeric";  // Yes/No or Quantity
  createdAt: Date;
}
```

### Entry (Daily Completion)
```typescript
interface Entry {
  id: string;
  habitId: string;
  date: string;                // YYYY-MM-DD format
  value: boolean | number;     // Completed or quantity
}
```

### Settings
```typescript
interface Settings {
  cycleLength: 3 | 5 | 7;      // Customizable cycle duration
}
```

---

## 📚 Documentation

For more detailed information, see:

- **[FEATURES.md](./FEATURES.md)** - Complete feature documentation and usage guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, data flow, and component hierarchy
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Developer guide for extending the app
- **[FILES.md](./FILES.md)** - Complete file-by-file project structure

---

## 🏗️ Architecture Highlights

### State Management (Zustand)
- **Single source of truth** for all app state
- Minimal boilerplate, maximum clarity
- Automatic persistence to IndexedDB
- Real-time updates across components

### Database (Dexie.js + IndexedDB)
- **3 tables**: habits, entries, settings
- Full offline support
- Indexed for fast queries
- Automatic synchronization with store

### Component Structure
- **Dashboard** - Main container and coordinator
- **HabitList** - Renders all habits
- **HabitRow** - Individual habit display with controls
- **HabitDetail** - Expanded view with statistics
- **AddHabitForm** - Create new habits
- **CycleCheckbox** - Interactive day selector
- **ProgressBar** - Visual progress indicator
- **MonthlyHeatmap** - Calendar view of activity
- **GlobalActivityHeatmap** - All habits activity overview

---

## 🎯 Core Calculations

### Cycle Progress
```
Progress % = (Completed Days / Cycle Length) × 100
```

### Completion Rate
```
Completion Rate % = (Total Completed / Total Tracked) × 100
```

### Streak Calculation
Current streak counts consecutive days with completion.
Best streak tracks the longest streak ever achieved.

---

## 🌐 PWA Capabilities

- ✅ **Installable** - Add to home screen (iOS/Android/Desktop)
- ✅ **Offline First** - Works without internet connection
- ✅ **App-like Experience** - Runs in app window without browser chrome
- ✅ **Background Sync** - Queues updates when offline
- ✅ **Service Worker** - Caches assets for fast loading

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 15+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙋 Questions & Support

Have questions? Open an issue on GitHub or check the [documentation files](.).

**Happy habit tracking! 🎉**

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
