import { useState, useEffect } from 'react';
import { binanceApiService } from '../services/binanceApi';
import { Logger } from '../utils/logger';
import type { BinanceExchangeInfo, BinanceSymbol } from '../types/binance';

export interface UseExchangeInfoReturn {
  exchangeInfo: BinanceExchangeInfo | null;
  availablePairs: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useExchangeInfo = (): UseExchangeInfoReturn => {
  const [exchangeInfo, setExchangeInfo] = useState<BinanceExchangeInfo | null>(null);
  const [availablePairs, setAvailablePairs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExchangeInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      Logger.info('Fetching exchange info and ticker prices');
      
      const [info, allTickerPrices] = await Promise.all([
        binanceApiService.getExchangeInfo(),
        binanceApiService.getAllTickerPrices(),
      ]);
      setExchangeInfo(info);
      
      const availableTickerSymbols = new Set(allTickerPrices.map(t => t.symbol));
      
      const pairs = info.symbols
        .filter((symbol: BinanceSymbol) => 
          symbol.status === 'TRADING' && 
          symbol.isSpotTradingAllowed &&
          symbol.quoteAsset === 'USDT' &&
          availableTickerSymbols.has(symbol.symbol)
        )
        .map((symbol: BinanceSymbol) => symbol.symbol)
        .sort((a: string, b: string) => a.localeCompare(b));
      
      Logger.info('Successfully processed exchange info', {
        totalSymbols: info.symbols.length,
        availableTickers: allTickerPrices.length,
        filteredPairs: pairs.length
      });
      
      setAvailablePairs(pairs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange info';
      Logger.error('Failed to fetch exchange info:', err instanceof Error ? err : new Error(errorMessage));
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeInfo();
  }, []);

  return {
    exchangeInfo,
    availablePairs,
    loading,
    error,
    refetch: fetchExchangeInfo,
  };
};