'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchDashboardData, type DashboardData } from '@/utils/api';
import VideoPlayer from './VideoPlayer';

export default function LibraryInterface() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{id: string, title: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadLibraryData() {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchDashboardData();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setDashboardData(response.data);
      }
      
      setIsLoading(false);
    }

    loadLibraryData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
          <p className="text-red-400">Error loading library: {error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { recentVideos } = dashboardData;

  const handlePlayVideo = (video: any) => {
    setSelectedVideo({ id: video.id, title: video.title });
  };

  const handleSearchVideo = (video: any) => {
    // Navigate to search page with video pre-selected
    router.push(`/search?video=${encodeURIComponent(video.title)}`);
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Video Library</h1>
        <p className="text-gray-400">Browse and manage your uploaded videos</p>
      </div>

      {/* Video Grid */}
      {recentVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No videos uploaded yet</div>
          <p className="text-gray-500">Upload your first video to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentVideos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-lg border border-purple-900/30 overflow-hidden hover:border-purple-500/50 transition-colors">
              <div className="w-full h-48 bg-gray-700 relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    video.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    video.status === 'processing' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {video.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-200 mb-2 truncate" title={video.title}>
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {new Date(video.uploadedAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handlePlayVideo(video)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded transition-colors"
                  >
                    Play
                  </button>
                  <button 
                    onClick={() => handleSearchVideo(video)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-2 px-3 rounded transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.id}
          videoTitle={selectedVideo.title}
          onClose={closeVideoPlayer}
        />
      )}
    </div>
  );
} 