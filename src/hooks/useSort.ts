import { useState, useMemo } from 'react';
import type { SortConfig, SortField, BinanceTrade } from '../types/binance';

export const useSort = (data: BinanceTrade[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'time',
    direction: 'desc',
  });

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sorted = [...data].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortConfig.field) {
        case 'time':
          aValue = a.time;
          bValue = b.time;
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'qty':
          aValue = parseFloat(a.qty);
          bValue = parseFloat(b.qty);
          break;
        default:
          return 0;
      }

      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
};