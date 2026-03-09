# MicroCycle Tracker - Features Guide

## Core Concept

MicroCycle Tracker reimagines habit tracking around short, focused cycles rather than traditional 30-day approaches. This makes achieving goals more attainable and provides frequent psychological wins.

## Key Features

### 1. Short Cycle Tracking (3, 5, or 7 days)

Instead of month-long commitments, habits are tracked in short bursts:

**3-Day Cycle**: Quick wins, perfect for starting new habits
- Lower commitment barrier
- Frequent completion opportunities
- Great for building momentum

**5-Day Cycle**: Work week focus
- Aligns with typical work schedules
- Weekends separate from tracking
- Professional productivity focus

**7-Day Cycle**: Full week view
- Traditional week-long goals
- Complete perspective of your week
- Easier streak tracking

### 2. Habit Types

#### Binary Habits
Simple yes/no tracking:
- ✓ Workout
- ✓ Meditate
- ✓ Read
- ✓ Write

Perfect for: Consistency-based habits

#### Numeric Habits
Quantity-based tracking:
- 📊 Pages read
- 📊 Minutes exercised
- 📊 Glasses of water
- 📊 Tasks completed

Perfect for: Goal-based tracking with measurable quantities

### 3. Daily Progress Tracking

**Cycle Grid**
```
Habit Name | Day1 | Day2 | Day3 | Progress
---------|------|------|------|----------
Workout    ✓      ☐      ☐      33%
Meditation ✓      ✓      ✓      100%
Reading    ☐      ☐      ☐      0%
```

- Click checkboxes to toggle completion
- Progress updates in real-time
- Instant visual feedback
- Current cycle only (no confusion with past cycles)

### 4. Progress Visualization

**Progress Bar**
- Color-coded blue indicator
- Percentage display
- Smooth animations
- Visual at-a-glance status

**Percentage Calculation**
```
Progress = (Completed Days / Total Cycle Days) × 100
```

### 5. Detailed Statistics

Click any habit to see:

#### Total Sessions
Number of times you've tracked this habit

#### Completed Sessions
Count of successfully completed sessions

#### Best Streak
Your longest consecutive completion streak ever

#### Current Streak
Days in a row you're currently completing the habit

#### Completion Rate
Overall percentage of tracked days completed:
```
Completion Rate = (Completed / Total Tracked) × 100
```

### 6. Activity Heatmap

Visual calendar showing:
- **Blue squares**: Days with activity
- **Gray squares**: Days without activity
- **Ring on today**: Current date indicator
- **Hover tooltips**: Date information

Benefits:
- See patterns at a glance
- Identify your strongest/weakest days
- Motivate with visual progress
- Track long-term trends

### 7. Monthly Overview

Global activity heatmap displaying:
- All habits' monthly activity side-by-side
- Quick comparison between habits
- Pattern recognition
- Achievement visualization

### 8. Offline-First Architecture

The app works completely offline:

**Data Storage**
- IndexedDB local database
- No cloud dependency
- Data private and secure
- Automatic persistence

**Service Worker**
- Caches all assets
- Works without internet
- Syncs when online (when implemented)
- Seamless offline experience

### 9. Progressive Web App

Install as a native app:

**Desktop**
- Start as a web app
- Click install prompt
- Runs in its own window
- Offline capable

**Mobile**
- "Add to Home Screen" support
- Standalone mode
- Full screen experience
- App-like feel

## Data Model

### Habits
```typescript
{
  id: string              // Unique identifier
  name: string            // Habit name
  type: "binary"|"numeric"// Tracking type
  createdAt: Date         // Creation date
}
```

### Entries
```typescript
{
  id: string              // Unique identifier
  habitId: string         // Reference to habit
  date: "YYYY-MM-DD"     // Date (ISO format)
  value: boolean|number   // Completion status or count
}
```

### Settings
```typescript
{
  cycleLength: 3|5|7     // Current cycle length
}
```

## Workflow Example

### Day 1
1. Open app
2. Add habit "Workout"
3. Click checkbox for today
4. Progress shows 33% (1 of 3 days)

