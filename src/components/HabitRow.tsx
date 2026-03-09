import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '@/types';
import { CycleCheckbox } from './CycleCheckbox';
import { ProgressBar } from './ProgressBar';
import { useHabitStore } from '@/store';
import { useCycleProgress, useCycleDates, useHabitEntries } from '@/hooks';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface HabitRowProps {
  habit: Habit;
  isExpanded: boolean;
  onToggle: (habitId: string) => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({ habit, isExpanded, onToggle }) => {
  const { toggleEntry } = useHabitStore();
  const cycleDates = useCycleDates();
  const progress = useCycleProgress(habit.id);
  const habitEntries = useHabitEntries(habit.id);

  const handleCheckboxChange = (date: string, value: boolean) => {
    toggleEntry(habit.id, date, value);
  };

  return (
    <div className="border-b border-border-subtle">
      <div
        className="py-4 px-4 flex items-center gap-4 hover:bg-surface transition-colors cursor-pointer"
        onClick={() => onToggle(habit.id)}
      >
        <div className="flex-1">
          <h3 className="font-medium text-white">{habit.name}</h3>
        </div>

        <div className="flex items-center gap-3">
          {cycleDates.map((date) => {
            const entry = habitEntries.find((e) => e.date === date);
            return (
              <div key={date} onClick={(e) => e.stopPropagation()}>
                <CycleCheckbox
                  checked={entry ? Boolean(entry.value) : false}
                  onChange={(value) => handleCheckboxChange(date, value)}
                />
              </div>
            );
          })}
        </div>

        <div className="w-24 flex items-center gap-2">
          <ProgressBar percentage={progress} />
          <span className="text-sm text-gray-400 w-10 text-right">{progress}%</span>
        </div>

        <ChevronDown
          className={clsx(
            'w-5 h-5 text-gray-400 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isExpanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <slot>{isExpanded && <div>Detail content will go here</div>}</slot>
      </motion.div>
    </div>
  );
};
