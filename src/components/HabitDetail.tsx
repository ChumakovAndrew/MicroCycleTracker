import React, { useState } from 'react';
import { Habit } from '@/types';
import { useHabitStats, useHabitEntries } from '@/hooks';
import { useHabitStore } from '@/store';
import { MonthlyHeatmap } from './MonthlyHeatmap';
import { Activity, Flame, Calendar, Trash2 } from 'lucide-react';

interface HabitDetailProps {
  habit: Habit;
  onDelete?: () => void;
}

export const HabitDetail: React.FC<HabitDetailProps> = ({ habit, onDelete }) => {
  const stats = useHabitStats(habit.id);
  const entries = useHabitEntries(habit.id);
  const { deleteHabit } = useHabitStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirm = async () => {
    await deleteHabit(habit.id);
    setShowDeleteConfirm(false);
    onDelete?.();
  };

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

      {/* Delete Section */}
      <div className="pt-4 border-t border-border-subtle">
        {showDeleteConfirm ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-300">
              Are you sure you want to delete <span className="font-semibold">{habit.name}</span>? This action cannot be undone. All entries for this habit will be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-600/10 text-red-500 hover:text-red-400 text-sm font-medium rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Habit
          </button>
        )}
      </div>
    </div>
  );
};
