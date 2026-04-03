import React from 'react';
import { Plus } from 'lucide-react';

interface AddHabitFormProps {
  onSubmit: (name: string, type: 'binary' | 'numeric', description?: string) => void;
}

export const AddHabitForm: React.FC<AddHabitFormProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<'binary' | 'numeric'>('binary');
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, type, description.trim() ? description.trim() : undefined);
      setName('');
      setType('binary');
      setDescription('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-1/5 h-10 flex items-center justify-center gap-2 px-4 py-2 bg-accent-blue rounded hover:opacity-90 transition-opacity m-2"
      >
        <Plus className="w-5 h-5" />
        Add Habit
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full bg-surface p-4 border border-border-subtle rounded-lg">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Habit name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 bg-bg-primary border border-border-subtle rounded text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue"
          autoFocus
        />
        
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="binary"
              checked={type === 'binary'}
              onChange={(e) => setType(e.target.value as 'binary')}
              className="w-4 h-4"
            />
            <span className="text-sm">Binary (Yes/No)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="numeric"
              checked={type === 'numeric'}
              onChange={(e) => setType(e.target.value as 'numeric')}
              className="w-4 h-4"
            />
            <span className="text-sm">Numeric (Count)</span>
          </label>
        </div>

        <textarea
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-2 bg-bg-primary border border-border-subtle rounded text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue resize-none"
          rows={3}
        />

        <div className="flex w-1/2 ml-auto mr-0 gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-accent-blue rounded hover:opacity-90 transition-opacity"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 border border-border-subtle rounded hover:bg-surface transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
