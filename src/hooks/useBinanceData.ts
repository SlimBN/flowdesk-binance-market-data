import { useState, useCallback } from 'react';
import type { MarketDataResponse, BinanceHistoricalTrades, TradeDataConfig } from '../types/binance';
import binanceApiService from '../services/binanceApi';
import { Logger } from '../utils/logger';

interface UseBinanceDataState {
  data: MarketDataResponse | null;
  historicalTrades: BinanceHistoricalTrades | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useBinanceData = () => {
  const [state, setState] = useState<UseBinanceDataState>({
    data: null,
    historicalTrades: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchMarketData = useCallback(async (symbol: string) => {
    if (!symbol) {
      Logger.warn('fetchMarketData called with empty symbol');
      return;
    }

    Logger.info(`Fetching market data for symbol: ${symbol}`);
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [marketData, historicalTrades] = await Promise.all([
        binanceApiService.getMarketData(symbol),
        binanceApiService.getComprehensive24hTrades(symbol),
      ]);

      Logger.info(`Successfully fetched market data for ${symbol}`, {
        tradesCount: historicalTrades.trades.length,
        lastUpdated: new Date().toISOString()
      });

      setState({
        data: marketData,
        historicalTrades,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch market data';
      Logger.error(`Failed to fetch market data for ${symbol}:`, error instanceof Error ? error : new Error(errorMessage), { symbol });
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        lastUpdated: null,
      }));
    }
  }, []);

  const fetchHistoricalTrades = useCallback(async (symbol: string, config: TradeDataConfig) => {
    if (!symbol) {
      Logger.warn('fetchHistoricalTrades called with empty symbol');
      return;
    }

    Logger.info(`Fetching historical trades for symbol: ${symbol}`, { config });
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const historicalTrades = await binanceApiService.getHistoricalTrades(symbol, config);
      
      Logger.info(`Successfully fetched historical trades for ${symbol}`, {
        tradesCount: historicalTrades.trades.length,
        config
      });

      setState(prev => ({
        ...prev,
        historicalTrades,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch historical trades';
      Logger.error(`Failed to fetch historical trades for ${symbol}:`, error instanceof Error ? error : new Error(errorMessage), { symbol, config });
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
      }));
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (state.data?.symbol) {
      Logger.info(`Refreshing data for symbol: ${state.data.symbol}`);
      await fetchMarketData(state.data.symbol);
    } else {
      Logger.warn('refreshData called but no symbol is available');
    }
  }, [state.data?.symbol, fetchMarketData]);

  const clearData = useCallback(() => {
    Logger.info('Clearing market data');
    setState({
      data: null,
      historicalTrades: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }, []);

  return {
    ...state,
    fetchMarketData,
    fetchHistoricalTrades,
    refreshData,
    clearData,
  };
};

