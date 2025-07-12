export const API_CONFIG = {
  BASE_URL: 'https://api.binance.com/api/v3',
  TIMEOUT: 10000,
} as const;

export const API_LIMITS = {
  DEFAULT_RECENT_TRADES: 100,
  MAX_TRADES: 1000,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5,
} as const;

export const TIME_CONSTANTS = {
  TWENTY_FOUR_HOURS_MS: 24 * 60 * 60 * 1000,
  ONE_HOUR_MS: 60 * 60 * 1000,
  ONE_MINUTE_MS: 60 * 1000,
} as const;

export const CHART_CONFIG = {
  MARGIN_PERCENT: 0.05,
  DEFAULT_HEIGHT: '400px',
  ANIMATION_DURATION: 300,
} as const;

export const BUILD_CONFIG = {
  CHUNK_SIZE_WARNING_LIMIT: 1000,
} as const;