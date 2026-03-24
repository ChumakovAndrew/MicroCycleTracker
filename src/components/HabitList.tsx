import React, { useState } from 'react';
import { Habit } from '@/types';
import { HabitRow } from './HabitRow';
import { HabitDetail } from './HabitDetail';
import { useCycleDates } from '@/hooks';
import { CycleSelector } from '@/components/CycleSelector';
import clsx from 'clsx';
import { formatISO, parseISO, startOfDay } from 'date-fns';
import { useCycleInfo } from '@/hooks';

interface HabitListProps {
  habits: Habit[];
  cycleLength: 3 | 5 | 7;
  onCycleLengthChange: (value: 3 | 5 | 7) => void;
}

const WEEKDAY_SHORT = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const HabitList: React.FC<HabitListProps> = ({ habits, cycleLength, onCycleLengthChange }) => {
  const cycleDates = useCycleDates();
  const cycleInfo = useCycleInfo();
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);

  const todayString = formatISO(startOfDay(new Date()), { representation: 'date' });

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
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="py-4 px-4 flex items-center gap-14 hover:bg-surface transition-colors cursor-pointer border-b border-border-subtle bg-bg-secondary">
            <div className='flex-1'>
               <CycleSelector
                  value={cycleLength}
                  onChange={onCycleLengthChange}
              />
            </div>
            <div className="flex items-center gap-8">
              {cycleDates.map((date) => {
                const parsed = parseISO(date);
                const day = Number.isNaN(parsed.getTime())
                  ? ''
                  : WEEKDAY_SHORT[(parsed.getDay() + 6) % 7];
                const isToday = date === todayString;

                return (
                  <div
                    key={date}
                    className={clsx(
                      'w-10 h-10 rounded flex items-center justify-center transition-colors flex-shrink-0 flex flex-col items-center justify-center text-lg text-center',
                      isToday ? 'text-white' : 'text-gray-400'
                    )}
                  >
                    <span className="leading-none">{day}</span>
                  </div>
                );
              })}
            </div>
            
                 {cycleInfo && (
                          <div className="w-60 text-right pr-2 text-gray-400">
                            <span className="text-accent-blue text-lg font-semibold">
                              Cycle #{cycleInfo.cycleNumber}
                            </span>
                            <span className="text-sm mx-2">•</span>
                            <span>Day {cycleInfo.dayInCycle} of {cycleLength}</span>
                          </div>
                        )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
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
      </div>
    </div>
  );
};
