'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getNavItemClasses = (path: string) => {
    const active = isActive(path);
    return `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative group ${
      active
        ? 'text-purple-400 bg-purple-900/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'
        : 'text-gray-300 hover:text-purple-400 hover:bg-purple-900/10'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <nav className="bg-gray-800/95 backdrop-blur-sm border-b border-purple-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/"
                className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive('/')
                    ? 'text-purple-400 bg-purple-900/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/10'
                }`}
              >
                <span className="text-xl font-bold">VidMiner</span>
              </Link>
              
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                <Link
                  href="/upload"
                  className={getNavItemClasses('/upload')}
                >
                  <span className="relative">
                    Upload
                    {isActive('/upload') && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                    )}
                  </span>
                </Link>
                <Link
                  href="/search"
                  className={getNavItemClasses('/search')}
                >
                  <span className="relative">
                    Search
                    {isActive('/search') && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                    )}
                  </span>
                </Link>
                <Link
                  href="/library"
                  className={getNavItemClasses('/library')}
                >
                  <span className="relative">
                    Library
                    {isActive('/library') && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                    )}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6 text-gray-100">
        {children}
      </main>
    </div>
  );
} 