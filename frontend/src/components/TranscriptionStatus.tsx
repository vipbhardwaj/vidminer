'use client';

import { useState, useEffect } from 'react';

interface TranscriptionJob {
  id: string;
  filename: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  startTime: string;
  endTime?: string;
}

export default function TranscriptionStatus({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<TranscriptionJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock function to fetch job status - replace with actual API call
  const fetchJobStatus = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock job data
      const mockJob: TranscriptionJob = {
        id,
        filename: 'example.mp4',
        status: 'processing',
        progress: 45,
        startTime: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      };
      
      setJob(mockJob);
      setError(null);
    } catch (error) {
      console.error('Error fetching job status:', error);
      setError('Failed to fetch job status');
    }
  };

  // Mock function to retry failed job - replace with actual API call
  const retryJob = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setJob(prev => prev ? {
        ...prev,
        status: 'queued',
        progress: 0,
        error: undefined,
        startTime: new Date().toISOString(),
        endTime: undefined,
      } : null);
      
      setError(null);
    } catch (error) {
      console.error('Error retrying job:', error);
      setError('Failed to retry job');
    }
  };

  // Format relative time (e.g., "5 minutes ago")
  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return 'just now';
  };

  // Fetch job status on mount and periodically
  useEffect(() => {
    fetchJobStatus(jobId);
    
    // Poll for updates every 5 seconds if job is not completed/failed
    const interval = setInterval(() => {
      if (job && !['completed', 'failed'].includes(job.status)) {
        fetchJobStatus(jobId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobId, job?.status]);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{job.filename}</h3>
        <p className="text-sm text-gray-500">Started {getRelativeTime(job.startTime)}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {job.status === 'queued' ? 'Queued' :
             job.status === 'processing' ? 'Processing' :
             job.status === 'completed' ? 'Completed' : 'Failed'}
          </span>
          <span className="text-sm text-gray-500">{job.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              job.status === 'failed' ? 'bg-red-500' :
              job.status === 'completed' ? 'bg-green-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      {job.error && (
        <div className="mb-4">
          <p className="text-sm text-red-600">{job.error}</p>
        </div>
      )}

      {job.status === 'failed' && (
        <button
          onClick={retryJob}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Retry Transcription
        </button>
      )}
    </div>
  );
} 