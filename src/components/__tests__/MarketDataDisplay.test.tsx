import React from 'react';
import { render, screen } from '@testing-library/react';
import MarketDataDisplay from '../MarketDataDisplay';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockData = {
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

describe('MarketDataDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render market data when available', () => {
    render(<MarketDataDisplay data={mockData} loading={false} error={null} />);
    expect(screen.getByText('marketData.title')).toBeInTheDocument();
    expect(screen.getByText('$50000.0000')).toBeInTheDocument();
    expect(screen.getByText('+$1000.0000 (+2.50%)')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<MarketDataDisplay data={null} loading={true} error={null} />);

    const shimmerElements = document.querySelectorAll('.shimmer');
    expect(shimmerElements.length).toBeGreaterThan(0);
  });

  it('should show error state', () => {
    render(<MarketDataDisplay data={null} loading={false} error="API Error" />);
    expect(screen.getByText('marketData.errorLoading')).toBeInTheDocument();
  });

  it('should display price change with correct styling for positive change', () => {
    render(<MarketDataDisplay data={mockData} loading={false} error={null} />);
    const priceChangeElement = screen.getByText('+$1000.0000 (+2.50%)');
    expect(priceChangeElement).toHaveClass('text-green-600');
  });

  it('should display price change with correct styling for negative change', () => {
    const negativeData = {
      ...mockData,
      ticker24hr: {
        ...mockData.ticker24hr,
        priceChangePercent: '-1.5',
        priceChange: '-750.00',
      },
    };
    render(<MarketDataDisplay data={negativeData} loading={false} error={null} />);
    const priceChangeElement = screen.getByText('$-750.0000 (-1.50%)');
    expect(priceChangeElement).toHaveClass('text-red-600');
  });
}); 