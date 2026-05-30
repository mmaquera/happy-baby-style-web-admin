import type React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// ── Modal shells ────────────────────────────────────────────────────────────

export const ModalOverlay: React.FC<
  { isOpen: boolean } & React.HTMLAttributes<HTMLDivElement>
> = ({ isOpen, children, className, ...rest }) => {
  if (!isOpen) return null;
  return (
    <div
      className={cn(
        'fixed inset-0 z-[500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[8px]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const ModalContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'relative max-h-[90vh] w-full max-w-[800px] overflow-y-auto rounded-xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-6',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...rest
}) => (
  <h2
    className={cn(
      'font-heading m-0 flex items-center gap-2 text-xl font-semibold text-foreground',
      className
    )}
    {...rest}
  >
    {children}
  </h2>
);

export const CloseButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...rest }) => (
  <button
    className={cn(
      'flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('px-6 py-6', className)} {...rest}>
    {children}
  </div>
);

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'sticky bottom-0 z-10 flex justify-end gap-3 border-t border-border bg-white px-6 py-6',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

// ── Status messages ──────────────────────────────────────────────────────────

export const ErrorMessage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'mb-4 flex items-center gap-2 rounded-md bg-destructive/20 p-3 text-sm text-destructive',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const SuccessMessage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'mb-4 flex items-center gap-2 rounded-md bg-green-500/20 p-3 text-sm text-green-700',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const LoadingOverlay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'absolute inset-0 z-20 flex items-center justify-center bg-white/80',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const LoadingSpinner: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => (
  <div
    className={cn(
      'h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-brand-purple',
      className
    )}
    {...rest}
  />
);

// ── Form layout ──────────────────────────────────────────────────────────────

export const FormSection: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('mb-6', className)} {...rest}>
    {children}
  </div>
);

export const SectionTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement>
> = ({ children, className, ...rest }) => (
  <h3
    className={cn(
      'font-heading mb-4 flex items-center gap-2 text-lg font-semibold text-foreground',
      className
    )}
    {...rest}
  >
    {children}
  </h3>
);

export const FormGrid: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'mb-4 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const FormRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('flex flex-col gap-2', className)} {...rest}>
    {children}
  </div>
);

export const FormLabel: React.FC<
  React.LabelHTMLAttributes<HTMLLabelElement>
> = ({ children, className, ...rest }) => (
  <label
    className={cn(
      'flex items-center gap-1 text-sm font-medium text-foreground',
      className
    )}
    {...rest}
  >
    {children}
  </label>
);

export const RequiredIndicator: React.FC<
  React.HTMLAttributes<HTMLSpanElement>
> = ({ children = '*', className, ...rest }) => (
  <span className={cn('font-bold text-destructive', className)} {...rest}>
    {children}
  </span>
);

export const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ className, ...rest }) => (
  <select
    className={cn(
      'cursor-pointer rounded-md border-2 border-border bg-white px-4 py-3 text-base outline-none transition-all hover:border-border/80 focus:border-brand-purple focus:shadow-[0_0_0_3px_rgba(107,70,193,0.2)]',
      className
    )}
    {...rest}
  />
);

export const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ...rest }) => (
  <textarea
    className={cn(
      'min-h-[100px] resize-y rounded-md border-2 border-border bg-white px-4 py-3 text-base outline-none transition-all hover:border-border/80 focus:border-brand-purple focus:shadow-[0_0_0_3px_rgba(107,70,193,0.2)]',
      className
    )}
    {...rest}
  />
);

export const CheckboxContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => (
  <div
    className={cn('flex cursor-pointer items-center gap-2', className)}
    {...rest}
  >
    {children}
  </div>
);

export const Checkbox: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className, ...rest }) => (
  <input
    type='checkbox'
    className={cn(
      'h-[18px] w-[18px] cursor-pointer accent-brand-purple',
      className
    )}
    {...rest}
  />
);

export const CheckboxLabel: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className,
  ...rest
}) => (
  <span
    className={cn('cursor-pointer text-sm text-muted-foreground', className)}
    {...rest}
  >
    {children}
  </span>
);

export const TagsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('mt-2 flex flex-wrap gap-2', className)} {...rest}>
    {children}
  </div>
);

export const TagChip: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    isSelected: boolean;
    color?: string;
  }
> = ({ isSelected, color, children, className, style, ...rest }) => (
  <div
    className={cn(
      'relative flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all hover:-translate-y-px',
      isSelected
        ? 'text-white'
        : 'border-border bg-muted text-muted-foreground hover:bg-brand-purple/10'
    )}
    style={
      isSelected
        ? {
            background: color ?? 'var(--color-brand-purple)',
            borderColor: color ?? 'var(--color-brand-purple)',
            ...style,
          }
        : style
    }
    {...rest}
  >
    {children}
  </div>
);

export const AttributesContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => (
  <div className={cn('flex flex-col gap-3', className)} {...rest}>
    {children}
  </div>
);

export const AttributeRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'grid items-end gap-3 [grid-template-columns:1fr_1fr_auto]',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const RemoveAttributeButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...rest }) => (
  <button
    className={cn(
      'rounded-md bg-destructive px-3 py-2 text-sm text-white transition-colors hover:bg-destructive/90',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export const AddAttributeButton: React.FC<
  React.ComponentProps<typeof Button>
> = ({ className, ...rest }) => (
  <Button className={cn('self-start', className)} {...rest} />
);

export const SkuFieldContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => (
  <div className={cn('relative flex items-center gap-2', className)} {...rest}>
    {children}
  </div>
);

export const GenerateSkuButton: React.FC<
  React.ComponentProps<typeof Button>
> = ({ className, ...rest }) => (
  <Button
    className={cn('min-w-0 whitespace-nowrap px-3 py-2 text-sm', className)}
    {...rest}
  />
);
