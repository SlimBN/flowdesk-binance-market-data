import React, { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useExchangeInfo } from '../hooks/useExchangeInfo';

interface CurrencyPairSelectorProps {
  onSubmit: (symbol: string) => void;
  loading?: boolean;
}

const CurrencyPairSelector: React.FC<CurrencyPairSelectorProps> = ({ onSubmit, loading = false }) => {
  const { t } = useTranslation();
  const [selectedPair, setSelectedPair] = useState('');
  const { availablePairs, loading: pairsLoading, error: pairsError } = useExchangeInfo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPair) {
      onSubmit(selectedPair);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('currencySelector.title')}
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
            {t('currencySelector.subtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Trading Pairs Selection */}
        <div className="space-y-2">
          <label className="text-base font-medium text-gray-700 dark:text-gray-300">
            {t('currencySelector.availablePairs', 'Available Trading Pairs')}
          </label>
          {pairsError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {t('currencySelector.errorLoadingPairs', { error: pairsError })}
              </span>
            </div>
          )}
          <select
            value={selectedPair}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPair(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 transition-colors duration-200"
            disabled={pairsLoading || !!pairsError}
          >
            <option value="">{t('currencySelector.selectPlaceholder')}</option>
            {availablePairs.map(symbol => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          {pairsLoading && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
              <span>{t('loading.pairs')}</span>
            </div>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedPair || pairsLoading || !!pairsError}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 text-white font-semibold text-base py-3 transition-colors duration-200"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t('currencySelector.fetchingData')}</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              <span>{t('currencySelector.getMarketData')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CurrencyPairSelector;