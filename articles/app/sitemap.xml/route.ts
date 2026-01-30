import { getClient } from '@/lib/apollo-client';
import { GET_ARTICLES_COUNT } from '@/lib/queries';
import { gql } from '@apollo/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://renewz.org';
const ARTICLES_PER_PAGE = 10;

const GET_ARTICLES_FOR_SITEMAP = gql`
  query GetArticlesForSitemap($offset: Int!) {
    qa_ai(limit: 1000, offset: $offset, order_by: {id: desc}) {
      genid
      date
    }
  }
`;

export async function GET() {
  try {
    // Get total count
    const countResult = await getClient().query({
      query: GET_ARTICLES_COUNT,
    });
    const totalArticles = countResult.data?.qa_ai_aggregate?.aggregate?.count || 0;

    // Generate sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.5', changefreq: 'monthly' },
      { url: '/terms', priority: '0.5', changefreq: 'monthly' },
    ];

    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add paginated homepage URLs
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
    for (let page = 1; page <= Math.min(totalPages, 100); page++) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/?page=${page}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    // Fetch articles in batches (limit to first 10000 for sitemap size)
    const maxArticles = Math.min(totalArticles, 10000);
    const batches = Math.ceil(maxArticles / 1000);

    for (let batch = 0; batch < batches; batch++) {
      const offset = batch * 1000;
      const articlesResult = await getClient().query({
        query: GET_ARTICLES_FOR_SITEMAP,
        variables: { offset },
      });

      const articles = articlesResult.data?.qa_ai || [];

      articles.forEach((article: any) => {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/article/${article.genid}</loc>\n`;
        if (article.date) {
          xml += `    <lastmod>${new Date(article.date).toISOString()}</lastmod>\n`;
        }
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += '</urlset>';

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
