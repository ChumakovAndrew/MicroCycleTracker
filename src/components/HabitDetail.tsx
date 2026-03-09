import React from 'react';
import { Habit } from '@/types';
import { useHabitStats, useHabitEntries } from '@/hooks';
import { MonthlyHeatmap } from './MonthlyHeatmap';
import { Activity, Flame, Calendar } from 'lucide-react';

interface HabitDetailProps {
  habit: Habit;
}

export const HabitDetail: React.FC<HabitDetailProps> = ({ habit }) => {
  const stats = useHabitStats(habit.id);
  const entries = useHabitEntries(habit.id);

  return (
    <div className="bg-surface p-6 border-t border-border-subtle space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Total Sessions
          </span>
          <span className="text-2xl font-bold text-accent-blue">{stats.totalSessions}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Completed
          </span>
          <span className="text-2xl font-bold text-green-500">{stats.completedSessions}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            Best Streak
          </span>
          <span className="text-2xl font-bold text-orange-500">{stats.bestStreak}d</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Completion Rate</span>
          <span className="text-2xl font-bold text-accent-blue">{stats.completionRate}%</span>
        </div>
      </div>

      {stats.streak > 0 && (
        <div className="p-3 bg-bg-primary border border-border-subtle rounded">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-accent-blue">{stats.streak} day</span> streak going strong! 🔥
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300">Monthly Activity</h4>
        <MonthlyHeatmap entries={entries} />
      </div>
    </div>
  );
};
