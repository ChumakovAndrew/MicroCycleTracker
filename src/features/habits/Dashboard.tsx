import React, { useEffect } from 'react';
import { useHabitStore } from '@/store';
import { HabitList } from '@/components/HabitList';
import { AddHabitForm } from '@/components/AddHabitForm';
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
      <div className='flex '>
        <div className="mb-8 flex-1">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-white">MicroCycle Tracker</h1>
        </div>
          <p className="text-gray-400">Track your habits in short, focused cycles</p>
        </div>
      </div>

      {/* Habits List */}
      <HabitList 
        habits={habits} 
        cycleLength={settings.cycleLength}
        onCycleLengthChange={updateCycleLength}
      />


      <div className='mt-2 flex justify-end w-full'>
      <AddHabitForm onSubmit={addHabit} />
      </div>

      {/* Global Activity Heatmap */}
      <GlobalActivityHeatmap />
      </div>
    </div>
  );
};
