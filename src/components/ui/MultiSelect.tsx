
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemoveSelected = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== value));
  };

  const getSelectedLabels = () => {
    return selected.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    });
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className="flex min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            getSelectedLabels().map((label, index) => (
              <span
                key={selected[index]}
                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs"
              >
                {label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => handleRemoveSelected(selected[index], e)}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {options.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleToggleOption(option.value)}
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  {selected.includes(option.value) && <Check className="h-4 w-4" />}
                </div>
                <span className="text-sm">{option.label}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
