'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardData, type DashboardData } from '../utils/api';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
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

    loadDashboardData();
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
          <p className="text-red-400">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { stats, recentVideos, recentSearches, recentActivity } = dashboardData;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-900/30">
          <h3 className="text-gray-400 text-sm font-medium">Total Videos</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.totalVideos}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-900/30">
          <h3 className="text-gray-400 text-sm font-medium">Total Duration</h3>
          <p className="text-3xl font-bold text-purple-400">{Math.round(stats.totalDuration / 3600)}h</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-900/30">
          <h3 className="text-gray-400 text-sm font-medium">Processing</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.processingVideos}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-900/30">
          <h3 className="text-gray-400 text-sm font-medium">Completed</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.completedVideos}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Videos */}
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-900/30">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Videos</h2>
          <div className="space-y-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="flex items-center space-x-4">
                <div className="w-24 h-16 bg-gray-700 rounded relative">
                  {video.thumbnailUrl && (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-200">{video.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(video.uploadedAt).toLocaleDateString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    video.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    video.status === 'processing' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {video.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-900/30">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'upload' ? 'bg-blue-900/30 text-blue-400' :
                  activity.type === 'transcription' ? 'bg-purple-900/30 text-purple-400' :
                  'bg-green-900/30 text-green-400'
                }`}>
                  {activity.type === 'upload' ? '↑' :
                   activity.type === 'transcription' ? 'T' : 'S'}
                </div>
                <div>
                  <p className="text-sm text-gray-200">{activity.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="bg-gray-800 p-6 rounded-lg border border-purple-900/30 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Searches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentSearches.map((search) => (
              <div key={search.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded border border-purple-900/30">
                <div>
                  <p className="font-medium text-gray-200">{search.query}</p>
                  <p className="text-sm text-gray-400">
                    {search.resultCount} results • {new Date(search.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  onClick={() => {
                    // TODO: Implement search navigation
                    console.log('Navigate to search:', search.query);
                  }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 