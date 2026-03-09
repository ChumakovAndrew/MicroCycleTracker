import React from 'react';
import clsx from 'clsx';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className }) => {
  return (
    <div className={clsx('w-full h-1.5 bg-border-subtle rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-accent-blue transition-all duration-300"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};
