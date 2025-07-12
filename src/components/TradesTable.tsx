import React, { useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Table2, TrendingUp, Clock, DollarSign, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BinanceTrade, SortField } from '../types/binance';
import { useSort } from '../hooks/useSort';
import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';
import { PAGINATION_CONFIG } from '../constants/config';

interface TradesTableProps {
  trades: BinanceTrade[];
  symbol: string;
  pageSize?: number;
  showPagination?: boolean;
  onPageSizeChange?: (newPageSize: number) => void;
}

const TradesTable: React.FC<TradesTableProps> = ({ 
  trades, 
  symbol, 
  pageSize = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, 
  showPagination = true,
  onPageSizeChange 
}) => {
  const { t } = useTranslation();
  const { sortedData, sortConfig, handleSort } = useSort(trades);
  
  const {
    paginationConfig,
    paginatedIndices,
    goToPage,
  } = usePagination({
    totalItems: sortedData.length,
    pageSize,
  });

  const paginatedTrades = useMemo(() => {
    if (!showPagination) return sortedData;
    return sortedData.slice(paginatedIndices.startIndex, paginatedIndices.endIndex);
  }, [sortedData, paginatedIndices, showPagination]);

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Table2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('table.recentTrades')}
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
          {t('table.noData')}
        </div>
      </div>
    );
  }

  const formatPrice = (price: string): string => {
    return parseFloat(price).toFixed(4);
  };

  const formatQuantity = (qty: string): string => {
    return parseFloat(qty).toFixed(6);
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-3 h-3" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-3 h-3" /> : 
      <ArrowDown className="w-3 h-3" />;
  };

  const getSortButtonClass = (field: SortField) => {
    const isActive = sortConfig.field === field;
    return `flex items-center space-x-1 text-xs font-medium transition-colors ${
      isActive 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    }`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Table2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('table.recentTrades', { symbol })}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('table.showing', { total: sortedData.length })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{t('table.totalTrades')}: {sortedData.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('time')}
                  className={getSortButtonClass('time') + ' focus:outline-none'}
                >
                  <Clock className="w-4 h-4" />
                  <span>{t('table.time')}</span>
                  {getSortIcon('time')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('price')}
                  className={getSortButtonClass('price') + ' focus:outline-none'}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{t('table.price')}</span>
                  {getSortIcon('price')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('qty')}
                  className={getSortButtonClass('qty') + ' focus:outline-none'}
                >
                  <Scale className="w-4 h-4" />
                  <span>{t('table.quantity')}</span>
                  {getSortIcon('qty')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>{t('table.total')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t('table.type')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTrades.map((trade, index) => {
              const isBuy = !trade.isBuyerMaker;
              return (
                <tr key={`${trade.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {formatTime(trade.time)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${formatPrice(trade.price)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {formatQuantity(trade.qty)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    ${parseFloat(trade.quoteQty).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isBuy 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`} />
                      <span className={`font-medium ${
                        isBuy 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-red-700 dark:text-red-400'
                      }`}>
                        {isBuy ? t('table.buy') : t('table.sell')}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {showPagination && sortedData.length > pageSize && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            paginationConfig={paginationConfig}
            onPageChange={goToPage}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default TradesTable;