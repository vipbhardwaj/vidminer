'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchTranscripts, SearchResult } from '../utils/api';

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Search function using real API
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await searchTranscripts(searchQuery);
      if (response.error) {
        throw new Error(response.error);
      }
      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during search');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp from seconds to MM:SS
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(null);
  };

  // Effect to trigger search on debounced query change
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search video transcripts..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 border-r-2 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-900/20 border border-red-900 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && results.length === 0 && query && (
        <div className="text-gray-400 text-center py-4">
          No results found
        </div>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={`${result.video}-${result.start}-${index}`}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">
                {result.video.replace(/\.[^/.]+$/, "")}
              </h3>
              <span className="text-purple-400">
                {formatTimestamp(result.start)}
              </span>
            </div>
            <p className="text-gray-300">{result.text}</p>
            <div className="mt-2 text-sm text-gray-400">
              Confidence: {Math.round(result.score * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 