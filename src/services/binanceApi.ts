import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  BinanceExchangeInfo,
  BinanceTickerPrice,
  Binance24hrTicker,
  BinanceTrade,
  MarketDataResponse,
  ApiError,
  BinanceHistoricalTrades,
  TradeDataConfig,
} from '../types/binance';
import { API_CONFIG, API_LIMITS, TIME_CONSTANTS } from '../constants/config';
import { Logger } from '../utils/logger';

interface BinanceAggTrade {
  a: number;
  p: string;
  q: string;
  T: number;
  m: boolean;
}

class BinanceApiService {
  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data) {
          const apiError: ApiError = error.response.data;
          throw new Error(`Binance API Error: ${apiError.msg} (Code: ${apiError.code})`);
        }
        
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - please try again');
        }
        
        if (error.request) {
          throw new Error('Network error - please check your connection');
        }
        
        throw new Error('An unexpected error occurred');
      }
    );
  }

  async getExchangeInfo(): Promise<BinanceExchangeInfo> {
    try {
      Logger.info('Fetching exchange info');
      const response: AxiosResponse<BinanceExchangeInfo> = await this.axiosInstance.get('/exchangeInfo');
      Logger.info('Successfully fetched exchange info', { symbolsCount: response.data.symbols.length });
      return response.data;
    } catch (error) {
      Logger.error('Failed to fetch exchange info:', error instanceof Error ? error : new Error('Unknown error'));
      throw this.handleApiError(error);
    }
  }

  async getTickerPrice(symbol: string): Promise<BinanceTickerPrice> {
    try {
      Logger.debug(`Fetching ticker price for ${symbol}`);
      const response: AxiosResponse<BinanceTickerPrice> = await this.axiosInstance.get('/ticker/price', {
        params: { symbol: symbol.toUpperCase() },
      });
      return response.data;
    } catch (error) {
      Logger.error(`Failed to fetch ticker price for ${symbol}:`, error instanceof Error ? error : new Error('Unknown error'));
      throw this.handleApiError(error);
    }
  }

  async getAllTickerPrices(): Promise<BinanceTickerPrice[]> {
    try {
      Logger.info('Fetching all ticker prices');
      const response: AxiosResponse<BinanceTickerPrice[]> = await this.axiosInstance.get('/ticker/price');
      Logger.info('Successfully fetched all ticker prices', { count: response.data.length });
      return response.data;
    } catch (error) {
      Logger.error('Failed to fetch all ticker prices:', error instanceof Error ? error : new Error('Unknown error'));
      throw this.handleApiError(error);
    }
  }

  async get24hrTicker(symbol: string): Promise<Binance24hrTicker> {
    try {
      Logger.debug(`Fetching 24hr ticker for ${symbol}`);
      const response: AxiosResponse<Binance24hrTicker> = await this.axiosInstance.get('/ticker/24hr', {
        params: { symbol: symbol.toUpperCase() },
      });
      return response.data;
    } catch (error) {
      Logger.error(`Failed to fetch 24hr ticker for ${symbol}:`, error instanceof Error ? error : new Error('Unknown error'));
      throw this.handleApiError(error);
    }
  }

  async getRecentTrades(symbol: string, limit: number = API_LIMITS.DEFAULT_RECENT_TRADES): Promise<BinanceTrade[]> {
    try {
      Logger.debug(`Fetching recent trades for ${symbol}`, { limit });
      const response: AxiosResponse<BinanceTrade[]> = await this.axiosInstance.get('/trades', {
        params: { 
          symbol: symbol.toUpperCase(),
          limit: Math.min(limit, API_LIMITS.MAX_TRADES),
        },
      });
      return response.data;
    } catch (error) {
      Logger.error(`Failed to fetch recent trades for ${symbol}:`, error instanceof Error ? error : new Error('Unknown error'));
      throw this.handleApiError(error);
    }
  }

  async getHistoricalTrades(symbol: string, config: TradeDataConfig): Promise<BinanceHistoricalTrades> {
    try {
      const now = Date.now();
      const twentyFourHoursAgo = now - TIME_CONSTANTS.TWENTY_FOUR_HOURS_MS;
      
      const params: Record<string, string | number> = {
        symbol: symbol.toUpperCase(),
        limit: Math.min(config.limit, API_LIMITS.MAX_TRADES),
      };

      if (config.timeRange === '24h') {
        params.startTime = twentyFourHoursAgo;
        params.endTime = now;
      } else if (config.timeRange === 'custom' && config.startTime && config.endTime) {
        params.startTime = config.startTime;
        params.endTime = config.endTime;
      }

      const response: AxiosResponse<BinanceAggTrade[]> = await this.axiosInstance.get('/aggTrades', {
        params,
      });

      const trades = this.transformAggTradesToBinanceTrades(response.data);
      trades.sort((a, b) => b.time - a.time);

      return {
        trades,
        total: trades.length,
        hasMore: trades.length === config.limit,
      };
    } catch (error) {
      try {
        const fallbackTrades = await this.getRecentTrades(symbol, config.limit);
        return {
          trades: fallbackTrades,
          total: fallbackTrades.length,
          hasMore: false,
        };
      } catch {
        throw this.handleApiError(error);
      }
    }
  }

  async getComprehensive24hTrades(symbol: string): Promise<BinanceHistoricalTrades> {
    try {
      const now = Date.now();
      const twentyFourHoursAgo = now - TIME_CONSTANTS.TWENTY_FOUR_HOURS_MS;
      
      const params: Record<string, string | number> = {
        symbol: symbol.toUpperCase(),
        startTime: twentyFourHoursAgo,
        endTime: now,
        limit: API_LIMITS.MAX_TRADES,
      };

      const response: AxiosResponse<BinanceAggTrade[]> = await this.axiosInstance.get('/aggTrades', {
        params,
      });

      const trades = this.transformAggTradesToBinanceTrades(response.data);
      trades.sort((a, b) => b.time - a.time);

      return {
        trades,
        total: trades.length,
        hasMore: trades.length === API_LIMITS.MAX_TRADES,
      };
    } catch {
      return this.getHistoricalTrades(symbol, {
        timeRange: '24h',
        limit: API_LIMITS.MAX_TRADES,
      });
    }
  }

  async getMarketData(symbol: string): Promise<MarketDataResponse> {
    try {
      const [ticker, ticker24hr, recentTrades] = await Promise.all([
        this.getTickerPrice(symbol),
        this.get24hrTicker(symbol),
        this.getRecentTrades(symbol, API_LIMITS.DEFAULT_RECENT_TRADES),
      ]);

      return {
        symbol: symbol.toUpperCase(),
        ticker,
        ticker24hr,
        recentTrades,
      };
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  private transformAggTradesToBinanceTrades(aggTrades: BinanceAggTrade[]): BinanceTrade[] {
    return aggTrades.map((aggTrade) => ({
      id: aggTrade.a.toString(),
      price: aggTrade.p,
      qty: aggTrade.q,
      quoteQty: (parseFloat(aggTrade.p) * parseFloat(aggTrade.q)).toString(),
      time: aggTrade.T,
      isBuyerMaker: !aggTrade.m,
      isBestMatch: true,
    }));
  }

  private handleApiError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unexpected error occurred while fetching data');
  }
}

export const binanceApiService = new BinanceApiService();
export default binanceApiService;