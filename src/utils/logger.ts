type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;
const logLevel =
  (import.meta.env.VITE_LOG_LEVEL as LogLevel | undefined) ?? 'warn';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const shouldLog = (level: LogLevel): boolean =>
  isDev || LEVELS[level] >= LEVELS[logLevel];

export const logger = {
  debug: (message: string, ...args: unknown[]): void => {
    if (shouldLog('debug')) console.debug(`[debug] ${message}`, ...args);
  },
  info: (message: string, ...args: unknown[]): void => {
    if (shouldLog('info')) console.info(`[info] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    if (shouldLog('warn')) console.warn(`[warn] ${message}`, ...args);
  },
  error: (message: string, error?: unknown, ...args: unknown[]): void => {
    if (shouldLog('error')) console.error(`[error] ${message}`, error, ...args);
  },
};
