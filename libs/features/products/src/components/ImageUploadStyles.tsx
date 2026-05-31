import React from 'react';
import { cn } from '@happy-baby/shared-utils';

export const UploadContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => (
  <div className={cn('mb-4 w-full', className)} {...rest}>
    {children}
  </div>
);

export const UploadZone: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    isDragOver: boolean;
    hasError: boolean;
  }
> = ({ isDragOver, hasError, children, className, ...rest }) => (
  <div
    className={cn(
      'rounded-lg border-2 border-dashed p-6 text-center transition-all',
      hasError
        ? 'border-destructive hover:border-destructive hover:bg-destructive/5'
        : isDragOver
          ? 'border-brand-purple bg-brand-purple/10'
          : 'border-border hover:border-brand-purple hover:bg-brand-purple/10',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const FileInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => (
  <input type='file' className={cn('hidden', className)} ref={ref} {...rest} />
));
FileInput.displayName = 'FileInput';

export const UploadContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('flex flex-col items-center gap-3', className)} {...rest}>
    {children}
  </div>
);

export const UploadIcon: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('mb-2 text-muted-foreground', className)} {...rest}>
    {children}
  </div>
);

export const UploadText: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, className, ...rest }) => (
  <p
    className={cn('m-0 text-base font-medium text-foreground', className)}
    {...rest}
  >
    {children}
  </p>
);

export const UploadSubtext: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, className, ...rest }) => (
  <p className={cn('m-0 text-sm text-muted-foreground', className)} {...rest}>
    {children}
  </p>
);

export const UploadButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...rest }) => (
  <button
    className={cn(
      'cursor-pointer rounded-md bg-brand-purple px-4 py-3 text-sm font-medium text-white transition-all hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-muted disabled:opacity-100',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export const ProgressBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'mt-3 h-1 w-full overflow-hidden rounded-full bg-muted',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const ProgressFill: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { progress: number }
> = ({ progress, className, style, ...rest }) => (
  <div
    className={cn(
      'h-full bg-brand-purple transition-[width] duration-300',
      className
    )}
    style={{ width: `${progress}%`, ...style }}
    {...rest}
  />
);

export const ProgressText: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, className, ...rest }) => (
  <p className={cn('mt-2 text-sm text-muted-foreground', className)} {...rest}>
    {children}
  </p>
);

export const ErrorMessage: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, className, ...rest }) => (
  <p
    className={cn('mt-2 text-center text-sm text-destructive', className)}
    {...rest}
  >
    {children}
  </p>
);

export const FileList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('mt-4 w-full', className)} {...rest}>
    {children}
  </div>
);

export const FileItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'mb-2 flex items-center justify-between rounded-md bg-muted px-3 py-2',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const FileInfo: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div className={cn('flex items-center gap-2', className)} {...rest}>
    {children}
  </div>
);

export const FileName: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className,
  ...rest
}) => (
  <span
    className={cn('text-sm font-medium text-foreground', className)}
    {...rest}
  >
    {children}
  </span>
);

export const FileSize: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className,
  ...rest
}) => (
  <span className={cn('text-xs text-muted-foreground', className)} {...rest}>
    {children}
  </span>
);

export const RemoveButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...rest }) => (
  <button
    className={cn(
      'cursor-pointer rounded-sm bg-destructive px-2 py-1 text-xs text-white transition-all hover:opacity-90',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export const ImagePreview: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cn(
      'group relative h-[180px] w-[140px] shrink-0 overflow-hidden rounded-md border-2 border-border bg-muted transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const ImagePreviewImg: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = ({ className, ...rest }) => (
  <img
    className={cn(
      'h-full w-full bg-muted object-contain object-center',
      className
    )}
    {...rest}
  />
);

export const ImagePreviewOverlay: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => (
  <div
    className={cn(
      'absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const ImagePreviewActions: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => (
  <div className={cn('flex flex-col items-center gap-2', className)} {...rest}>
    {children}
  </div>
);

export const SpinnerAnimation: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...rest }) => (
  <div
    className={cn(
      'h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-brand-purple',
      className
    )}
    {...rest}
  />
);
