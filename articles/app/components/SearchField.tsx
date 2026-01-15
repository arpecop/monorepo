'use client';

import { useState } from 'react';

interface SearchFieldProps {
  onSearch: (query: string) => void;
}

export default function SearchField({ onSearch }: SearchFieldProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search articles by title..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pl-11 text-zinc-900 placeholder-zinc-500 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-zinc-400 dark:text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
