import { getClient } from '@/lib/apollo-client';
import { GET_ARTICLES, GET_ARTICLES_COUNT } from '@/lib/queries';
import Link from 'next/link';
import Pagination from './components/Pagination';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * 10;

  let articles = [];
  let totalCount = 0;
  let error = null;

  try {
    const [articlesResult, countResult] = await Promise.all([
      getClient().query({
        query: GET_ARTICLES,
        variables: { offset },
        context: {
          fetchOptions: {
            next: { revalidate: 60 }
          }
        }
      }),
      getClient().query({
        query: GET_ARTICLES_COUNT,
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

  const getPreview = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n').filter(line => line.trim());
    const withoutFirstLine = lines.slice(1).join('\n');
    const sentences = withoutFirstLine.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 2).join(' ').trim().substring(0, 200) + '...';
  };

  const cleanTitle = (title: string) => {
    if (!title) return '';
    return title.replace(/[#*]+/g, '').trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Articles
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Explore our collection of articles
          </p>
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
          <>
            <div className="space-y-4">
              {articles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/article/${article.genid}`}
                  className="block group"
                >
                  <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-[1.01] dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
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

            {articles.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-zinc-600 dark:text-zinc-400">No articles found.</p>
              </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
