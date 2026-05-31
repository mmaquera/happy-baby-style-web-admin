import React from 'react';
import { cn } from '@happy-baby/shared-utils';

export const SVGUploadContainer = ({
  className,
  children,
}: {
  className?: string | undefined;
  children: React.ReactNode;
}) => <div className={cn('mb-4 w-full', className)}>{children}</div>;

export const SVGUploadZone = ({
  isDragOver,
  hasError,
  disabled,
  children,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: {
  isDragOver: boolean;
  hasError: boolean;
  disabled: boolean;
  children: React.ReactNode;
  onDragOver?: React.DragEventHandler;
  onDragLeave?: React.DragEventHandler;
  onDrop?: React.DragEventHandler;
  onClick?: React.MouseEventHandler;
}) => (
  <div
    className={cn(
      'rounded-xl border-2 border-dashed p-6 text-center transition-all',
      disabled
        ? 'cursor-not-allowed opacity-60 bg-muted border-border'
        : hasError
          ? 'border-destructive hover:border-destructive hover:bg-destructive/5'
          : isDragOver
            ? 'border-[#FF7B5A] bg-brand-purple/10 cursor-pointer'
            : 'border-border hover:border-[#FF7B5A] hover:bg-brand-purple/10 cursor-pointer'
    )}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    onClick={onClick}
  >
    {children}
  </div>
);

export const SVGFileInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => (
  <input ref={ref} className={cn('hidden', className)} {...rest} />
));
SVGFileInput.displayName = 'SVGFileInput';

export const SVGUploadContent = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className='flex flex-col items-center gap-3'>{children}</div>;

export const SVGUploadIcon = ({ children }: { children: React.ReactNode }) => (
  <div className='mb-2 text-muted-foreground [&>svg]:h-10 [&>svg]:w-10'>
    {children}
  </div>
);

export const SVGUploadText = ({ children }: { children: React.ReactNode }) => (
  <p className='m-0 text-base font-medium text-foreground'>{children}</p>
);

export const SVGUploadSubtext = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className='m-0 text-sm text-muted-foreground'>{children}</p>;

export const SVGUploadButton = ({
  disabled,
  children,
  onClick,
}: {
  disabled: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'rounded-lg px-4 py-3 text-sm font-medium transition-all',
      disabled
        ? 'cursor-not-allowed bg-border text-muted-foreground opacity-60'
        : 'bg-[#FF7B5A] text-white hover:opacity-90 hover:-translate-y-px'
    )}
  >
    {children}
  </button>
);

export const SVGProgressBar = ({ children }: { children: React.ReactNode }) => (
  <div className='mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border'>
    {children}
  </div>
);

export const SVGProgressFill = ({ progress }: { progress: number }) => (
  <div
    className='h-full bg-[#FF7B5A] transition-[width]'
    style={{ width: `${progress}%` }}
  />
);

export const SVGProgressText = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className='mt-2 text-sm text-muted-foreground'>{children}</p>;

export const SVGErrorMessage = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className='mt-2 text-center text-sm text-destructive'>{children}</p>;

export const SVGFileList = ({ children }: { children: React.ReactNode }) => (
  <div className='mt-4 w-full'>{children}</div>
);

export const SVGFileItem = ({ children }: { children: React.ReactNode }) => (
  <div className='mb-2 flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2'>
    {children}
  </div>
);

export const SVGFileInfo = ({ children }: { children: React.ReactNode }) => (
  <div className='flex items-center gap-2'>{children}</div>
);

export const SVGFileName = ({ children }: { children: React.ReactNode }) => (
  <span className='text-sm font-medium text-foreground'>{children}</span>
);

export const SVGFileSize = ({ children }: { children: React.ReactNode }) => (
  <span className='text-xs text-muted-foreground'>{children}</span>
);

export const SVGRemoveButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
}) => (
  <button
    onClick={onClick}
    className='rounded-sm bg-destructive px-2 py-1 text-xs text-white transition-all hover:opacity-90'
  >
    {children}
  </button>
);

export const SVGPreview = ({ children }: { children: React.ReactNode }) => (
  <div className='group relative mx-auto my-4 h-[200px] w-[200px] shrink-0 overflow-hidden rounded-lg border-2 border-border bg-muted transition-all hover:-translate-y-0.5 hover:border-[#FF7B5A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]'>
    {children}
  </div>
);

export const SVGPreviewContent = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className='flex h-full w-full items-center justify-center bg-muted'>
    {children}
  </div>
);

export const SVGPreviewImg = ({ children }: { children: React.ReactNode }) => (
  <div className='flex h-full w-full items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:w-auto [&>svg]:h-auto [&>img]:max-h-full [&>img]:max-w-full'>
    {children}
  </div>
);

export const SVGPreviewOverlay = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
    {children}
  </div>
);

export const SVGPreviewActions = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className='flex flex-col items-center gap-2'>{children}</div>;

export const SVGLoadingSpinner = () => (
  <div className='h-8 w-8 animate-spin rounded-full border-2 border-border border-t-[#FF7B5A]' />
);

const VALIDATION_CLASS: Record<'error' | 'warning' | 'success', string> = {
  error: 'bg-destructive/20 text-destructive border border-destructive/40',
  warning: 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/40',
  success: 'bg-green-500/20 text-green-600 border border-green-500/40',
};

export const SVGValidationMessage = ({
  type,
  children,
}: {
  type: 'error' | 'warning' | 'success';
  children: React.ReactNode;
}) => (
  <div
    className={cn('mt-2 rounded-lg px-3 py-2 text-sm', VALIDATION_CLASS[type])}
  >
    {children}
  </div>
);

export const SVGClearButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
}) => (
  <button
    onClick={onClick}
    className='rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:border-muted-foreground'
  >
    {children}
  </button>
);
