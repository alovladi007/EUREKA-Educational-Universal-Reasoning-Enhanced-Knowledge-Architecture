'use client';

import { createContext, useContext, InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

interface RadioGroupProps {
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  children?: React.ReactNode;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name = 'radio-group', value, onValueChange, defaultValue, className, children }, ref) => {
    const handleChange = (itemValue: string) => {
      onValueChange?.(itemValue);
    };

    return (
      <RadioGroupContext.Provider value={{ name, value: value || defaultValue, onChange: handleChange }}>
        <div ref={ref} className={cn('grid gap-2', className)} role="radiogroup">
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
}

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = useContext(RadioGroupContext);

    if (!context) {
      throw new Error('RadioGroupItem must be used within a RadioGroup');
    }

    const isChecked = context.value === value;

    const handleChange = () => {
      context.onChange?.(value);
    };

    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <input
          ref={ref}
          type="radio"
          name={context.name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          className={cn(
            'h-4 w-4 rounded-full border border-primary text-primary ring-offset-background',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          {...props}
        />
      </div>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
