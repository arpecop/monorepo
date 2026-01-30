export function GET() {
  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /

# Disallow authentication pages
User-agent: *
Disallow: /login
Disallow: /signup
Disallow: /api/

# Sitemap location
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://renewz.org'}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
