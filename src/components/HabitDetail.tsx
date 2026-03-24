import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Habit, DAY_COMMENT_MAX_LENGTH } from '@/types';
import {
  useHabitStats,
  useHabitEntries,
  useCycleNumericSum,
  useCycleNumericAverage,
  useCycleNumericMax,
  useCycleNumericMin,
} from '@/hooks';
import { useHabitStore } from '@/store';
import { MonthlyHeatmap } from './MonthlyHeatmap';
import { Activity, Flame, Calendar, Trash2, MessageSquare } from 'lucide-react';
import { format, formatISO, parseISO, startOfDay } from 'date-fns';
import { getMonthDates } from '@/utils/calculations';

interface HabitDetailProps {
  habit: Habit;
  onDelete?: () => void;
}

export const HabitDetail: React.FC<HabitDetailProps> = ({ habit, onDelete }) => {
  const stats = useHabitStats(habit.id);
  const entries = useHabitEntries(habit.id);
  const cycleNumericSum = useCycleNumericSum(habit.id);
  const cycleNumericAverage = useCycleNumericAverage(habit.id);
  const cycleNumericMax = useCycleNumericMax(habit.id);
  const cycleNumericMin = useCycleNumericMin(habit.id);
  const dayComments = useHabitStore((s) => s.dayComments);
  const upsertDayComment = useHabitStore((s) => s.upsertDayComment);
  const { deleteHabit } = useHabitStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const todayString = formatISO(startOfDay(new Date()), { representation: 'date' });
  const monthDates = useMemo(() => getMonthDates(), [todayString]);

  const [selectedDate, setSelectedDate] = useState(todayString);
  const prevHabitRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevHabitRef.current !== habit.id) {
      prevHabitRef.current = habit.id;
      setSelectedDate(todayString);
      return;
    }
    setSelectedDate((prev) =>
      prev && monthDates.includes(prev) ? prev : todayString
    );
  }, [habit.id, monthDates, todayString]);

  const persistedComment = selectedDate
    ? dayComments.find((c) => c.habitId === habit.id && c.date === selectedDate)?.text
    : undefined;

  const [draft, setDraft] = useState(persistedComment ?? '');
  const commentAreaRef = useRef<HTMLTextAreaElement>(null);
  const saveDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedDate) return;
    const saved =
      dayComments.find((c) => c.habitId === habit.id && c.date === selectedDate)?.text ?? '';
    const editing = commentAreaRef.current === document.activeElement;
    if (editing) return;
    setDraft(saved);
  }, [habit.id, selectedDate, dayComments]);

  useEffect(() => {
    if (!selectedDate) return;
    const saved =
      dayComments.find((c) => c.habitId === habit.id && c.date === selectedDate)?.text ?? '';
    if (draft === saved) return;
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = setTimeout(() => {
      saveDebounceRef.current = null;
      upsertDayComment(habit.id, selectedDate, draft);
    }, 450);
    return () => {
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
        saveDebounceRef.current = null;
      }
    };
  }, [draft, habit.id, selectedDate, dayComments, upsertDayComment]);

  const handleCommentBlur = () => {
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
      saveDebounceRef.current = null;
    }
    if (!selectedDate) return;
    const saved =
      dayComments.find((c) => c.habitId === habit.id && c.date === selectedDate)?.text ?? '';
    if (draft !== saved) {
      upsertDayComment(habit.id, selectedDate, draft);
    }
  };

  const displayComment = (persistedComment ?? '').trim() ? persistedComment : null;

  const handleDeleteConfirm = async () => {
    await deleteHabit(habit.id);
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  return (
    <div className="bg-surface p-6 border-t border-border-subtle space-y-6">
      {habit.description && (
        <div className="p-3 bg-bg-primary border border-border-subtle rounded">
          <h4 className="text-sm font-semibold text-gray-300">Description</h4>
          <p className="text-sm text-gray-400 mt-1">{habit.description}</p>
        </div>
      )}
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
        {habit.type === 'numeric' && (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Cycle Total</span>
              <span className="text-2xl font-bold text-accent-blue">{cycleNumericSum}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Avg/day</span>
              <span className="text-2xl font-bold text-accent-blue">{cycleNumericAverage}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Max</span>
              <span className="text-2xl font-bold text-accent-blue">{cycleNumericMax}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Min</span>
              <span className="text-2xl font-bold text-accent-blue">{cycleNumericMin}</span>
            </div>
          </>
        )}
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
        <p className="text-xs text-gray-500">
          Click a day in the grid to select it for your note.
        </p>
        <MonthlyHeatmap
          entries={entries}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          Day comment
        </h4>
        <p className="text-xs text-gray-500">
          Autosaves a moment after you stop typing.
        </p>
        {selectedDate && (
          <p className="text-xs font-medium text-gray-300">
            {format(parseISO(`${selectedDate}T12:00:00`), 'EEEE, MMM d')}
            {selectedDate === todayString ? ' · Today' : ''}
          </p>
        )}
        <div className="rounded border border-border-subtle bg-bg-primary p-3 space-y-2">
          <label htmlFor={`habit-${habit.id}-day-comment`} className="sr-only">
            Comment for {selectedDate || 'selected day'}
          </label>
          <textarea
            ref={commentAreaRef}
            id={`habit-${habit.id}-day-comment`}
            value={draft}
            onChange={(e) =>
              setDraft(e.target.value.slice(0, DAY_COMMENT_MAX_LENGTH))
            }
            onBlur={handleCommentBlur}
            placeholder="No comment yet"
            rows={3}
            className="w-full rounded bg-bg-primary border border-border-subtle px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-blue resize-y min-h-[4.5rem]"
          />
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              {displayComment ? (
                <span className="text-gray-400">Saved for this day.</span>
              ) : (
                <span>No comment yet</span>
              )}
            </span>
            <span>
              {draft.length}/{DAY_COMMENT_MAX_LENGTH}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Section */}
      <div className="pt-4 border-t border-border-subtle">
        {showDeleteConfirm ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-300">
              Are you sure you want to delete <span className="font-semibold">{habit.name}</span>? This action cannot be undone. All entries and day comments for this habit will be deleted.
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
