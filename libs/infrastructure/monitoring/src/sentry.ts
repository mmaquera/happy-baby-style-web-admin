import * as Sentry from '@sentry/react';

let initialized = false;

export const sentryAdapter = {
  init(): void {
    const dsn = import.meta.env['VITE_SENTRY_DSN'] as string | undefined;
    if (!dsn || initialized) return;
    Sentry.init({
      dsn,
      environment:
        (import.meta.env.VITE_MODE as string | undefined) ?? 'production',
      tracesSampleRate: 0.2,
      enabled: !import.meta.env.DEV,
    });
    initialized = true;
  },

  captureException(error: unknown, context?: Record<string, unknown>): void {
    if (!initialized) return;
    Sentry.captureException(error, context ? { extra: context } : undefined);
  },
};
