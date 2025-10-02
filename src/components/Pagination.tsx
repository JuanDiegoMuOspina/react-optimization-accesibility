import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
}) => {
  const { t } = useTranslation();

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <div
        onClick={() => hasPrev && onPageChange(currentPage - 1)}
        className={`px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer ${!hasPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {t('paginationPrevious')}
      </div>

      {getVisiblePages().map((page, index) =>
        typeof page === 'string' ? (
          <span key={index} className="px-3 py-2 text-gray-500">
            {page}
          </span>
        ) : (
          <div
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </div>
        )
      )}

      <div
        onClick={() => hasNext && onPageChange(currentPage + 1)}
        className={`px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {t('paginationNext')}
      </div>
    </div>
  );
};

export default Pagination;