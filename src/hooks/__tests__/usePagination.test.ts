import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('usePagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default pagination', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, pageSize: 10 }));
    expect(result.current.paginationConfig.currentPage).toBe(1);
    expect(result.current.paginationConfig.pageSize).toBe(10);
    expect(result.current.paginationConfig.totalItems).toBe(100);
    expect(result.current.paginationConfig.totalPages).toBe(10);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, pageSize: 10 }));
    act(() => {
      result.current.goToPage(2);
    });
    expect(result.current.paginationConfig.currentPage).toBe(2);
    expect(result.current.paginatedIndices.startIndex).toBe(10);
    expect(result.current.paginatedIndices.endIndex).toBe(20);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, pageSize: 10 }));
    act(() => {
      result.current.goToPage(3);
      result.current.goToPage(2);
    });
    expect(result.current.paginationConfig.currentPage).toBe(2);
    expect(result.current.paginatedIndices.startIndex).toBe(10);
  });

  it('should handle navigation limits', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, pageSize: 10 }));
    act(() => {
      result.current.goToPage(0); // Should go to page 1
    });
    expect(result.current.paginationConfig.currentPage).toBe(1);
    
    act(() => {
      result.current.goToPage(15); // Should go to page 10 (max)
    });
    expect(result.current.paginationConfig.currentPage).toBe(10);
  });

  it('should handle empty data', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 0, pageSize: 10 }));
    expect(result.current.paginationConfig.totalItems).toBe(0);
    expect(result.current.paginationConfig.totalPages).toBe(0);
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(false);
  });

  it('should provide correct page numbers for small total', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 30, pageSize: 10 }));
    const pageNumbers = result.current.getPageNumbers();
    expect(pageNumbers).toEqual([1, 2, 3]);
  });

  it('should provide correct page numbers for large total', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, pageSize: 10 }));
    const pageNumbers = result.current.getPageNumbers();
    expect(pageNumbers).toEqual([1, 2, 3, -1, 10]);
  });
}); 