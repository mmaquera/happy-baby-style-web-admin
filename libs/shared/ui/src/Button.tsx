import type * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import Loader2Icon from 'lucide-react/dist/esm/icons/loader-2';

import { cn } from '@happy-baby/shared-utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[var(--control-radius)] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-[var(--shadow-control-hover)]',
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-[var(--shadow-control-hover)]',
        outline:
          'border-border bg-background text-foreground hover:bg-primary-soft hover:border-primary hover:text-primary',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-primary-soft hover:text-primary',
        destructive:
          'bg-destructive text-white hover:brightness-90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20',
        danger:
          'bg-destructive text-white hover:brightness-90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-[var(--control-h-sm)] px-[var(--control-px-sm)] text-xs',
        small: 'h-[var(--control-h-sm)] px-[var(--control-px-sm)] text-xs',
        md: 'h-[var(--control-h-md)] px-[var(--control-px-md)]',
        medium: 'h-[var(--control-h-md)] px-[var(--control-px-md)]',
        default: 'h-[var(--control-h-md)] px-[var(--control-px-md)]',
        lg: 'h-[var(--control-h-lg)] px-[var(--control-px-lg)]',
        large: 'h-[var(--control-h-lg)] px-[var(--control-px-lg)]',
        icon: 'size-[var(--control-h-md)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends
    Omit<ButtonPrimitive.Props, 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot='button'
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? <Loader2Icon className='size-4 animate-spin' /> : null}
      {!isLoading && icon && iconPosition === 'left' ? icon : null}
      {children}
      {!isLoading && icon && iconPosition === 'right' ? icon : null}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
