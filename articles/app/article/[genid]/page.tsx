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

  const rewriteImageUrls = (markdown: string) => {
    if (!markdown) return '';
    // Replace absolute URLs: ![alt](https://example.com/...) -> ![alt](https://renewz.org/api/img/q/https://example.com/...)
    let processed = markdown.replace(
      /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g,
      '![$1](https://renewz.org/api/img/q/$2)'
    );
    // Replace relative URLs: ![alt](/path/to/image.jpg) -> ![alt](https://renewz.org/api/img/q/path/to/image.jpg)
    processed = processed.replace(
      /!\[([^\]]*)\]\((\/[^)]+)\)/g,
      (match, alt, path) => `![${alt}](https://renewz.org/api/img/q${path})`
    );
    return processed;
  };

  const processedText = rewriteImageUrls(removeFirstLine(article.text));

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
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }}>
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

          <div className="prose max-w-none" style={{ fontFamily: 'var(--font-inter, "Inter", system-ui, sans-serif)' }}>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }} {...props} />,
                h2: ({ node, ...props }) => <h2 style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }} {...props} />,
                h3: ({ node, ...props }) => <h3 style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }} {...props} />,
                h4: ({ node, ...props }) => <h4 style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }} {...props} />,
                h5: ({ node, ...props }) => <h5 style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }} {...props} />,
                h6: ({ node, ...props }) => <h6 style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }} {...props} />,
                p: ({ node, ...props }) => <p style={{ fontFamily: 'var(--font-inter, "Inter", system-ui, sans-serif)' }} {...props} />,
                li: ({ node, ...props }) => <li style={{ fontFamily: 'var(--font-inter, "Inter", system-ui, sans-serif)' }} {...props} />,
                code: ({ node, ...props }) => <code style={{ fontFamily: 'var(--font-fira-code, "Fira Code", monospace)' }} {...props} />,
              }}
            >
              {processedText}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