### Day 2
1. Click checkbox for day 2
2. Progress shows 66% (2 of 3 days)

### Day 3
1. Click checkbox for day 3
2. Progress shows 100% (3 of 3 days)
3. Cycle complete! 🎉

### Next Cycle
1. Cycle shifts to next 3 days
2. Progress resets to 0% (until needed)
3. Previous cycle data preserved in history
4. Heatmap shows your achievement

## Use Cases

### Personal Productivity
- Daily exercise routines
- Reading goals
- Writing/journaling
- Meditation practice

### Professional Development
- Coding/learning
- Project work
- Team collaboration
- Skill building

### Health & Wellness
- Fitness tracking
- Sleep monitoring
- Nutrition logging
- Hydration reminder

### Creative Goals
- Writing sessions
- Music practice
- Art daily
- Photography challenges

## Tips for Success

### Setting Realistic Goals
- Start with 3-day cycles
- Choose habits you can do daily
- Mix easy and challenging habits
- Track 3-5 habits maximum

### Building Momentum
- Start small and build up
- Celebrate completed cycles
- Review your heatmap weekly
- Notice patterns and adjust

### Maintaining Consistency
- Check your habits daily
- Set a reminder if needed
- Review weekly progress
- Adjust habits if needed

## Keyboard Shortcuts (Future)

- `N` - New habit
- `C` - Change cycle length
- `R` - Reset current cycle
- `?` - Help

*Currently manual clicking required*

## Statistics Explained

### Streak
A streak is consecutive days in a row where you completed the habit:

```
Completed: ✓ ✓ ✓ ✗ ✓ ✓
Streak:    1 2 3 0 1 2
               ↑ Reset by ✗
```

Best streak: 3 days
Current streak: 2 days

### Completion Rate
Overall success metric across all tracked days:

```
Tracked 30 days total
Completed 24 days
Completion rate: 24/30 = 80%
```

### Categories of Habits

**High Priority Habits**: 80%+ completion rate
**Medium Priority Habits**: 50-80% completion rate
**Low Priority Habits**: <50% completion rate

Use this to adjust your habits or effort level.

## Visual Indicators

| Symbol | Meaning |
|--------|---------|
| ✓ | Completed day |
| ☐ | Pending/incomplete day |
| 🔥 | Active streak |
| 📊 | Numeric tracking |
| 🎯 | Goal achieved |
| 💯 | 100% completion |

## Advanced Features (Planned)

- [ ] Habit editing and deletion
- [ ] Duplicate habits
- [ ] Habit notes/journal entries
- [ ] Filtering and sorting
- [ ] Data export (CSV, JSON)
- [ ] Data import
- [ ] Cloud sync (optional)
- [ ] Notifications/reminders
- [ ] Habit templates
- [ ] Goal-setting for habits

## Performance Tips

- App loads instantly (cached by service worker)
- Smooth animations with GPU acceleration
- Efficient state management with Zustand
- No network requests needed
- Minimal bundle size (~100KB gzipped)

## Browser DevTools

### Inspecting Data
1. Open DevTools (F12)
2. Go to Application → IndexedDB
3. Expand MicroCycleTrackerDB
4. View habits, entries, and settings stores

### Checking Service Worker
1. Open DevTools
2. Go to Application → Service Workers
3. Verify it's "active and running"
4. Check for error messages

### Checking Cache
1. DevTools → Application → Cache Storage
2. Expand microcycle-cache
3. View all cached assets

## Troubleshooting

**Data not saving?**
- Check if IndexedDB is enabled
- Clear browser cache and try again
- Check browser console for errors

**Old data appearing?**
- Service worker may be caching it
- Clear Application cache in DevTools
- Refresh the page

**App not working offline?**
- Verify service worker is installed
- Check Network tab in DevTools
- Ensure you visited app online first

## Accessibility

- Keyboard navigation support
- High contrast dark mode
- Clear visual feedback
- Screen reader compatible (planned)

Enjoy tracking your habits! 🎯
