'use client';

import Link from 'next/link';

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={currentPage > 1 ? `/?page=${currentPage - 1}` : '#'}
        className={`rounded-lg bg-white px-4 py-2 font-medium text-zinc-900 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
        }`}
      >
        ← Prev
      </Link>

      <div className="flex gap-1">
        {pageNumbers.map((pageNum, idx) => {
          if (pageNum === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-3 py-2 text-zinc-600 dark:text-zinc-400"
              >
                ...
              </span>
            );
          }

          const isActive = pageNum === currentPage;
          return (
            <Link
              key={pageNum}
              href={`/?page=${pageNum}`}
              className={`rounded-lg px-4 py-2 font-medium shadow-sm transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-white text-zinc-900 border-zinc-200 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      <Link
        href={currentPage < totalPages ? `/?page=${currentPage + 1}` : '#'}
        className={`rounded-lg bg-white px-4 py-2 font-medium text-zinc-900 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 ${
          currentPage >= totalPages ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
        }`}
      >
        Next →
      </Link>
    </div>
  );
}
