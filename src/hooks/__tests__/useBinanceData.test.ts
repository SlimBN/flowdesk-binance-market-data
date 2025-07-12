import { renderHook, act } from '@testing-library/react';
import { useBinanceData } from '../useBinanceData';
import binanceApiService from '../../services/binanceApi';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockMarketData = {
  symbol: 'BTCUSDT',
  ticker: { symbol: 'BTCUSDT', price: '50000.00' },
  ticker24hr: {
    symbol: 'BTCUSDT',
    priceChange: '1000.00',
    priceChangePercent: '2.5',
    weightedAvgPrice: '49500.00',
    prevClosePrice: '49000.00',
    lastPrice: '50000.00',
    lastQty: '0.1',
    bidPrice: '49990.00',
    bidQty: '0.5',
    askPrice: '50010.00',
    askQty: '0.3',
    openPrice: '49000.00',
    highPrice: '51000.00',
    lowPrice: '48000.00',
    volume: '1000',
    quoteVolume: '50000000',
    openTime: 0,
    closeTime: 0,
    firstId: 1,
    lastId: 2,
    count: 2,
  },
  recentTrades: [],
};

const mockHistoricalTrades = { trades: [], total: 0, hasMore: false };

describe('useBinanceData', () => {
  beforeEach(() => {
    vi.spyOn(binanceApiService, 'getMarketData').mockResolvedValue(mockMarketData);
    vi.spyOn(binanceApiService, 'getComprehensive24hTrades').mockResolvedValue(mockHistoricalTrades);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch market data and update state', async () => {
    const { result } = renderHook(() => useBinanceData());
    await act(async () => {
      await result.current.fetchMarketData('BTCUSDT');
    });
    expect(result.current.data).toEqual(mockMarketData);
    expect(result.current.historicalTrades).toEqual(mockHistoricalTrades);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    vi.spyOn(binanceApiService, 'getMarketData').mockRejectedValue(new Error('API error'));
    const { result } = renderHook(() => useBinanceData());
    await act(async () => {
      await result.current.fetchMarketData('BTCUSDT');
    });
    expect(result.current.error).toBe('API error');
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
  });
}); 