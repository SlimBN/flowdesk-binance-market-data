import { binanceApiService } from '../binanceApi';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock axios completely
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

describe('binanceApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be properly initialized', () => {
    expect(binanceApiService).toBeDefined();
    expect(typeof binanceApiService.getMarketData).toBe('function');
    expect(typeof binanceApiService.getExchangeInfo).toBe('function');
  });
}); 