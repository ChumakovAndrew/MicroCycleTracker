import React from 'react';
import { Entry } from '@/types';
import { getMonthDates, getTodayString } from '@/utils/calculations';
import clsx from 'clsx';

interface MonthlyHeatmapProps {
  entries: Entry[];
  className?: string;
}

export const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({ entries, className }) => {
  const monthDates = getMonthDates();
  const today = getTodayString();
  const currentMonth = `${today.substring(0, 7)}`;

  // Create a map of dates to activity
  const activityMap: Record<string, boolean> = {};
  entries.forEach((entry) => {
    if (entry.date.startsWith(currentMonth) && entry.value) {
      activityMap[entry.date] = true;
    }
  });

  // Group dates by weeks
  const weeks: string[][] = [];
  let currentWeek: string[] = [];
  monthDates.forEach((date, index) => {
    currentWeek.push(date);
    if ((index + 1) % 7 === 0 || index === monthDates.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {week.map((date) => {
              const hasActivity = activityMap[date];
              const isToday = date === today;

              return (
                <div
                  key={date}
                  title={new Date(date).toLocaleDateString()}
                  className={clsx(
                    'w-6 h-6 rounded border',
                    hasActivity
                      ? 'bg-accent-blue border-accent-blue'
                      : 'bg-bg-primary border-border-subtle hover:border-accent-blue',
                    isToday && 'ring-1 ring-offset-1 ring-accent-blue'
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
