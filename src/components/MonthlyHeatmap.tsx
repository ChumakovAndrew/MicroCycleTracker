import React from 'react';
import { Entry } from '@/types';
import { getMonthDates, getTodayString } from '@/utils/calculations';
import clsx from 'clsx';

interface MonthlyHeatmapProps {
  entries: Entry[];
  className?: string;
  /** When set with `onDateSelect`, cells become clickable and the selected day is highlighted. */
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
  /** If provided, only dates in this list are clickable. */
  allowedDates?: string[];
  /** The month to display. Defaults to the current month. */
  monthDate?: Date;
}

export const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({
  entries,
  className,
  selectedDate,
  onDateSelect,
  allowedDates,
  monthDate,
}) => {
  const monthDates = getMonthDates(monthDate);
  const today = getTodayString();
  const currentMonth = monthDate
    ? `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    : `${today.substring(0, 7)}`;

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
              const isSelected = Boolean(onDateSelect && selectedDate === date);
              const isAllowed = !allowedDates || allowedDates.includes(date);

              const cellClass = clsx(
                'w-6 h-6 rounded border shrink-0',
                hasActivity
                  ? 'bg-accent-blue border-accent-blue'
                  : 'bg-bg-primary border-border-subtle hover:border-accent-blue',
                isToday && !isSelected && 'ring-1 ring-offset-1 ring-accent-blue',
                isSelected && 'ring-2 ring-white',
                !isAllowed && 'opacity-30 cursor-not-allowed'
              );

              const title = new Date(date + 'T12:00:00').toLocaleDateString();

              if (onDateSelect) {
                return (
                  <button
                    key={date}
                    type="button"
                    title={title}
                    disabled={!isAllowed}
                    onClick={() => isAllowed && onDateSelect(date)}
                    className={clsx(cellClass, isAllowed ? 'cursor-pointer' : 'cursor-not-allowed', 'p-0')}
                  />
                );
              }

              return (
                <div key={date} title={title} className={cellClass} />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
