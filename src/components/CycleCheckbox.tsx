import React from 'react';
import clsx from 'clsx';

interface CycleCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const CycleCheckbox: React.FC<CycleCheckboxProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={clsx(
        'w-8 h-8 rounded border flex items-center justify-center transition-colors',
        checked
          ? 'bg-accent-blue border-accent-blue'
          : 'border-border-subtle hover:border-accent-blue',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {checked && (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};
