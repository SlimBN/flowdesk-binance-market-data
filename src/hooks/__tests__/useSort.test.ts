import { renderHook, act } from '@testing-library/react';
import { useSort } from '../useSort';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockTrades = [
  { id: '1', price: '50000', qty: '0.1', time: 1000, quoteQty: '5000', isBuyerMaker: false, isBestMatch: true },
  { id: '2', price: '51000', qty: '0.2', time: 2000, quoteQty: '10200', isBuyerMaker: true, isBestMatch: true },
  { id: '3', price: '49000', qty: '0.05', time: 500, quoteQty: '2450', isBuyerMaker: false, isBestMatch: true },
];

describe('useSort', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default sort config', () => {
    const { result } = renderHook(() => useSort(mockTrades));
    expect(result.current.sortConfig).toEqual({ field: 'time', direction: 'desc' });
  });

  it('should sort by price in ascending order', () => {
    const { result } = renderHook(() => useSort(mockTrades));
    act(() => {
      result.current.handleSort('price');
    });
    expect(result.current.sortedData[0].price).toBe('49000');
    expect(result.current.sortedData[2].price).toBe('51000');
  });

  it('should sort by time in descending order', () => {
    const { result } = renderHook(() => useSort(mockTrades));
    expect(result.current.sortedData[0].time).toBe(2000);
    expect(result.current.sortedData[2].time).toBe(500);
  });

  it('should toggle sort direction when same field is selected', () => {
    const { result } = renderHook(() => useSort(mockTrades));
    act(() => {
      result.current.handleSort('price');
    });
    expect(result.current.sortConfig).toEqual({ field: 'price', direction: 'asc' });
    
    act(() => {
      result.current.handleSort('price');
    });
    expect(result.current.sortConfig).toEqual({ field: 'price', direction: 'desc' });
  });
}); 