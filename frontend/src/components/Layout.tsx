import { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <nav className="bg-gray-800 border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link 
                href="/"
                className="flex items-center px-2 py-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span className="text-xl font-bold">VidMiner</span>
              </Link>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/upload"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Upload
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Search
                </Link>
                <Link
                  href="/library"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Library
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