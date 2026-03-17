import React from 'react';
import { motion } from 'framer-motion';
import { Habit } from '@/types';
import { CycleCheckbox } from './CycleCheckbox';
import { ProgressBar } from './ProgressBar';
import { useHabitStore } from '@/store';
import { useCycleProgress, useCycleDates, useHabitEntries, useCycleNumericSum } from '@/hooks';
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
  const cycleNumericSum = useCycleNumericSum(habit.id);

  const isNumericHabit = habit.type === 'numeric';

  const handleCheckboxChange = (date: string, value: boolean) => {
    toggleEntry(habit.id, date, value);
  };

  const handleNumericChange = (date: string, rawValue: string) => {
    const value = Number(rawValue);
    if (Number.isNaN(value) || value < 0) {
      return;
    }

    // For numeric habits we treat 0 as cleared entry
    if (value === 0) {
      toggleEntry(habit.id, date, 0);
    } else {
      toggleEntry(habit.id, date, value);
    }
  };

  return (
    <div className="border-b border-border-subtle">
      <div
        className="py-4 px-4 flex items-center gap-4 hover:bg-surface transition-colors cursor-pointer"
        onClick={() => onToggle(habit.id)}
      >
        <div className="flex-1">
          <h3 className="font-medium text-white">{habit.name}</h3>
          {isNumericHabit && (
            <div className="text-xs text-gray-400">
              Cycle total: <span className="font-semibold text-accent-blue">{cycleNumericSum}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {cycleDates.map((date) => {
            const entry = habitEntries.find((e) => e.date === date);
            
            if (isNumericHabit) {
              const numericValue = entry && typeof entry.value === 'number' ? entry.value : 0;
              const isNonzero = numericValue > 0;

              return (
                <div key={date} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={numericValue}
                    onChange={(e) => handleNumericChange(date, e.target.value)}
                    className={clsx(
                      'w-8 h-8 text-xs text-white rounded text-center focus:outline-none focus:border-accent-blue',
                      isNonzero
                        ? 'bg-accent-blue border-accent-blue'
                        : 'bg-bg-primary border-border-subtle'
                    )}
                  />
                </div>
              );
            }

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
      </motion.div>
    </div>
  );
};
