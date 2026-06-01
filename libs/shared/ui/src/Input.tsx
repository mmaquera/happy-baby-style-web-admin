import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';

import { cn } from '@happy-baby/shared-utils';

interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string | undefined;
  leftIcon?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  rightIconClickable?: boolean;
  rightIconAriaLabel?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
    },
    ref
  ) => {
    const hasLeftIcon = leftIcon ?? icon;

    const inputElement = (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {hasLeftIcon ? (
          <div className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4'>
            {hasLeftIcon}
          </div>
        ) : null}
        <InputPrimitive
          ref={ref}
          id={id}
          type={type}
          data-slot='input'
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full min-w-0 border border-input bg-transparent text-base transition-colors outline-none h-[var(--control-h-lg)] rounded-[var(--control-radius)] px-[var(--control-px-md)] py-[var(--control-py-input)] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
            hasLeftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        {rightIcon ? (
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
                    if (e.key === 'Enter' || e.key === ' ')
                      onRightIconClick?.();
                  }
                : undefined
            }
          >
            {rightIcon}
          </div>
        ) : null}
      </div>
    );

    if (!label && !error) return inputElement;

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label ? (
          <label
            htmlFor={id}
            className='text-xs font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {label}
          </label>
        ) : null}
        {inputElement}
        {error ? <p className='text-xs text-destructive'>{error}</p> : null}
      </div>
    );
  }
);

export { Input };
export type { InputProps };
