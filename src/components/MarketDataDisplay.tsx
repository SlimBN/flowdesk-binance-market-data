import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { MarketDataResponse } from '../types/binance';
import { MarketDataShimmer } from './ui/Shimmer';

interface MarketDataDisplayProps {
  data: MarketDataResponse | null;
  loading?: boolean;
  error?: string | null;
}

const MarketDataDisplay: React.FC<MarketDataDisplayProps> = ({ data, loading = false, error }) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <div className="p-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-2xl shadow">
        <div className="text-red-700 dark:text-red-300">
          {t('marketData.errorLoading', { error })}
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <MarketDataShimmer />;
  }

  const { symbol, ticker, ticker24hr } = data;
  
  const priceChange = parseFloat(ticker24hr.priceChange);
  const priceChangePercent = parseFloat(ticker24hr.priceChangePercent);
  const isPositive = priceChange >= 0;
  
  const formatNumber = (value: string | number, decimals: number = 2): string => {
    return parseFloat(value.toString()).toFixed(decimals);
  };

  const formatVolume = (value: string): string => {
    const num = parseFloat(value);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const priceCards = [
    {
      label: t('marketData.currentPrice'),
      value: `$${formatNumber(ticker.price, 4)}`,
      icon: DollarSign,
      cardClass: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      iconClass: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      valueClass: 'text-gray-900 dark:text-white',
    },
    {
      label: t('marketData.change24h'),
      value: `${isPositive ? '+' : ''}$${formatNumber(priceChange, 4)} (${isPositive ? '+' : ''}${formatNumber(priceChangePercent, 2)}%)`,
      icon: isPositive ? TrendingUp : TrendingDown,
      cardClass: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      iconClass: isPositive ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
      valueClass: isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    },
    {
      label: t('marketData.high24h'),
      value: `$${formatNumber(ticker24hr.highPrice, 4)}`,
      icon: TrendingUp,
      cardClass: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      iconClass: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      valueClass: 'text-gray-900 dark:text-white',
    },
    {
      label: t('marketData.low24h'),
      value: `$${formatNumber(ticker24hr.lowPrice, 4)}`,
      icon: TrendingDown,
      cardClass: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      iconClass: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      valueClass: 'text-gray-900 dark:text-white',
    },
  ];

  const volumeCards = [
    {
      label: t('marketData.volume24h'),
      value: `${formatVolume(ticker24hr.volume)} ${symbol.replace('USDT', '')}`,
      icon: BarChart3,
    },
    {
      label: t('marketData.volumeUsdt'),
      value: `$${formatVolume(ticker24hr.quoteVolume)}`,
      icon: Activity,
    },
    {
      label: t('marketData.tradeCount'),
      value: ticker24hr.count.toLocaleString(),
      icon: Activity,
    },
    {
      label: t('marketData.weightedAvgPrice'),
      value: `$${formatNumber(ticker24hr.weightedAvgPrice, 4)}`,
      icon: DollarSign,
    },
  ];

  const orderBookCards = [
    {
      label: t('marketData.bidPrice'),
      value: `$${formatNumber(ticker24hr.bidPrice, 4)}`,
      subValue: t('marketData.quantity', { qty: formatNumber(ticker24hr.bidQty, 3) }),
      icon: TrendingDown,
      cardClass: 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700',
      iconClass: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400',
      valueClass: 'text-gray-900 dark:text-white',
      labelClass: 'text-green-700 dark:text-green-300',
    },
    {
      label: t('marketData.askPrice'),
      value: `$${formatNumber(ticker24hr.askPrice, 4)}`,
      subValue: t('marketData.quantity', { qty: formatNumber(ticker24hr.askQty, 3) }),
      icon: TrendingUp,
      cardClass: 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700',
      iconClass: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400',
      valueClass: 'text-gray-900 dark:text-white',
      labelClass: 'text-red-700 dark:text-red-300',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('marketData.title', { symbol })}
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
            {t('marketData.subtitle')}
          </p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </section>

      {/* Price Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {priceCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`border rounded-xl p-6 flex flex-col gap-2 ${card.cardClass}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${card.iconClass}`}><Icon className="w-5 h-5" /></div>
                <span className="text-base text-gray-600 dark:text-gray-400 font-medium">{card.label}</span>
              </div>
              <div className={`text-xl font-bold ${card.valueClass}`}>{card.value}</div>
            </div>
          );
        })}
      </section>

      {/* Volume and Trade Information */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('marketData.tradingActivity')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {volumeCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg"><Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Order Book Information */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('marketData.orderBook')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderBookCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`border rounded-xl p-6 flex flex-col gap-2 ${card.cardClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${card.iconClass}`}><Icon className="w-5 h-5" /></div>
                  <span className={`text-base font-medium ${card.labelClass}`}>{card.label}</span>
                </div>
                <div className={`text-xl font-bold ${card.valueClass}`}>{card.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{card.subValue}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MarketDataDisplay;