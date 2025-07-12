export interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: Array<{
    filterType: string;
    minPrice?: string;
    maxPrice?: string;
    tickSize?: string;
    minQty?: string;
    maxQty?: string;
    stepSize?: string;
    minNotional?: string;
    applyToMarket?: boolean;
    avgPriceMins?: number;
    multiplierUp?: string;
    multiplierDown?: string;
    multiplierDecimal?: number;
  }>;
  permissions: string[];
  defaultSelfTradePreventionMode: string;
  allowedSelfTradePreventionModes: string[];
}

export interface BinanceExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: Array<{
    rateLimitType: string;
    interval: string;
    intervalNum: number;
    limit: number;
  }>;
  exchangeFilters: Array<{
    filterType: string;
    maxNumOrders?: number;
    maxNumAlgoOrders?: number;
  }>;
  symbols: BinanceSymbol[];
}

export interface BinanceTickerPrice {
  symbol: string;
  price: string;
}

export interface Binance24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceTrade {
  id: string;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export interface MarketDataResponse {
  symbol: string;
  ticker: BinanceTickerPrice;
  ticker24hr: Binance24hrTicker;
  recentTrades: BinanceTrade[];
}

export interface ApiError {
  code: number;
  msg: string;
}

export type SortField = 'time' | 'price' | 'qty';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface TradeFilters {
  timeRange: {
    start: Date | null;
    end: Date | null;
  };
  priceRange: {
    min: number | null;
    max: number | null;
  };
  quantityRange: {
    min: number | null;
    max: number | null;
  };
  tradeType: 'all' | 'buy' | 'sell';
}

export interface ChartDataPoint {
  time: string;
  price: number;
  quantity: number;
  volume: number;
  isBuy: boolean;
}

export type ChartType = 'price' | 'volume' | 'quantity';
export type Timeframe = '1m' | '5m' | '15m' | '1h' | 'all';
export type ScaleType = 'linear' | 'log';

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ChartScaleConfig {
  yScale: ScaleType;
  yDomain: [number | 'auto', number | 'auto'];
  xDomain: [string | 'auto', string | 'auto'];
}

export interface BinanceHistoricalTrades {
  trades: BinanceTrade[];
  total: number;
  hasMore: boolean;
}

export interface TradeDataConfig {
  timeRange: '24h' | 'custom';
  startTime?: number;
  endTime?: number;
  limit: number;
}