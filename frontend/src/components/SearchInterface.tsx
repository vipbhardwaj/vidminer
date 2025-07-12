'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  videoId: string;
  title: string;
  timestamp: number;
  text: string;
  confidence: number;
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // Mock search function - replace with actual API call
  const searchTranscripts = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock results
      const mockResults: SearchResult[] = [
        {
          videoId: '1',
          title: 'Introduction to Machine Learning',
          timestamp: 120,
          text: '...and that\'s how machine learning algorithms work...',
          confidence: 0.95,
        },
        {
          videoId: '2',
          title: 'Deep Learning Basics',
          timestamp: 45,
          text: '...deep learning is a subset of machine learning...',
          confidence: 0.88,
        },
      ];
      
      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp from seconds to MM:SS
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Effect to trigger search on debounced query change
  useEffect(() => {
    if (debouncedQuery) {
      searchTranscripts(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search video transcripts..."
          className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-purple-900/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
        />
      </div>

      {/* Results */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-purple-900/30">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-100">{result.title}</h3>
                <span className="text-sm text-purple-400">{formatTimestamp(result.timestamp)}</span>
              </div>
              <p className="text-gray-300 mb-2">{result.text}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-gray-400">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <button
                  onClick={() => {
                    // TODO: Implement copy link functionality
                    console.log('Copy link:', result.videoId, result.timestamp);
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))
        ) : query ? (
          <p className="text-center text-gray-400">No results found</p>
        ) : null}
      </div>
    </div>
  );
} 