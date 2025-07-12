import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './contexts/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/ui/Header';
import CurrencyPairSelector from './components/CurrencyPairSelector';
import MarketDataDisplay from './components/MarketDataDisplay';
import TradesTable from './components/TradesTable';
import TradesChart from './components/TradesChart';
import { useBinanceData } from './hooks/useBinanceData';
import { PAGINATION_CONFIG } from './constants/config';
import type { ChartDataPoint, BinanceTrade } from './types/binance';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const { data, historicalTrades, loading, error, fetchMarketData, lastUpdated } = useBinanceData();
  const [currentView, setCurrentView] = useState<'table' | 'chart'>('table');
  const [pageSize, setPageSize] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);
  
  const allTrades = useMemo(() => 
    historicalTrades?.trades || data?.recentTrades || [], 
    [historicalTrades?.trades, data?.recentTrades]
  );

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!allTrades || allTrades.length === 0) return [];
    
    return allTrades.map((trade: BinanceTrade) => ({
      time: new Date(trade.time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      price: parseFloat(trade.price),
      quantity: parseFloat(trade.qty),
      volume: parseFloat(trade.quoteQty),
      isBuy: !trade.isBuyerMaker,
    }));
  }, [allTrades]);

  const handleSymbolSubmit = (symbol: string) => {
    fetchMarketData(symbol);
  };

  const handleRefresh = () => {
    if (data?.symbol) {
      fetchMarketData(data.symbol);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <ErrorBoundary>
        <Header 
          onRefresh={handleRefresh}
          isRefreshing={loading}
          lastUpdated={lastUpdated}
        />
      </ErrorBoundary>
      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        <ErrorBoundary>
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
            <CurrencyPairSelector onSubmit={handleSymbolSubmit} loading={loading} />
          </section>
        </ErrorBoundary>
        {error && (
          <section className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-2xl shadow p-4">
            <div className="flex items-center">
              <div className="text-red-600 dark:text-red-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {t('error.loadingData')}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </section>
        )}
        {data && (
          <div className="flex flex-col gap-8">
            <ErrorBoundary>
                <MarketDataDisplay data={data} loading={loading} error={error} />
            </ErrorBoundary>
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-4">
              <div className="flex justify-center">
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  <button
                    onClick={() => setCurrentView('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      currentView === 'table'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {t('view.tableView')}
                  </button>
                  <button
                    onClick={() => setCurrentView('chart')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      currentView === 'chart'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {t('view.chartView')}
                  </button>
                </div>
              </div>
            </section>
            <ErrorBoundary>
                {currentView === 'table' ? (
                  <TradesTable 
                    trades={allTrades} 
                    symbol={data.symbol} 
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                  />
                ) : (
                  <TradesChart data={chartData} symbol={data.symbol} />
                )}
            </ErrorBoundary>
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;