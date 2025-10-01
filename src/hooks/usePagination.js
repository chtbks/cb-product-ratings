import { useState, useMemo } from 'react';

export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    return {
      currentItems,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, data.length),
      totalItems: data.length
    };
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (paginationData.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    ...paginationData,
    goToPage,
    nextPage,
    prevPage,
    resetPagination
  };
};
