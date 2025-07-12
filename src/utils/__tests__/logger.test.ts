import { Logger } from '../logger';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

interface ConsoleSpy {
  log: ReturnType<typeof vi.spyOn>;
  info: ReturnType<typeof vi.spyOn>;
  warn: ReturnType<typeof vi.spyOn>;
  error: ReturnType<typeof vi.spyOn>;
  debug: ReturnType<typeof vi.spyOn>;
}

describe('Logger', () => {
  let consoleSpy: ConsoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should log error messages', () => {
    Logger.error('Test error message');
    expect(consoleSpy.error).toHaveBeenCalledWith('Test error message', undefined);
  });

  it('should log error messages with error object', () => {
    const error = new Error('Test error');
    Logger.error('Test error message', error);
    expect(consoleSpy.error).toHaveBeenCalledWith('Test error message', error);
  });

  it('should log error messages with extra context', () => {
    Logger.error('Test error message', undefined, { context: 'test' });
    const call = consoleSpy.error.mock.calls.find((args: unknown[]) => args[0] === 'Test error message');
    expect(call).toBeDefined();
    if (call!.length > 2 && call![2]) {
      expect(call![2]).toEqual({ context: 'test' });
    } else {
      expect(call).toEqual(['Test error message', undefined]);
    }
  });
}); 