import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { format, subDays } from 'date-fns';
import { useHabitStore } from '@/store';

const DAY_COUNT = 365;
const CELL_SIZE_PX = 20;

type HeatmapCell = {
  date: string;
  completionPercent: number;
  completedHabits: number;
  level: 0 | 1 | 2 | 3;
};

type TooltipState = {
  x: number;
  y: number;
  cell: HeatmapCell;
} | null;

function getLevel(percent: number): 0 | 1 | 2 | 3 {
  if (percent <= 0) return 0;
  if (percent <= 30) return 1;
  if (percent <= 60) return 2;
  return 3;
}

export const GlobalActivityHeatmap: React.FC = () => {
  const { habits, entries } = useHabitStore();
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Флаг анимации загрузки
  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoaded(true), 100);
    return () => window.clearTimeout(timeout);
  }, []);

  const { weekColumns, totalActions, activeDays } = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, DAY_COUNT - 1);

    const completedByDate = new Map<string, Set<string>>();
    entries.forEach((entry) => {
      if (!entry.value) return;

      const completedHabits = completedByDate.get(entry.date) ?? new Set<string>();
      completedHabits.add(entry.habitId);
      completedByDate.set(entry.date, completedHabits);
    });

    const cells: HeatmapCell[] = [];
    let actions = 0;
    let daysWithActivity = 0;

    for (let i = 0; i < DAY_COUNT; i++) {
      const date = subDays(today, DAY_COUNT - 1 - i);
      const dateKey = format(date, 'yyyy-MM-dd');

      const completedHabits = completedByDate.get(dateKey)?.size ?? 0;
      const completionPercent =
        habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

      const level = getLevel(completionPercent);

      if (completedHabits > 0) daysWithActivity += 1;
      actions += completedHabits;

      cells.push({
        date: dateKey,
        completionPercent,
        completedHabits,
        level,
      });
    }

    const leadingPadding = startDate.getDay();

    const paddedCells: Array<HeatmapCell | null> = [
      ...Array.from({ length: leadingPadding }, () => null),
      ...cells,
    ];

    const columns: Array<Array<HeatmapCell | null>> = [];
    for (let i = 0; i < paddedCells.length; i += 7) {
      columns.push(paddedCells.slice(i, i + 7));
    }

    return {
      weekColumns: columns,
      totalActions: actions,
      activeDays: daysWithActivity,
    };
  }, [entries, habits.length]);

useLayoutEffect(() => {
  const scroller = scrollContainerRef.current;
  if (!scroller) return;

  const timeout = setTimeout(() => {
    scroller.scrollTo({
      left: scroller.scrollWidth - scroller.clientWidth,
      behavior: 'smooth', // или 'auto' для мгновенного
    });
  }, 100); // таймаут 100ms

  return () => clearTimeout(timeout);
}, [weekColumns]);


  if (habits.length === 0) return null;

  const levelClasses: Record<0 | 1 | 2 | 3, string> = {
    0: 'bg-slate-800 border-slate-700/70',
    1: 'bg-emerald-900/70 border-emerald-700/70',
    2: 'bg-emerald-600/70 border-emerald-500/80',
    3: 'bg-emerald-400 border-emerald-300',
  };

  const legendItems = [
    { level: 0, label: '0%', description: 'No activity' },
    { level: 1, label: '1-30%', description: 'Low completion' },
    { level: 2, label: '31-60%', description: 'Medium completion' },
    { level: 3, label: '61-100%', description: 'High completion' },
  ];


  
  return (
    <div className="mt-10">
      <div className="rounded-lg border border-border-subtle bg-surface p-5 md:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Activity Heatmap</h2>
            <p className="text-sm text-gray-400">
              Last year: {activeDays} active days, {totalActions} completed habits.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5 text-xs text-gray-400">
            {legendItems.map((item) => (
              <div key={item.level} className="flex items-center gap-1.5 rounded border border-border-subtle px-2 py-1">
                <span className={`h-3.5 w-3.5 rounded-[3px] border`} />
                <span className="font-medium text-gray-300">{item.label}</span>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full pr-1.5">
          <div
            ref={scrollContainerRef}
            className="heatmap-scrollbar mx-auto overflow-x-auto snap-x snap-mandatory pb-2"
            style={{
              maxWidth: '100%',
            }}
          >
            <div
              className="grid w-max gap-1"
              style={{ gridTemplateColumns: `repeat(${weekColumns.length}, ${CELL_SIZE_PX}px)` }}
            >
              {weekColumns.map((week, weekIdx) => (
                <div key={weekIdx} className="flex snap-start flex-col items-center gap-1">
                  {week.map((cell, dayIdx) => {
                    if (!cell) {
                      return <div key={`empty-${weekIdx}-${dayIdx}`} className="h-5 w-5" />;
                    }

                    const itemIndex = weekIdx * 7 + dayIdx;

                    return (
                      <button
                        key={cell.date}
                        type="button"
                        className={`h-5 w-5 rounded-[3px] border transition-all duration-300 ease-out ${levelClasses[cell.level]} hover:scale-110 hover:brightness-110`}
                        style={{
                          opacity: isLoaded ? 1 : 0,
                          transform: isLoaded ? 'translateY(0)' : 'translateY(4px)',
                          transitionDelay: `${Math.min(itemIndex * 4, 360)}ms`,
                        }}
                        onMouseMove={(event) => {
                          setTooltip({
                            x: event.clientX,
                            y: event.clientY,
                            cell,
                          });
                        }}
                        onMouseEnter={(event) => {
                          setTooltip({
                            x: event.clientX,
                            y: event.clientY,
                            cell,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <p className="font-medium text-white">
            {format(new Date(`${tooltip.cell.date}T12:00:00`), 'PPP')}
          </p>
          <p className="text-gray-300">{tooltip.cell.completionPercent}% completion</p>
          <p className="text-gray-300">{tooltip.cell.completedHabits} completed habits</p>
        </div>
      )}
    </div>
  );
};