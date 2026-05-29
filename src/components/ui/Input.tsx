import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  rightIconClickable?: boolean;
  rightIconAriaLabel?: string;
}

function Input({
  className,
  type,
  label,
  error,
  leftIcon,
  icon,
  fullWidth,
  id,
  rightIcon,
  onRightIconClick,
  rightIconClickable,
  rightIconAriaLabel,
  ...props
}: InputProps) {
  const hasLeftIcon = leftIcon ?? icon;

  const inputElement = (
    <div className={cn('relative', fullWidth && 'w-full')}>
      {hasLeftIcon && (
        <div className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4'>
          {hasLeftIcon}
        </div>
      )}
      <InputPrimitive
        id={id}
        type={type}
        data-slot='input'
        aria-invalid={error ? true : undefined}
        className={cn(
          'h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
          hasLeftIcon && 'pl-8',
          rightIcon && 'pr-8',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div
          className={cn(
            'absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4',
            rightIconClickable && 'cursor-pointer'
          )}
          onClick={rightIconClickable ? onRightIconClick : undefined}
          role={rightIconClickable ? 'button' : undefined}
          aria-label={rightIconAriaLabel}
          tabIndex={rightIconClickable ? 0 : undefined}
          onKeyDown={
            rightIconClickable
              ? e => {
                  if (e.key === 'Enter' || e.key === ' ') onRightIconClick?.();
                }
              : undefined
          }
        >
          {rightIcon}
        </div>
      )}
    </div>
  );

  if (!label && !error) return inputElement;

  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={id}
          className='text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {label}
        </label>
      )}
      {inputElement}
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  );
}

export { Input };
export type { InputProps };
