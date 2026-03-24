import React from 'react';
import clsx from 'clsx';

interface CycleSelectorProps {
  value: 3 | 5 | 7;
  onChange: (value: 3 | 5 | 7) => void;
}

export const CycleSelector: React.FC<CycleSelectorProps> = ({ value, onChange }) => {
  const options: (3 | 5 | 7)[] = [3, 5, 7];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={clsx(
            'px-4 py-1 rounded border transition-colors',
            value === option
              ? 'bg-accent-blue border-accent-blue text-white'
              : 'border-border-subtle text-gray-400 hover:border-accent-blue'
          )}
        >
          {option}d
        </button>
      ))}
    </div>
  );
};
