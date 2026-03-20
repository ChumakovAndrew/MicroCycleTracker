import React from 'react';
import { useHabitStore } from '@/store';
import { MonthlyHeatmap } from './MonthlyHeatmap';

export const GlobalActivityHeatmap: React.FC = () => {
  const { habits, entries } = useHabitStore();

  if (habits.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-border-subtle">
      <h2 className="text-lg font-semibold text-white mb-6">Monthly Activity Overview</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {habits.map((habit) => (
          <div key={habit.id} className="space-y-3">
            <p className="text-sm font-medium text-gray-300">{habit.name}</p>
            <MonthlyHeatmap entries={entries.filter((e) => e.habitId === habit.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};
