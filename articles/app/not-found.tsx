import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Renewz.org',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-9xl font-bold text-zinc-900 dark:text-zinc-50 mb-4" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          404
        </h1>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          Page Not Found
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Go to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-base font-medium rounded-md text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750"
          >
            Contact Support
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            You might be interested in:
          </h3>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Browse all articles
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
