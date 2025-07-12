import { renderHook, act } from '@testing-library/react';
import { useExchangeInfo } from '../useExchangeInfo';
import { binanceApiService } from '../../services/binanceApi';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockExchangeInfo = {
  timezone: 'UTC',
  serverTime: Date.now(),
  rateLimits: [],
  exchangeFilters: [],
  symbols: [
    {
      symbol: 'BTCUSDT',
      status: 'TRADING',
      baseAsset: 'BTC',
      baseAssetPrecision: 8,
      quoteAsset: 'USDT',
      quotePrecision: 8,
      quoteAssetPrecision: 8,
      baseCommissionPrecision: 8,
      quoteCommissionPrecision: 8,
      orderTypes: ['LIMIT', 'MARKET'],
      icebergAllowed: true,
      ocoAllowed: true,
      quoteOrderQtyMarketAllowed: true,
      allowTrailingStop: true,
      cancelReplaceAllowed: true,
      isSpotTradingAllowed: true,
      isMarginTradingAllowed: true,
      filters: [],
      permissions: ['SPOT'],
      defaultSelfTradePreventionMode: 'NONE',
      allowedSelfTradePreventionModes: ['NONE', 'EXPIRE_TAKER', 'EXPIRE_MAKER', 'EXPIRE_BOTH'],
    },
    {
      symbol: 'ETHUSDT',
      status: 'TRADING',
      baseAsset: 'ETH',
      baseAssetPrecision: 8,
      quoteAsset: 'USDT',
      quotePrecision: 8,
      quoteAssetPrecision: 8,
      baseCommissionPrecision: 8,
      quoteCommissionPrecision: 8,
      orderTypes: ['LIMIT', 'MARKET'],
      icebergAllowed: true,
      ocoAllowed: true,
      quoteOrderQtyMarketAllowed: true,
      allowTrailingStop: true,
      cancelReplaceAllowed: true,
      isSpotTradingAllowed: true,
      isMarginTradingAllowed: true,
      filters: [],
      permissions: ['SPOT'],
      defaultSelfTradePreventionMode: 'NONE',
      allowedSelfTradePreventionModes: ['NONE', 'EXPIRE_TAKER', 'EXPIRE_MAKER', 'EXPIRE_BOTH'],
    },
  ],
};

const mockTickerPrices = [
  { symbol: 'BTCUSDT', price: '50000.00' },
  { symbol: 'ETHUSDT', price: '3000.00' },
];

describe('useExchangeInfo', () => {
  beforeEach(() => {
    vi.spyOn(binanceApiService, 'getExchangeInfo').mockResolvedValue(mockExchangeInfo);
    vi.spyOn(binanceApiService, 'getAllTickerPrices').mockResolvedValue(mockTickerPrices);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch exchange info and update state', async () => {
    const { result } = renderHook(() => useExchangeInfo());
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.exchangeInfo).toEqual(mockExchangeInfo);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    vi.spyOn(binanceApiService, 'getExchangeInfo').mockRejectedValue(new Error('API error'));
    const { result } = renderHook(() => useExchangeInfo());
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.error).toBe('API error');
    expect(result.current.loading).toBe(false);
    expect(result.current.exchangeInfo).toBeNull();
  });

  it('should provide available pairs', async () => {
    const { result } = renderHook(() => useExchangeInfo());
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.availablePairs).toEqual(['BTCUSDT', 'ETHUSDT']);
  });
}); 