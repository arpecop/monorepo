import { getClient } from '@/lib/apollo-client';
import { GET_ARTICLES, GET_ARTICLES_COUNT } from '@/lib/queries';
import ArticlesList from './components/ArticlesList';

// Removed edge runtime for consistent deployment

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const searchQuery = params.search;
  const offset = (page - 1) * 10;

  let articles = [];
  let totalCount = 0;
  let error = null;

  try {
    // Build where clause for search
    const where = searchQuery 
      ? { title: { _ilike: `%${searchQuery}%` } }
      : {};

    const [articlesResult, countResult] = await Promise.all([
      getClient().query({
        query: GET_ARTICLES,
        variables: { offset, where },
        context: {
          fetchOptions: {
            next: { revalidate: 60 }
          }
        }
      }),
      getClient().query({
        query: GET_ARTICLES_COUNT,
        variables: { where },
        context: {
          fetchOptions: {
            next: { revalidate: 3600 }
          }
        }
      }),
    ]);
    articles = articlesResult.data?.qa_ai || [];
    totalCount = countResult.data?.qa_ai_aggregate?.aggregate?.count || 0;
  } catch (e: any) {
    error = e.message;
  }

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Renewz.org
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Explore our collection of articles'}
          </p>
          {searchQuery && (
            <a 
              href="/"
              className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Clear search
            </a>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-200 mb-2">Error loading articles:</p>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
              Make sure the <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">qa_ai</code> table exists in your Hasura database with fields: id, title, genid
            </p>
          </div>
        )}

        {!error && (
          <ArticlesList 
            initialArticles={articles}
            totalPages={totalPages}
            currentPage={page}
          />
        )}
      </div>
    </div>
  );
}
