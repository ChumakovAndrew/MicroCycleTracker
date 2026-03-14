import React, { useState } from 'react';
import { Habit } from '@/types';
import { HabitRow } from './HabitRow';
import { HabitDetail } from './HabitDetail';

interface HabitListProps {
  habits: Habit[];
}

export const HabitList: React.FC<HabitListProps> = ({ habits }) => {
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);

  const handleToggleExpand = (habitId: string) => {
    setExpandedHabitId(expandedHabitId === habitId ? null : habitId);
  };

  if (habits.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        <p>No habits yet. Create one to get started.</p>
      </div>
    );
  }

  const handleHabitDelete = () => {
    setExpandedHabitId(null);
  };

  return (
    <div className="bg-surface rounded-lg border border-border-subtle overflow-hidden">
      {habits.map((habit) => (
        <div key={habit.id}>
          <HabitRow
            habit={habit}
            isExpanded={expandedHabitId === habit.id}
            onToggle={handleToggleExpand}
          />
          {expandedHabitId === habit.id && (
            <HabitDetail habit={habit} onDelete={handleHabitDelete} />
          )}
        </div>
      ))}
    </div>
  );
};
