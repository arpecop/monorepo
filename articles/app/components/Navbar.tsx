'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Articles
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            ) : user ? (
              <>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
