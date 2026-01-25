'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchField from './SearchField';
import Pagination from './Pagination';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { SEARCH_ARTICLES } from '@/lib/queries';

interface Article {
  id: number;
  title: string;
  genid: string;
  text?: string;
}

interface ArticlesListProps {
  initialArticles: Article[];
  totalPages: number;
  currentPage: number;
}

export default function ArticlesList({ initialArticles, totalPages, currentPage }: ArticlesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const buildSearchWhere = (query: string) => {
    if (!query) return null;
    
    const words = query.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) return null;
    
    return {
      _and: words.map(word => ({
        title: { _ilike: `%${word}%` }
      }))
    };
  };

  useEffect(() => {
    const performSearch = async () => {
      const whereCondition = buildSearchWhere(searchQuery);
      
      if (!whereCondition) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ where: whereCondition }),
        });
        
        const data = await response.json();
        setSearchResults(data.articles || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const getPreview = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n').filter(line => line.trim());
    const withoutFirstLine = lines.slice(1).join('\n');
    const sentences = withoutFirstLine.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 2).join(' ').trim().substring(0, 200) + '...';
  };

  const getFirstImage = (text: string) => {
    if (!text) return null;
    // Match markdown image syntax: ![alt](url)
    const match = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    return match ? `/api/img/q/${match[2]}` : null;
  };

  const cleanTitle = (title: string) => {
    if (!title) return '';
    return title.replace(/[#*]+/g, '').trim();
  };

  const displayArticles = searchQuery ? searchResults : initialArticles;

  return (
    <>
      <SearchField onSearch={setSearchQuery} />

      {isSearching && (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600 dark:border-zinc-600 dark:border-t-blue-400"></div>
        </div>
      )}

      {!isSearching && (
        <>
          <div className="space-y-4">
            {displayArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.genid}`}
                className="block group"
              >
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-[1.01] dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-start gap-4">
                    {article.text && getFirstImage(article.text) && (
                      <div className="flex-shrink-0">
                        <img 
                          src={getFirstImage(article.text)!} 
                          alt={cleanTitle(article.title)}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 transition-colors">
                        {cleanTitle(article.title)}
                      </h2>
                      {article.text && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {getPreview(article.text)}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                        ID: {article.genid}
                      </p>
                    </div>
                    <svg
                      className="h-6 w-6 flex-shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {displayArticles.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                {searchQuery ? 'No articles match your search.' : 'No articles found.'}
              </p>
            </div>
          )}

          {!searchQuery && <Pagination currentPage={currentPage} totalPages={totalPages} />}
        </>
      )}
    </>
  );
}
