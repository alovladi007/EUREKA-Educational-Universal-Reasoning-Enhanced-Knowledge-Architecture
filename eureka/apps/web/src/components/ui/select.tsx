'use client';

import { createContext, useContext, useState, useRef, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children?: React.ReactNode;
}

const Select = ({ value, onValueChange, defaultValue, children }: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

Select.displayName = 'Select';

// Accept all standard <button> HTML attributes (id, aria-*, data-*, etc.)
// so callers can wire labels, form integrations, and analytics.
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const context = useContext(SelectContext);

    if (!context) {
      throw new Error('SelectTrigger must be used within a Select');
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          context.setOpen(!context.open);
          onClick?.(e);
        }}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input',
          'bg-background px-3 py-2 text-sm ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

interface SelectValueProps {
  placeholder?: string;
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('SelectValue must be used within a Select');
  }

  return <span>{context.value || placeholder}</span>;
};

SelectValue.displayName = 'SelectValue';

interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
}

const SelectContent = ({ className, children }: SelectContentProps) => {
  const context = useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!context) {
    throw new Error('SelectContent must be used within a Select');
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        context.setOpen(false);
      }
    };

    if (context.open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [context, context.open]);

  if (!context.open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover',
        'text-popover-foreground shadow-md animate-in fade-in-80',
        className
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

SelectContent.displayName = 'SelectContent';

interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

const SelectItem = ({ value, children, className }: SelectItemProps) => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('SelectItem must be used within a Select');
  }

  const isSelected = context.value === value;

  return (
    <div
      onClick={() => context.onValueChange?.(value)}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2',
        'text-sm outline-none',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        isSelected && 'bg-accent',
        className
      )}
    >
      {children}
    </div>
  );
};

SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
