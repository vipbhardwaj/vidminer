'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VideoPlayerProps {
  videoId: string;
  videoTitle: string;
  onClose: () => void;
}

export default function VideoPlayer({ videoId, videoTitle, onClose }: VideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState<Array<{time: number, text: string}>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock transcription data - replace with actual API call
  useEffect(() => {
    // Simulate loading transcription
    const mockTranscription = [
      { time: 0, text: "Welcome to this video about machine learning." },
      { time: 5, text: "Today we'll be discussing neural networks." },
      { time: 10, text: "Neural networks are a fundamental concept in AI." },
      { time: 15, text: "They consist of layers of interconnected nodes." },
      { time: 20, text: "Each node processes input and produces output." },
    ];
    setTranscription(mockTranscription);
  }, [videoId]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const seekToTime = (time: number) => {
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSearch = () => {
    // Filter transcription based on search query
    const results = transcription.filter(item => 
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-purple-900/30">
          <h2 className="text-xl font-semibold text-gray-100">{videoTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Video Section */}
          <div className="flex-1 p-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-full"
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={`/api/videos/${videoId}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Video Controls */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-l border-purple-900/30 p-4">
            {/* Search */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-100 mb-3">Search in Video</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transcript..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-purple-900/30 rounded text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Search Results</h4>
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => seekToTime(result.time)}
                    >
                      <div className="text-xs text-purple-400 mb-1">
                        {formatTime(result.time)}
                      </div>
                      <div className="text-sm text-gray-200">{result.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcription */}
            <div>
              <h3 className="text-lg font-medium text-gray-100 mb-3">Transcription</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transcription.map((item, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      Math.abs(currentTime - item.time) < 2
                        ? 'bg-purple-900/30 border border-purple-500/30'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => seekToTime(item.time)}
                  >
                    <div className="text-xs text-purple-400 mb-1">
                      {formatTime(item.time)}
                    </div>
                    <div className="text-sm text-gray-200">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 