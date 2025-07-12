/**
 * Simple logger utility for better error handling
 */
export class Logger {
  private static isDevelopment = import.meta.env.MODE === 'development';

  static error(message: string, error?: Error, extra?: unknown): void {
    if (this.isDevelopment) {
      console.error(message, error, extra);
    } else {
      // In production, you might want to send to a logging service
      // For now, we'll just log to console in development
      console.error(message, error);
    }
  }

  static warn(message: string, extra?: unknown): void {
    if (this.isDevelopment) {
      console.warn(message, extra);
    }
  }

  static info(message: string, extra?: unknown): void {
    if (this.isDevelopment) {
      console.info(message, extra);
    }
  }

  static debug(message: string, extra?: unknown): void {
    if (this.isDevelopment) {
      console.debug(message, extra);
    }
  }
}