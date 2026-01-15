import { getClient } from '@/lib/apollo-client';
import { GET_ARTICLE_BY_GENID, GET_SIMILAR_ARTICLES } from '@/lib/queries';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ genid: string }>;
}): Promise<Metadata> {
  const { genid } = await params;
  
  try {
    const { data } = await getClient().query({
      query: GET_ARTICLE_BY_GENID,
      variables: { _eq: genid },
    });
    
    const article = data?.qa_ai?.[0];
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }

    const cleanTitle = (title: string) => {
      if (!title) return '';
      return title.replace(/[#*]+/g, '').trim();
    };

    const getDescription = (text: string) => {
      if (!text) return '';
      const lines = text.split('\n').filter(line => line.trim());
      const withoutFirstLine = lines.slice(1).join('\n');
      const sentences = withoutFirstLine.match(/[^.!?]+[.!?]+/g) || [];
      return sentences.slice(0, 2).join(' ').trim().substring(0, 160);
    };

    const title = cleanTitle(article.title);
    const description = getDescription(article.text);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (e) {
    return {
      title: 'Article',
      description: 'Read our article',
    };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ genid: string }>;
}) {
  const { genid } = await params;
  let article = null;
  let similarArticles: any[] = [];
  let error = null;

  try {
    const { data } = await getClient().query({
      query: GET_ARTICLE_BY_GENID,
      variables: { _eq: genid },
    });
    article = data?.qa_ai?.[0];

    // Get similar articles based on title keywords
    if (article?.title) {
      const cleanTitle = (title: string) => {
        if (!title) return '';
        return title.replace(/[#*]+/g, '').trim();
      };

      const titleWords = cleanTitle(article.title)
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3); // Only use words longer than 3 characters

      if (titleWords.length > 0) {
        const similarWhere = {
          _or: titleWords.map(word => ({
            title: { _ilike: `%${word}%` }
          }))
        };

        try {
          const { data: similarData } = await getClient().query({
            query: GET_SIMILAR_ARTICLES,
            variables: { where: similarWhere, excludeGenid: genid },
          });
          similarArticles = similarData?.qa_ai || [];
        } catch (e) {
          console.error('Error fetching similar articles:', e);
        }
      }
    }
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to articles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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

          {/* Similar Articles Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)' }}>
                  Similar Articles
                </h2>
                
                {similarArticles.length > 0 ? (
                  <div className="space-y-3">
                    {similarArticles.map((similar: any) => (
                      <Link
                        key={similar.id}
                        href={`/article/${similar.genid}`}
                        className="block group"
                      >
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-700 dark:hover:bg-zinc-750">
                          <h3 className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 line-clamp-2">
                            {cleanTitle(similar.title)}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No similar articles found.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
