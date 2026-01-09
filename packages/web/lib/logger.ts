/**
 * Structured logging utility for UI Vault.
 * Only outputs in development mode to prevent sensitive data exposure in production.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === "development";

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

function shouldLog(level: LogLevel): boolean {
  // Always log errors in all environments for monitoring
  if (level === "error") return true;
  // Only log other levels in development
  return isDevelopment;
}

/**
 * Logger utility with structured output.
 * - debug/info/warn: Only output in development
 * - error: Always outputs (for monitoring/debugging production issues)
 */
export const logger = {
  /**
   * Debug level logging - development only
   * Use for detailed debugging information
   */
  debug(message: string, context?: LogContext): void {
    if (shouldLog("debug")) {
      // eslint-disable-next-line no-console
      console.debug(formatMessage("debug", message, context));
    }
  },

  /**
   * Info level logging - development only
   * Use for general operational information
   */
  info(message: string, context?: LogContext): void {
    if (shouldLog("info")) {
      // eslint-disable-next-line no-console
      console.info(formatMessage("info", message, context));
    }
  },

  /**
   * Warning level logging - development only
   * Use for potentially problematic situations
   */
  warn(message: string, context?: LogContext): void {
    if (shouldLog("warn")) {
      // eslint-disable-next-line no-console
      console.warn(formatMessage("warn", message, context));
    }
  },

  /**
   * Error level logging - always outputs
   * Use for error conditions that need attention
   * In production, consider integrating with error monitoring service
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    if (shouldLog("error")) {
      const errorContext = {
        ...context,
        ...(error instanceof Error
          ? { errorMessage: error.message, stack: error.stack }
          : { error }),
      };
      // eslint-disable-next-line no-console
      console.error(formatMessage("error", message, errorContext));
    }
  },
};
