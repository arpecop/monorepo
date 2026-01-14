import { getClient } from '@/lib/apollo-client';
import { GET_ARTICLE_BY_GENID } from '@/lib/queries';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ genid: string }>;
}) {
  const { genid } = await params;
  let article = null;
  let error = null;

  try {
    const { data } = await getClient().query({
      query: GET_ARTICLE_BY_GENID,
      variables: { _eq: genid },
    });
    article = data?.qa_ai?.[0];
  } catch (e: any) {
    error = e.message;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-200 mb-2">Error loading article:</p>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
          <Link
            href="/"
            className="mt-6 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to articles
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Article not found</p>
          </div>
          <Link
            href="/"
            className="mt-6 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to articles
          </Link>
        </div>
      </div>
    );
  }

  const removeFirstLine = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.slice(1).join('\n');
  };

  const cleanTitle = (title: string) => {
    if (!title) return '';
    return title.replace(/[#*]+/g, '').trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to articles
        </Link>

        <article className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              {cleanTitle(article.title)}
            </h1>
            {article.date && (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </header>

          <div className="prose max-w-none">
            <ReactMarkdown>{removeFirstLine(article.text)}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
