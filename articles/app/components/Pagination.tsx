'use client';

import Link from 'next/link';

export default function Pagination({
  currentPage,
  hasMore,
}: {
  currentPage: number;
  hasMore: boolean;
}) {
  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <Link
        href={currentPage > 1 ? `/?page=${currentPage - 1}` : '#'}
        className={`rounded-lg bg-white px-6 py-3 font-medium text-zinc-900 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
        }`}
      >
        ← Previous
      </Link>
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Page {currentPage}
      </span>
      <Link
        href={hasMore ? `/?page=${currentPage + 1}` : '#'}
        className={`rounded-lg bg-white px-6 py-3 font-medium text-zinc-900 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 ${
          !hasMore ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
        }`}
      >
        Next →
      </Link>
    </div>
  );
}
