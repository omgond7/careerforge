type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  userId?: string;
}

export const logger = {
  info: (message: string, data?: unknown, userId?: string) => log('info', message, data, userId),
  warn: (message: string, data?: unknown, userId?: string) => log('warn', message, data, userId),
  error: (message: string, data?: unknown, userId?: string) => log('error', message, data, userId),
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') log('debug', message, data);
  },
};

function log(level: LogLevel, message: string, data?: unknown, userId?: string) {
  const entry: LogEntry = { level, message, data, timestamp: new Date().toISOString(), userId };
  const output = JSON.stringify(entry);
  if (level === 'error') console.error(output);
  else if (level === 'warn') console.warn(output);
  else console.log(output);
}
