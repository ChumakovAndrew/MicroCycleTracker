import React, { useEffect } from 'react';
import { useHabitStore } from '@/store';
import { HabitList } from '@/components/HabitList';
import { AddHabitForm } from '@/components/AddHabitForm';
import { CycleSelector } from '@/components/CycleSelector';
import { GlobalActivityHeatmap } from '@/components/GlobalActivityHeatmap';
import { useCycleInfo } from '@/hooks';

export const Dashboard: React.FC = () => {
  const { habits, settings, loadData, addHabit, updateCycleLength } = useHabitStore();
  const cycleInfo = useCycleInfo();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-white">MicroCycle Tracker</h1>
            {cycleInfo && (
              <div className="text-sm text-gray-400">
                <span className="text-accent-blue font-semibold">
                  Cycle #{cycleInfo.cycleNumber}
                </span>
                <span className="mx-2">•</span>
                <span>Day {cycleInfo.dayInCycle} of {settings.cycleLength}</span>
              </div>
            )}
          </div>
          <p className="text-gray-400">Track your habits in short, focused cycles</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <label className="text-sm text-gray-400 mr-3">Cycle Length:</label>
            <CycleSelector
              value={settings.cycleLength}
              onChange={updateCycleLength}
            />
          </div>
          <AddHabitForm onSubmit={addHabit} />
        </div>

        {/* Habits List */}
        <HabitList habits={habits} />

        {/* Global Activity Heatmap */}
        <GlobalActivityHeatmap />
      </div>
    </div>
  );
};
