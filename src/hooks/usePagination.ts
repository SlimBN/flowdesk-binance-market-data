import { useState, useMemo, useCallback } from 'react';
import type { PaginationConfig } from '../types/binance';

interface UsePaginationProps {
  totalItems: number;
  pageSize: number;
  initialPage?: number;
}

export const usePagination = ({
  totalItems,
  pageSize,
  initialPage = 1,
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationConfig = useMemo((): PaginationConfig => {
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };
  }, [currentPage, pageSize, totalItems]);

  const paginatedIndices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    return { startIndex, endIndex };
  }, [currentPage, pageSize, totalItems]);

  const goToPage = useCallback((page: number) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalItems, pageSize]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    goToPage(totalPages);
  }, [totalItems, pageSize, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const canGoNext = currentPage < paginationConfig.totalPages;
  const canGoPrevious = currentPage > 1;

  const getPageNumbers = useCallback(() => {
    const totalPages = paginationConfig.totalPages;
    const pages: number[] = [];
    const maxVisible = 7; // Show max 7 page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push(-1); // -1 represents ellipsis
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push(-1); // ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, paginationConfig.totalPages]);

  return {
    paginationConfig,
    paginatedIndices,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    resetPagination,
    canGoNext,
    canGoPrevious,
    getPageNumbers,
  };
};